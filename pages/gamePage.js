import { Selector, t } from "testcafe";
import BasePage from "./basePage";

export default class GamesListPage extends BasePage {
    constructor() {
        super();
        this.gameTitleSelector = Selector('[class*="HomeHeaderContent"] [class*="AppName"]');
        this.pricesBaseSelector = Selector('.game_area_purchase_game');
        this.discountSelector = '.discount_pct';
        this.initialPriceSelector = '.discount_original_price';
        this.finalPriceSelector = '.discount_final_price,.game_purchase_price';
    }

    async getGameData() {
        const gameData = {};
        gameData.title = await this.gameTitleSelector.textContent;
        const discountApplied = await this.pricesBaseSelector.nth(0).find(this.discountSelector).exists;
        if (discountApplied) {
            gameData.discount = (await Selector(this.pricesBaseSelector).nth(0).find(this.discountSelector).textContent).trim();
            gameData.initialPrice = (await Selector(this.pricesBaseSelector).nth(0).find(this.initialPriceSelector).textContent).trim();
        }
        gameData.finalPrice = (await Selector(this.pricesBaseSelector).nth(0).find(this.finalPriceSelector).textContent).trim();
        return gameData;
    }
}