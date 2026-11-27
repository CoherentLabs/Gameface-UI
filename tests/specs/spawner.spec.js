const assert = require('assert');
const selectors = require('../shared/spawner-selectors.json');
const { navigateToPage } = require('../shared/utils');

// Keep in sync with tests/src/components/Spawner/SpawnerTest.tsx
const MAX_COUNT = 3;
const POOL_SIZE = 2;
const HIDE_TIMEOUT = 600;
const CSS_HIDE_TIMEOUT = 3000;
// Removal waits ~3 frames for an exit animation to start (see waitForCssExit); generous for slow frame rates
const SETTLE = 500;

/** The entries of one Spawner, as { text, uid, key, shows, state, display, position, left, top } */
async function entries(target) {
    return gf.executeScript((spawnerSelector, entrySelector) => {
        const spawner = document.querySelector(spawnerSelector);
        if (!spawner) return [];
        return [...spawner.querySelectorAll(entrySelector)].map((el) => {
            const wrapper = el.parentElement;
            return {
                text: el.textContent.trim(),
                uid: el.getAttribute('data-uid'),
                key: el.getAttribute('data-key'),
                shows: Number(el.getAttribute('data-shows')),
                state: wrapper.getAttribute('data-spawner-state'),
                display: wrapper.style.display,
                position: wrapper.style.position,
                left: wrapper.style.left,
                top: wrapper.style.top,
            };
        });
    }, `.${selectors[target]}`, `.${selectors.entry}`);
}

const spawn = (detail) => gf.trigger('spawner-spawn', detail);

/** Runs a scenario from SpawnerTest's `scenarios` and returns its result (it writes it to <body>). */
async function runScenario(name, options = {}) {
    await gf.trigger('spawner-scenario', { name, ...options });
    for (let i = 0; i < 100; i++) {
        const raw = await gf.executeScript(() => document.body.getAttribute('data-scenario'));
        if (raw) {
            const result = JSON.parse(raw);
            if (result.error) throw new Error(`Scenario "${name}" failed: ${result.error}`);
            return result;
        }
        await gf.sleep(100);
    }
    throw new Error(`Scenario "${name}" did not finish`);
}
const visible = (list) => list.filter((e) => e.state !== 'idle');

