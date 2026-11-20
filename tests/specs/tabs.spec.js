const assert = require('assert');
const selectors = require('../shared/tabs-selectors.json');
const { navigateToPage, expectOnChangeCalls } = require('../shared/utils');

// The location whose content the test Tabs shows (only the current Tab is rendered).
async function shownContent() {
    return await gf.executeScript((root, content) => {
        return [...document.querySelectorAll(`.${root} .${content}`)].map((el) => el.textContent);
    }, selectors.tabs, selectors.content);
}

async function assertShows(location) {
    await gf.retryIfFails(async () => {
        assert.deepEqual(await shownContent(), [location], `Only the "${location}" tab should be shown`);
    });
}

describe('Tabs', function () {
    this.beforeAll(async () => {
        await navigateToPage('.tabs-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the logs only have what happened while mounting.
    it('Should not call onTabChanged or onBeforeTabChange on mount', async () => {
        await expectOnChangeCalls('tabs', [], 'No onTabChanged for the default tab');
        await expectOnChangeCalls('tabs-before', [], 'No onBeforeTabChange for the default tab');
    })

    it('Should show the default tab', async () => {
        await assertShows('one');
    })

    it('Should change the tab via a TabLink', async () => {
        await gf.click(`.${selectors.tabLink}-three`);
        await assertShows('three');
        const classes = await (await gf.get(`.${selectors.tabLink}-three`)).classes();
        assert.ok(classes.includes(selectors.activeLink), 'The clicked link is active');
    })

    it('Should not change the tab when onBeforeTabChange returns false', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await assertShows('one');
    })
});

describe('Tabs onTabChanged calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should report a ref change once, after onBeforeTabChange', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await assertShows('two');
        await expectOnChangeCalls('tabs-before', [['one', 'two']], 'onBeforeTabChange with the current and next tab');
        await expectOnChangeCalls('tabs', ['two'], 'onTabChanged once with the new tab');
    })

    it('Should report a TabLink click once', async () => {
        await gf.click(`.${selectors.tabLink}-three`);
        await expectOnChangeCalls('tabs-before', [['one', 'three']], 'onBeforeTabChange');
        await expectOnChangeCalls('tabs', ['three'], 'onTabChanged');
    })

    it('Should not call onTabChanged when the change is blocked', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await expectOnChangeCalls('tabs-before', [['one', 'two']], 'onBeforeTabChange was asked');
        await expectOnChangeCalls('tabs', [], 'onTabChanged is not called');
    })

    // As on master: changeTab has no same-tab check, so the current tab is reported again.
    it('Should report a change to the current tab (as on master)', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await expectOnChangeCalls('tabs-before', [['one', 'one']], 'onBeforeTabChange');
        await expectOnChangeCalls('tabs', ['one'], 'onTabChanged');
    })

    // As on master: changeTab reads the current tab before it awaits onBeforeTabChange,
    // so both calls in one tick get "one" as the previous tab. The last one wins.
    it('Should handle two changes in a row (as on master)', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        await assertShows('three');
        await expectOnChangeCalls('tabs-before', [['one', 'two'], ['one', 'three']], 'Both see "one" as the current tab');
        await expectOnChangeCalls('tabs', ['two', 'three'], 'onTabChanged for each change, in order');
    })
});
