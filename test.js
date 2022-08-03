import GamesListPage from './pages/gamesListPage.js';
import MatureContentFilterPage from './pages/matureContentFilterPage.js';
import GamePage from './pages/GamePage.js';
import HomePage from './pages/homePage.js';
import CommunityRecommendationsPage from './pages/communityRecommendationsPage.js';

fixture`Exploring Steam`
    .page`https://store.steampowered.com/`
    .beforeEach(async t => {
        await t.maximizeWindow();
    });

test('See the info or the cheapest game', async t => {
    const gamesListPage = new GamesListPage();
    const themeTitle = await gamesListPage.openRandomTheme();
    await t.expect(await gamesListPage.getPageHeader())
        .contains(themeTitle, 'Theme page is not opened');
    await gamesListPage.goToTopSellerTab();
    const cheapestGame = await gamesListPage.openCheapestGame();
    const matureContentFilterPage = new MatureContentFilterPage;
    if (await matureContentFilterPage.isBirthdayPopupDisplayed()) {
        await matureContentFilterPage.selectBirthDayAndProceed();
    }
    const gamePage = new GamePage();
    const actualGameData = await gamePage.getGameData();
    await t.expect(cheapestGame).eql(actualGameData
        , 'The data of opened game is not corresponding to the data of selected game');
})

test('Filtering of games on Community Recommendations', async t => {
    const homePage = new HomePage();
    await t.expect(await homePage.isHomePageOpened()).eql(true, 'Home page is not opened');
    await homePage.mainNavigation('Your Store', 'Community Recommendations');
    const communityRecommendationsPage = new CommunityRecommendationsPage();
    await t.expect(await communityRecommendationsPage.getPageHeader())
        .eql('The Community Recommends', 'Page Community Recmmendations is not opened');
    await communityRecommendationsPage.expandFiltersAndOptions();
    await t.expect(await communityRecommendationsPage.isFiltersSectionDisplayed())
        .eql(true, 'Filter Section is not displayed');
    await communityRecommendationsPage.pickYourOwnPlaytimeRange();
    await communityRecommendationsPage.filterByCustomPlayTime(10, 20);
    const minMaxValues = await communityRecommendationsPage.getPlaytimeMinMaxValues();
    await t.expect(minMaxValues.min).gte(10, 'The least value of Playtime is less than set in filter');
    await t.expect(minMaxValues.max).lte(20, 'The greatest value of Playtime is greater than set in filter');
})