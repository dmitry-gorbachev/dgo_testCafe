import { Selector } from "testcafe";
import BasePage from "./basePage";
import { waitUntilElementExists } from '../utils.js';

export default class HomePage extends BasePage {
    constructor() {
        super();
        this.homePageGutterPanelSelector = Selector('.home_page_gutter');
        
    }

    async isHomePageOpened() {
        return await this.homePageGutterPanelSelector.exists;
    }
}