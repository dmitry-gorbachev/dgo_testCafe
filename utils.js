import { Selector, t } from 'testcafe';

export function getRandom(max) {
    return Math.floor(Math.random() * max);
}

export async function scrollDownUntilElementExists(element, scrollingPixelsLimit = 10000) {
    let pixelsScrolled = 0;
    let elementsIsAvailable = await Selector(element).exists;
    while (pixelsScrolled < scrollingPixelsLimit && !(elementsIsAvailable)) {
        await t.scrollBy(0, 100);
        pixelsScrolled += 100;
        elementsIsAvailable = await Selector(element).exists;
    }
    await t.expect(elementsIsAvailable).eql(true);
}