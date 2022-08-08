import { Selector, t } from 'testcafe';
import { getRandom } from '../utils';
import testData from '../testData.json';

export default class BasePage {
    constructor() {
        this.pageHeaderSelector = Selector('.pageheader');
        this.pageTitleSelector = Selector('title');
        this.themeLinkSelector = Selector('[data-genre-group="themes"] a');
        this.mainNavPanelRootSelector = (rootItem) =>
            Selector('.store_nav').find('a').withText(rootItem);
        this.mainNavPanelChildItemSelector = (childItem) =>
            Selector('.store_nav a.popup_menu_item').withExactText(childItem);
        this.keepNumRegex = /[^0-9,.-]+/g;
    }

    // if title is not displayed where it used to be due to some non-standard design
    // (for example, Steam Survival Fest), take title from html page title
    async getPageHeader() {
        if (await this.pageHeaderSelector.exists) {
            return (await this.pageHeaderSelector.textContent).trim();
        } else {
            return (await this.pageTitleSelector.textContent).trim();
        }
    }

    async mainNavigation(rootItem, childItem = undefined) {
        if (childItem) {
            await t.hover(this.mainNavPanelRootSelector(rootItem))
                .click(this.mainNavPanelChildItemSelector(childItem));
        } else {
            await t.click(this.mainNavPanelRootSelector(rootItem));
        }

    }

    async openRandomTheme() {
        await t.hover(this.mainNavPanelRootSelector('Categories'));
        const randomIndex = getRandom(await this.themeLinkSelector.count);
        const themeTitle = await this.themeLinkSelector.nth(randomIndex).textContent;
        await t.click(this.themeLinkSelector.nth(randomIndex));
        return themeTitle;
    }
}