describe('Spawner', function () {
    this.beforeAll(async () => {
        await navigateToPage('.spawner-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should spawn items in the flow, oldest first', async () => {
        await spawn({ target: 'flow', text: 'A' });
        await spawn({ target: 'flow', text: 'B' });
        const list = await entries('flow');
        assert.deepEqual(list.map((e) => e.text), ['A', 'B'], 'Items should be appended in spawn order');
        assert.ok(list.every((e) => e.state === 'shown' && e.position === ''), 'Items in the flow are not positioned');
    });

    it('Should remove the oldest item above max count', async () => {
        for (const text of ['A', 'B', 'C', 'D']) await spawn({ target: 'flow', text });
        await gf.sleep(SETTLE);
        const list = await entries('flow');
        assert.equal(list.length, MAX_COUNT, `Only ${MAX_COUNT} items should stay`);
        assert.deepEqual(list.map((e) => e.text), ['B', 'C', 'D'], 'The oldest item should be removed');
    });

    it('Should remove an item after its life', async () => {
        await spawn({ target: 'flow', text: 'Short', life: 300 });
        await spawn({ target: 'flow', text: 'Forever' });
        assert.equal((await entries('flow')).length, 2, 'Both items should be shown');
        await gf.sleep(700);
        assert.deepEqual((await entries('flow')).map((e) => e.text), ['Forever'], 'The item should be removed after its life');
    });

    it('Should place an item at a point', async () => {
        await spawn({ target: 'flow', text: 'Point', at: { x: 40, y: 25 } });
        const [entry] = await entries('flow');
        assert.equal(entry.position, 'absolute', 'The item should be absolutely positioned');
        assert.equal(entry.left, '40px', 'left should be x');
        assert.equal(entry.top, '25px', 'top should be y');
    });

    it('Should remove by key and clear', async () => {
        for (const text of ['A', 'B', 'C']) await spawn({ target: 'flow', text });
        await gf.trigger('spawner-remove-first', { target: 'flow' });
        await gf.sleep(SETTLE);
        assert.deepEqual((await entries('flow')).map((e) => e.text), ['B', 'C'], 'remove(key) should remove that item');
        await gf.trigger('spawner-clear', { target: 'flow' });
        await gf.sleep(SETTLE);
        assert.equal((await entries('flow')).length, 0, 'clear() should remove every item');
    });

    describe('Reuse elements', () => {
        it('Should keep pooled elements hidden instead of removing them', async () => {
            await spawn({ target: 'pooled', text: 'A' });
            await spawn({ target: 'pooled', text: 'B' });
            await gf.trigger('spawner-clear', { target: 'pooled' });
            await gf.sleep(SETTLE);
            const list = await entries('pooled');
            assert.equal(list.length, POOL_SIZE, 'Pooled elements should stay in the DOM');
            assert.ok(list.every((e) => e.state === 'idle' && e.display === 'none'), 'Idle elements should be display: none');
        });

        it('Should reuse an idle element with new data and play its show again', async () => {
            await spawn({ target: 'pooled', text: 'A' });
            const [first] = await entries('pooled');
            await gf.trigger('spawner-clear', { target: 'pooled' });
            await gf.sleep(SETTLE);
            await spawn({ target: 'pooled', text: 'B' });
            const list = visible(await entries('pooled'));
            assert.equal(list.length, 1, 'One item should be shown');
            assert.equal(list[0].uid, first.uid, 'The element should be reused, not recreated');
            assert.equal(list[0].text, 'B', 'The reused element should get the new data');
            assert.notEqual(list[0].key, first.key, 'The reused element should get a new key');
            assert.equal(list[0].shows, 2, 'onShow should run again on reuse');
        });

        it('Should create and destroy items above the pool size', async () => {
            for (const text of ['A', 'B', 'C']) await spawn({ target: 'pooled', text });
            assert.equal((await entries('pooled')).length, 3, 'All items should be shown');
            await gf.trigger('spawner-clear', { target: 'pooled' });
            await gf.sleep(SETTLE);
            assert.equal((await entries('pooled')).length, POOL_SIZE, 'Only the pooled elements should stay');
        });

        it('Should keep reused items in spawn order', async () => {
            await spawn({ target: 'pooled', text: 'A' });
            await spawn({ target: 'pooled', text: 'B' });
            await gf.trigger('spawner-remove-first', { target: 'pooled' });
            await gf.sleep(SETTLE);
            await spawn({ target: 'pooled', text: 'C' });
            assert.deepEqual(visible(await entries('pooled')).map((e) => e.text), ['B', 'C'], 'The reused element should move to the end');
        });
    });

    describe('Hide', () => {
        it('Should wait for an onHide hook before removing the item', async () => {
            await spawn({ target: 'hooks', text: 'Slow', hideDelay: 400 });
            await gf.trigger('spawner-clear', { target: 'hooks' });
            await gf.sleep(150);
            const [entry] = await entries('hooks');
            assert.ok(entry, 'The item should still be in the DOM while it hides');
            assert.equal(entry.state, 'leaving', 'The item should be marked as leaving');
            await gf.sleep(500);
            assert.equal((await entries('hooks')).length, 0, 'The item should be removed once the hook resolves');
        });

        it('Should not wait longer than hideTimeout', async () => {
            await spawn({ target: 'hooks', text: 'Stuck', hideDelay: -1 });
            await gf.trigger('spawner-clear', { target: 'hooks' });
            await gf.sleep(HIDE_TIMEOUT - 250);
            assert.equal((await entries('hooks')).length, 1, 'The item should wait for its hide');
            await gf.sleep(500);
            assert.equal((await entries('hooks')).length, 0, 'The item should be removed after hideTimeout');
        });

        it('Should wait for a CSS exit animation started by .spawner-leaving', async () => {
            await spawn({ target: 'css', text: 'Fade' });
            await gf.sleep(100);
            await gf.trigger('spawner-clear', { target: 'css' });
            await gf.sleep(300);
            assert.equal((await entries('css')).length, 1, 'The item should stay while its exit animation runs');
            // The animation is 800ms and this Spawner's hideTimeout is CSS_HIDE_TIMEOUT, so a removal
            // by now comes from animationend, not from the cap.
            await gf.sleep(1200);
            assert.equal((await entries('css')).length, 0, 'The item should be removed when the animation ends');
        });

        it('Should remove an item with nothing to wait for within a few frames', async () => {
            await spawn({ target: 'flow', text: 'Quick' });
            await gf.trigger('spawner-clear', { target: 'flow' });
            await gf.sleep(SETTLE);
            assert.equal((await entries('flow')).length, 0, 'The item should be removed');
        });

        it('A cut-short CSS exit leaves no animation listeners behind', async () => {
            const result = await runScenario('cut-short-exit');
            assert.ok(result.added > 0, 'The exit waits should have added animationend listeners');
            assert.equal(result.left, 0, `Every listener should be removed (${result.left} of ${result.added} left)`);
        });
    });

    describe('Item lifecycle', () => {
        it('Spawning from an effect does not re-run the effect when items hide', async () => {
            const result = await runScenario('effect-spawn');
            assert.equal(result.spawns, 1, 'The effect should spawn exactly one item');
        });

        it('Show hooks registered after the template mounts run on the first show', async () => {
            const result = await runScenario('show-hook-on-mount');
            assert.equal(result.duringRender, 1, 'A hook registered while rendering runs once');
            assert.equal(result.fromOnMount, 1, 'A hook registered from onMount runs once');
        });

        it('Saved item entries keep their data after their element is reused', async () => {
            const result = await runScenario('saved-entry');
            assert.equal(result.templates, 1, "B should reuse A's element");
            assert.deepEqual(result.shown, ['B'], 'B should be shown');
            assert.equal(result.savedText, 'A', "The saved entry should keep A's data");
        });

        it('Shrinking the pool frees idle elements', async () => {
            const result = await runScenario('pool-change', { to: 1 });
            assert.equal(result.idleBefore, 3, 'Three idle elements to start with');
            assert.equal(result.idleAfterChange, 1, 'One idle element should be left');
        });

        it('A pool of 0 does not reuse idle elements', async () => {
            const result = await runScenario('pool-change', { to: 0 });
            assert.equal(result.idleBefore, 3, 'Three idle elements to start with');
            assert.equal(result.idleAfterSpawn, 0, 'No idle element should be left');
            assert.equal(result.newElements, 1, 'The item should get a new element');
        });
    });
});
