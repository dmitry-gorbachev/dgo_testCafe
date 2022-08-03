import { Selector, t } from "testcafe";
import BasePage from "./basePage";

export default class GamesListPage extends BasePage {
    constructor() {
        super();
        this.gameTitleSelector = Selector('[class*="HomeHeaderContent"] [class*="AppName"]');
        this.pricesBaseSelector = Selector('.game_purchase_action_bg');
        this.discountSelector = '.discount_pct';
        this.initialPriceSelector = '.discount_original_price';
        this.finalPriceSelector = '.discount_final_price,.game_purchase_price';
    }

    async getGameData() {
        const gameData = {};
        gameData.title = await this.gameTitleSelector.textContent;
        const discountApplied = await this.pricesBaseSelector.find(this.discountSelector).exists;
        if (discountApplied) {
            gameData.discount = (await this.pricesBaseSelector.find(this.discountSelector).textContent).trim();
            gameData.initialPrice = (await this.pricesBaseSelector.find(this.initialPriceSelector).textContent).trim();
        }
        gameData.finalPrice = (await this.pricesBaseSelector.find(this.finalPriceSelector).textContent).trim();
        return gameData;
    }
}