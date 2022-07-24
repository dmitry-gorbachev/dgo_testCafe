import { Selector, t, ClientFunction } from "testcafe";
import BasePage from "./basePage";
import testData from '../testData.json';

export default class CommunityRecommendationsPage extends BasePage {
    constructor() {
        super();
        this.pageHeaderSelector = Selector('.pageheader');
        this.filtersAndOptionsButtonSelector = Selector('.advanced_controls_toggle_ctn');
        this.filtersAndOptionsSection = Selector('.show_advanced_controls');
        this.customPlaytimeRangeRadiobuttonSelector = Selector('#review_playtime_preset_custom');
        this.sliderBarSelector = Selector('#app_reviews_playtime_slider');
        this.playtimeSliderMinSelector = this.sliderBarSelector.find('a').nth(0);
        this.playtimeSliderMaxSelector = this.sliderBarSelector.find('a').nth(1);
        this.reviewerPlaytimeSelector = Selector('.reviewed_app .hours');
    }

    async getPageHeader() {
        return (await this.pageHeaderSelector.textContent).trim();
    }

    async expandFiltersAndOptions() {
        if (!(await this.filtersAndOptionsSection.exists)) {
            await t.click(this.filtersAndOptionsButtonSelector);
        }
    }

    async isFiltersSectionDisplayed() {
        return await this.filtersAndOptionsSection.exists;
    }

    async pickYourOwnPlaytimeRange() {
        await t.click(this.customPlaytimeRangeRadiobuttonSelector);
    }

    async getSlidersValues() {
        let minNow = await this.getSliderValue(this.playtimeSliderMinSelector);
        let maxNow = await this.getSliderValue(this.playtimeSliderMaxSelector);
        return {
            min: minNow,
            max: maxNow
        }
    }

    async filterByCustomPlayTime(min, max) {
        min = min == 'unlimited' ? 0 : min;
        max = max == 'unlimited' ? 100 : max;
        let currentValues = await this.getSlidersValues();
        if (currentValues.max == 0 || currentValues.max < min) {
            if (currentValues.min == currentValues.min && currentValues.min != 0) {
                await this.dragSlider(this.playtimeSliderMinSelector, -1);
            }
            await this.dragSlider(this.playtimeSliderMaxSelector, max);
            await this.dragSlider(this.playtimeSliderMinSelector, min);
        } else {
            await this.dragSlider(this.playtimeSliderMinSelector, min);
            await this.dragSlider(this.playtimeSliderMaxSelector, max);
        }
        currentValues = await this.getSlidersValues();
    }

    async getSliderValue(slider) {
        return parseInt((await slider.getAttribute('style')).replace(/[^0-9.]+/g, ""), 10); //I don't know why, but putting the regexp to testData breaks replacement here. I tried it.
    }

    async dragSlider(slider, expectedValue) {
        let currentValue = await this.getSliderValue(slider);
        let shift;
        while (currentValue != expectedValue) {
            shift = Math.ceil((expectedValue - currentValue) * 2.7667 + 1);
            await t.drag(slider, shift, 0);
            currentValue = await this.getSliderValue(slider);
        }
    }

    async getPlaytimeMinMaxValues() {
        const reviewsCount = await this.reviewerPlaytimeSelector.count;
        const playtimes = [];
        for (let i = 0; i < reviewsCount; i++) {
            playtimes.push(parseFloat((await this.reviewerPlaytimeSelector.nth(i).textContent).replace(/[^0-9.]+/g, ""))); //I don't know why, but putting the regexp to testData breaks replacement here. I tried it.
        }
        const playTimeMin = Math.min(...playtimes);
        const playTimeMax = Math.max(...playtimes);
        return {
            min: playTimeMin,
            max: playTimeMax
        };
    }
}