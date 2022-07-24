import { Selector, t } from 'testcafe';
import BasePage from './basePage';
import { scrollDownUntilElementExists, waitUntilElementExists } from '../utils.js';
import testData from '../testData.json';

export default class GamesListPage extends BasePage {
    constructor() {
        super();
        this.pageTitleSelector = Selector('.ContentHubTitle');
        this.topSellerTabSelector = Selector('[class*="saleitembrowser_FlavorLabel"]').withText(/Top Sellers/i);
        this.gameTitleSelector = '[class*="WidgetTitle"]';
        this.gameDiscount = '[class*="StoreSaleDiscountBox"]';
        this.gameInitialPrice = '[class*="StoreOriginalPrice"]';
        this.gameFinalPrice = Selector('.sale_item_browser [class*="StoreSalePriceBox"]');
    }

    async getPageTitle() {
        return (await this.pageTitleSelector.textContent).trim();
    }

    async goToTopSellerTab() {
        await scrollDownUntilElementExists(this.topSellerTabSelector);
        await t.click(this.topSellerTabSelector);
        await waitUntilElementExists(this.gameFinalPrice);
    }

    async getCheapestGame() {
        const countPaidGames = await this.gameFinalPrice.count;
        const prices = [];
        for (let i = 0; i < countPaidGames; i++) {
            let finalPriceText = (await this.gameFinalPrice.nth(i).textContent);
            let finalPriceNum = finalPriceText.replace(testData.keepnumberRegexp, "").replace(",", ".") + 0.0;
            if (finalPriceNum != 0) {
                prices.push({ i, finalPriceNum });
            }
        }
        prices.sort(function (a, b) { return a.finalPriceNum - b.finalPriceNum });
        return await this.getGameData(prices[0].i);
    }

    async getGameData(index) {
        const gameData = {};
        gameData.index = index;
        gameData.title = (await this.gameFinalPrice.nth(index).parent('[class*="StoreSaleWidgetRight"]').find(this.gameTitleSelector).textContent).trim();
        const discountApplied = await this.gameFinalPrice.nth(index).parent(1).find(this.gameDiscount).exists;
        if (discountApplied) {
            gameData.discount = (await this.gameFinalPrice.nth(index).parent(1).find(this.gameDiscount).textContent).trim();
            gameData.initialPrice = (await this.gameFinalPrice.nth(index).parent().find(this.gameInitialPrice).textContent).trim();
        }
        gameData.finalPrice = (await this.gameFinalPrice.nth(index).textContent).trim();
        return gameData;
    }

    async openCheapestGame() {
        const cheapestGame = await this.getCheapestGame();
        await t.click(this.gameFinalPrice.nth(cheapestGame.index).parent('[class*="StoreSaleWidgetRight"]').find(this.gameTitleSelector));
        await t.maximizeWindow();
        return cheapestGame;
    }
}