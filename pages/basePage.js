import { Selector, t } from 'testcafe';
import { getRandom } from '../utils';

export default class BasePage {
    constructor() {
        this.yourStoreTabSelector = Selector('#foryou_tab');
        this.categoriesTabSelector = Selector('#genre_tab');
        this.themeLinkSelector = Selector('[data-genre-group="themes"] a');
        this.communityRecommendationsLinkSelector = Selector('#foryou_flyout a')
            .withText('Community Recommendations');
    }

    async openRandomTheme() {
        await t.hover(this.categoriesTabSelector);
        const randomIndex = getRandom(await this.themeLinkSelector.count);
        const themeTitle = await this.themeLinkSelector.nth(randomIndex).textContent;
        await t.click(this.themeLinkSelector.nth(randomIndex));
        return themeTitle;
    }

    async goToCommunityRecommendations() {
        await t.hover(this.yourStoreTabSelector)
            .click(this.communityRecommendationsLinkSelector);
    }
}