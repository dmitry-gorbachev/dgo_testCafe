import { Selector, t } from 'testcafe';

export function getRandom(max) {
    return Math.floor(Math.random() * max);
}

export async function waitUntilElementExists(element, timeout = 1000) {
    let timeSpent = 0;
    let elementsIsAvailable = false;
    while (timeSpent < timeout && !(elementsIsAvailable)) {
        await t.wait(100);
        timeSpent += 100;
        elementsIsAvailable = await element.exists;
    }
    await t.expect(elementsIsAvailable).eql(true);
}

export async function scrollDownUntilElementExists(element, scrollingPixelsLimit = 10000) {
    let pixelsScrolled = 0;
    let elementsIsAvailable = false;
    while (pixelsScrolled < scrollingPixelsLimit && !(elementsIsAvailable)) {
        await t.scrollBy(0, 100);
        pixelsScrolled += 100;
        elementsIsAvailable = await Selector(element).exists;
    }
    await t.expect(elementsIsAvailable).eql(true);
}