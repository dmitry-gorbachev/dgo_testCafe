import { Selector, t } from "testcafe";
import BasePage from "./basePage";
import testdata from "../testData.json";

export default class MatureContentFilterPage extends BasePage {
    constructor() {
        super();
        this.enterBirthdayTextSelector = Selector('.agegate_birthday_desc');
        this.ageDayDropdownSelector = Selector('#ageDay');
        this.ageMonthDropdownSelector = Selector('#ageMonth');
        this.ageYearDropdownSelector = Selector('#ageYear');
        this.viewPageButtonSelector = Selector('#view_product_page_btn');
    }

    async isBirthdayPopupDisplayed() {
        return await this.enterBirthdayTextSelector.exists;
    }

    async selectBirthDayAndProceed() {
        const birthDay = this.returnDate(testdata.userBirthDay);
        await this.fillInBirthDay(birthDay);
        await t.click(this.viewPageButtonSelector);
    }

    returnDate(date) {
        const d = new Date(date);
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return {
            day: d.getDate().toString(),
            month: month[d.getMonth()],
            year: d.getFullYear().toString()
        };
    }

    async fillInBirthDay(date) {
        await this.selectDropdownValue(this.ageYearDropdownSelector, date.year);
        await this.selectDropdownValue(this.ageMonthDropdownSelector, date.month);
        await this.selectDropdownValue(this.ageDayDropdownSelector, date.day);
    }

    async selectDropdownValue(selector, value) {
        const option = await selector.find(`option[value="${value}"]`);
        await t
            .click(selector)
            .click(option)
            .expect(selector.value).eql(value);

    }
}