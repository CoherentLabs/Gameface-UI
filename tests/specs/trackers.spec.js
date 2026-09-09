const assert = require('assert');
const selectors = require('../shared/trackers-selectors.json');
const { navigateToPage } = require('../shared/utils');

// gf.get()/gf.getAll() both throw when nothing matches, so they can't be used
// to assert absence - a plain in-page query is the documented way to count
// matches (including zero) without throwing.
async function count(selector) {
    return gf.executeScript((sel) => document.querySelectorAll(sel).length, selector);
}

describe('Trackers', function () {
    this.beforeAll(async () => {
        await navigateToPage('.trackers-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its items correctly', async () => {
        const layer = await gf.get(`.${selectors.trackersLayer}`);
        const item1 = await gf.get(`.${selectors.item1}`);
        const item2 = await gf.get(`.${selectors.item2}`);
        const item3 = await gf.get(`.${selectors.item3}`);

        assert.ok(layer, 'Trackers layer should be in the DOM');
        assert.ok(item1, 'item1 should be in the DOM');
        assert.ok(item2, 'item2 should be in the DOM');
        assert.ok(item3, 'item3 should be in the DOM');
        assert.equal(await count(`.${selectors.item4}`), 0, 'item4 should not be in the DOM until it is mounted');
    })

    it('Should move a single item via updateTrackers', async () => {
        await gf.click(`.${selectors.moveItem1}`);
        const item1 = await gf.get(`.${selectors.item1}`);

        assert.equal((await item1.styles())['transform'], 'translate(50px, 60px)');
    })

    it('Should hide and show an item via updateTrackers', async () => {
        const item2 = await gf.get(`.${selectors.item2}`);

        await gf.click(`.${selectors.hideItem2}`);
        await gf.retryIfFails(async () => assert.equal(await item2.isHidden(), true, 'item2 should be hidden'));

        await gf.click(`.${selectors.showItem2}`);
        // isVisible() checks live layout geometry (DOM.getBoxModel), which needs
        // a layout pass to catch up with the display:none -> block change.
        await gf.retryIfFails(async () => assert.equal(await item2.isVisible(), true, 'item2 should be visible again'));
    })

    it('Should move multiple items in a single batch update', async () => {
        await gf.click(`.${selectors.moveBatch}`);
        const item1 = await gf.get(`.${selectors.item1}`);
        const item3 = await gf.get(`.${selectors.item3}`);

        assert.equal((await item1.styles())['transform'], 'translate(10px, 10px)');
        assert.equal((await item3.styles())['transform'], 'translate(20px, 20px)');
    })

    describe('scale/rotate transform', function () {
        it('Should apply scale without disturbing position or rotation', async () => {
            await gf.click(`.${selectors.setScale5}`);
            const item5 = await gf.get(`.${selectors.item5}`);

            assert.equal((await item5.styles())['transform'], 'translate(0px, 0px) scale3d(2, 2, 1) rotateZ(0deg)');
        })

        it('Should apply rotate without disturbing position or scale', async () => {
            await gf.click(`.${selectors.setRotate5}`);
            const item5 = await gf.get(`.${selectors.item5}`);

            assert.equal((await item5.styles())['transform'], 'translate(0px, 0px) scale3d(1, 1, 1) rotateZ(80deg)');
        })

        it('Should compose position, scale and rotate together in the same transform', async () => {
            await gf.click(`.${selectors.moveItem5}`);
            await gf.click(`.${selectors.setScale5}`);
            await gf.click(`.${selectors.setRotate5}`);
            const item5 = await gf.get(`.${selectors.item5}`);

            assert.equal((await item5.styles())['transform'], 'translate(30px, 40px) scale3d(2, 2, 1) rotateZ(80deg)');
        })
    })

    describe('loading/unloading elements', function () {
        it('Should register a newly mounted item and receive updates for it', async () => {
            await gf.click(`.${selectors.toggleItem4}`);
            let item4 = await gf.get(`.${selectors.item4}`);
            assert.ok(item4, 'item4 should be in the DOM after mounting');
            assert.equal(await gf.text(`.${selectors.assertionElement}`), '1', 'item4 should have mounted exactly once');

            await gf.click(`.${selectors.moveItem4}`);
            item4 = await gf.get(`.${selectors.item4}`);
            assert.equal((await item4.styles())['transform'], 'translate(70px, 80px)');
        })

        it('Should unregister an unmounted item and silently ignore further updates to it', async () => {
            await gf.click(`.${selectors.toggleItem4}`); // mount
            await gf.click(`.${selectors.toggleItem4}`); // unmount

            assert.equal(await count(`.${selectors.item4}`), 0, 'item4 should be removed from the DOM after unmounting');

            // Targets an id no longer registered - must not throw, and must not
            // disturb any other mounted item.
            await gf.click(`.${selectors.moveItem4}`);
            await gf.click(`.${selectors.moveItem1}`);
            const item1 = await gf.get(`.${selectors.item1}`);
            assert.equal((await item1.styles())['transform'], 'translate(50px, 60px)', 'other items keep updating normally');
        })

        it('Should mount a fresh instance (not reuse the old one) when remounted', async () => {
            await gf.click(`.${selectors.toggleItem4}`); // mount #1
            await gf.click(`.${selectors.toggleItem4}`); // unmount
            await gf.click(`.${selectors.toggleItem4}`); // mount #2

            assert.equal(await gf.text(`.${selectors.assertionElement}`), '2', 'item4 should have mounted twice, not been reused');

            await gf.click(`.${selectors.moveItem4}`);
            const item4 = await gf.get(`.${selectors.item4}`);
            assert.equal((await item4.styles())['transform'], 'translate(70px, 80px)', 'the fresh instance still receives updates');
        })

        it('Should unmount every item and clean up when the whole Trackers instance unmounts', async () => {
            await gf.click(`.${selectors.toggleTrackersMounted}`);

            assert.equal(await count(`.${selectors.trackersLayer}`), 0, 'Trackers layer should be removed from the DOM');
            assert.equal(await count(`.${selectors.item1}`), 0, 'item1 should be removed from the DOM');
            assert.equal(await count(`.${selectors.item2}`), 0, 'item2 should be removed from the DOM');
            assert.equal(await count(`.${selectors.item3}`), 0, 'item3 should be removed from the DOM');

            // Nothing is mounted under this trackers id anymore - must not throw.
            await gf.click(`.${selectors.moveItem1}`);
        })

        it('Should remount cleanly and receive updates again after the whole Trackers instance remounts', async () => {
            await gf.click(`.${selectors.toggleTrackersMounted}`); // unmount
            await gf.click(`.${selectors.toggleTrackersMounted}`); // remount

            const item1 = await gf.get(`.${selectors.item1}`);
            assert.ok(item1, 'item1 should be back in the DOM after remounting');

            await gf.click(`.${selectors.moveItem1}`);
            assert.equal((await item1.styles())['transform'], 'translate(50px, 60px)', 'the remounted instance receives updates normally');
        })

        it('Should silently ignore updates for a trackers id that was never mounted', async () => {
            // No <Trackers id="test-trackers-does-not-exist"> exists anywhere in
            // the harness - dispatch() must warn and return, never throw.
            await gf.click(`.${selectors.moveUnknownTrackers}`);

            const item1 = await gf.get(`.${selectors.item1}`);
            assert.ok(item1, 'unrelated Trackers instances stay unaffected');
        })
    })
});
