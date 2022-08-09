import { Selector, t, ClientFunction } from "testcafe";
import BasePage from "./basePage";

export default class CommunityRecommendationsPage extends BasePage {
    constructor() {
        super();
        this.filtersAndOptionsButtonSelector = Selector('.advanced_controls_toggle_ctn');
        this.filtersAndOptionsSection = Selector('.show_advanced_controls');
        this.customPlaytimeRangeRadiobuttonSelector = Selector('#review_playtime_preset_custom');
        this.sliderBarSelector = Selector('#app_reviews_playtime_slider');
        this.playtimeSliderMinSelector = this.sliderBarSelector.find('a').nth(0);
        this.playtimeSliderMaxSelector = this.sliderBarSelector.find('a').nth(1);
        this.reviewerPlaytimeSelector = Selector('.reviewed_app .hours');
    }

    async expandFiltersAndOptions() {
        if (!(await this.isFiltersSectionDisplayed())) {
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
            if (currentValues.min == currentValues.max && currentValues.min != 0) {
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
        return parseInt((await slider.getAttribute('style')).replace(this.keepNumRegex, ""), 10);
    }

    async dragSlider(slider, expectedValue) {
        let currentValue = await this.getSliderValue(slider);
        let shift;
        while (currentValue != expectedValue) {
            shift = Math.ceil((expectedValue - currentValue) * (await this.getSliderShiftWidth()));
            await t.drag(slider, shift, 0);
            currentValue = await this.getSliderValue(slider);
        }
    }

    async getSliderShiftWidth() {
        let currentValues = await this.getSlidersValues();
        if (currentValues.min != currentValues.max) {
            let rightSliderX = await this.playtimeSliderMaxSelector.getBoundingClientRectProperty("left");
            let leftSliderX = await this.playtimeSliderMinSelector.getBoundingClientRectProperty("left");
            //amount of pixels / amount of positions between sliders
            return (rightSliderX - leftSliderX) / (currentValues.max - currentValues.min);
        } else {
            let sliderBarRightSideX = await this.sliderBarSelector.getBoundingClientRectProperty("right");
            let sliderBarLeftSideX = await this.sliderBarSelector.getBoundingClientRectProperty("left");
            //amount of pixels / 100 positions on the bar
            return (sliderBarRightSideX - sliderBarLeftSideX) / 100;
        }
    }

    async getPlaytimeMinMaxValues() {
        const reviewsCount = await this.reviewerPlaytimeSelector.count;
        const playtimes = [];
        for (let i = 0; i < reviewsCount; i++) {
            playtimes.push(parseFloat((await this.reviewerPlaytimeSelector.nth(i).textContent)
                .replace(this.keepNumRegex, "")));
        }
        const playTimeMin = Math.min(...playtimes);
        const playTimeMax = Math.max(...playtimes);
        return {
            min: playTimeMin,
            max: playTimeMax
        };
    }
}