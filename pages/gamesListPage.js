import { Selector, t } from 'testcafe';
import BasePage from './basePage';
import { scrollDownUntilElementExists } from '../utils.js';

export default class GamesListPage extends BasePage {
    constructor() {
        super();
        this.topSellerTabSelector = Selector('#tab_select_TopSellers, [class*="saleitembrowser_FlavorLabel"]')
            .withText(/Top Sellers/i);
        this.tabContentGameItemSelector = '.tab_item, [class*="salepreviewwidgets_StoreSaleWidgetContainer"]';
        this.tabContentGamePricesBlockSelector = '.discount_block, .StoreSalePriceWidgetContainer';
        this.gameTitleSelector = '.tab_item_name, [class*="salepreviewwidgets_StoreSaleWidgetTitle"]';
        this.gameDiscount = '.discount_pct, [class*="salepreviewwidgets_StoreSaleDiscountBox"]';
        this.gameInitialPrice = '.discount_original_price, [class*="salepreviewwidgets_StoreOriginalPrice"]';
        this.gameFinalPrice = Selector('#tab_content_TopSellers .discount_final_price, [class*="facetedbrowse"] [class*="salepreviewwidgets_StoreSalePriceBox"]');
    }

    async goToTopSellerTab() {
        await scrollDownUntilElementExists(this.topSellerTabSelector);
        await t.click(this.topSellerTabSelector);
        await t.expect(Selector(this.gameFinalPrice).exists).ok();
    }

    async getCheapestGameIndex() {
        const countPaidGames = await this.gameFinalPrice.count;
        const prices = [];
        for (let i = 0; i < countPaidGames; i++) {
            let finalPriceText = (await this.gameFinalPrice.nth(i).textContent);
            let finalPriceNum = finalPriceText.replace(this.keepNumRegex, "").replace(",", ".") + 0.0;
            if (finalPriceNum != 0) {
                prices.push({ i, finalPriceNum });
            }
        }
        prices.sort(function (a, b) { return a.finalPriceNum - b.finalPriceNum });
        return prices[0].i;
    }

    async getGameData(index) {
        const gameData = {};
        gameData.title = (await this.gameFinalPrice.nth(index)
            .parent(this.tabContentGameItemSelector).find(this.gameTitleSelector).textContent).trim();
        const discountApplied = await this.gameFinalPrice.nth(index)
            .parent(this.tabContentGamePricesBlockSelector).find(this.gameDiscount).exists;
        if (discountApplied) {
            gameData.discount = (await this.gameFinalPrice.nth(index)
                .parent(this.tabContentGamePricesBlockSelector).find(this.gameDiscount).textContent).trim();
            gameData.initialPrice = (await this.gameFinalPrice.nth(index)
                .parent(this.tabContentGamePricesBlockSelector).find(this.gameInitialPrice).textContent).trim();
        }
        gameData.finalPrice = (await this.gameFinalPrice.nth(index).textContent).trim();
        return gameData;
    }

    async openCheapestGame() {
        const cheapestGameIndex = await this.getCheapestGameIndex();
        const gameData = await this.getGameData(cheapestGameIndex);
        await t.click(this.gameFinalPrice.nth(cheapestGameIndex)
            .parent(this.tabContentGameItemSelector).find(this.gameTitleSelector));
        await t.maximizeWindow();
        return gameData;
    }
}