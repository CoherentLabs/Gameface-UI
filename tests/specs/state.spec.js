const assert = require('assert');
const selectors = require('../shared/state-selectors.json');
const { navigateToPage, onChangeCalls, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

// The class of the content shown for each state.
const contentOf = {
    one: selectors.stateOne,
    two: selectors.stateTwo,
    three: selectors.stateThree,
    unknown: selectors.stateFallback,
};

// Asserts that the State shows only the content of `state`.
async function assertShows(state) {
    // State keeps only the current state's content in the DOM.
    const shown = await gf.executeScript((root, classes) => {
        const el = document.querySelector('.' + root);
        return Object.keys(classes).filter((name) => el && el.querySelector('.' + classes[name]));
    }, selectors.state, contentOf);
    assert.deepEqual(shown, [state], `Only the "${state}" content should be shown`);
}

describe('State', function () {
    this.beforeAll(async () => {
        await navigateToPage('.state-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the logs only have what happened while mounting.
    it('Should report the default state on mount (as in 1.x)', async () => {
        await expectOnChangeCalls('state-before', [['', 'one']], 'onBeforeStateChange for the default state');
        await expectOnChangeCalls('state', [['one', '']], 'onStateChanged for the default state');
    })

    it('Should render the default state', async () => {
        await assertShows('one');
    })

    it('Should change the state via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await assertShows('two');
        assert.equal(await (await gf.get(`.${selectors.assertionElement}`)).text(), 'two', 'onStateChanged got the new state');
    })

    it('Should change the state via states[name]', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
        await assertShows('two');
    })

    it('Should change the state with a function of the previous state', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        await assertShows('two');
    })

    it('Should show the fallback for an unknown state', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        await assertShows('unknown');
    })

    it('Should handle two changes in a row', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        await assertShows('three');
    })
});

describe('State onStateChanged calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should report a change once, synchronously, from the ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.deepEqual(await onChangeSyncCalls('state'), [['two', 'one']], 'onStateChanged fired before changeState returned');
        await expectOnChangeCalls('state', [['two', 'one']], 'No late duplicate');
        await expectOnChangeCalls('state-before', [['one', 'two']], 'onBeforeStateChange once, with the current and next state');
    })

    it('Should report two changes in a row with the right previous state', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        assert.deepEqual(await onChangeSyncCalls('state'), [['two', 'one'], ['three', 'two']], 'Each change in order');
        await expectOnChangeCalls('state-before', [['one', 'two'], ['two', 'three']], 'onBeforeStateChange for each change');
    })

    it('Should not report a change to the current state', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await expectOnChangeCalls('state', [], 'No onStateChanged');
        await expectOnChangeCalls('state-before', [], 'No onBeforeStateChange');
    })

    it('Should report a function change with the resolved state', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        await expectOnChangeCalls('state', [['two', 'one']], 'The function result is reported, not the function');
    })

    it('Should report a change to an unknown state (fallback shown)', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        await expectOnChangeCalls('state', [['unknown', 'one']], 'Reported like any other state');
    })
});
