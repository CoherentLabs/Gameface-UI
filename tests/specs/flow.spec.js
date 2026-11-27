const assert = require('assert');
const { navigateToPage } = require('../shared/utils');

const FILE = 'tests/src/components/Flow/FlowTest.tsx';

const scenario = (i) => gf.click(`.flow-scenario.scenario-${i}`);
const text = async (selector) => (await gf.get(selector)).text();
const exists = (selector) => gf.executeScript((sel) => !!document.querySelector(sel), selector);
const activeId = () => gf.executeScript(() => document.activeElement && document.activeElement.getAttribute('data-gf-id'));
// Focuses the element, reports whether it took focus, then puts focus back where it was.
const canFocus = (selector) => gf.executeScript((sel) => {
    const previous = document.activeElement;
    const el = document.querySelector(sel);
    el.focus();
    const took = document.activeElement === el;
    if (previous && previous.focus) previous.focus();
    return took;
}, selector);

describe('Flow runtime', function () {
    this.beforeAll(async () => {
        await navigateToPage('flow');
        // The runtime wires the root one frame after mount, then focuses after the area registers.
        await gf.sleep(300);
    });

    this.afterEach(async () => {
        await gf.executeScript(() => { delete window.__gfStateChanged; });
        await gf.trigger('reset');
    });

    // First: clicking the scenario buttons in later tests moves focus.
    describe('Navigation', () => {
        it("Focusable settings from the flow apply to the screen's elements", async () => {
            // The interaction manager rewrites the value when it registers the area; only presence matters.
            assert.notEqual(await gf.getAttribute('.flow-btn-1', 'tabindex'), null);
            assert.notEqual(await gf.getAttribute('.flow-btn-2', 'tabindex'), null);
            assert.equal(await gf.getAttribute('.flow-btn-3', 'tabindex'), null);
            assert.equal(await canFocus('.flow-btn-1'), true, 'One takes focus');
            assert.equal(await canFocus('.flow-btn-3'), false, 'Three does not take focus');
        });

        it("The screen focuses its first focus element when it shows", async () => {
            assert.equal(await activeId(), 'flowbtn2');
        });
    });

    describe('Navigation areas', () => {
        const focus = (selector) => gf.executeScript((sel) => document.querySelector(sel).focus(), selector);
        const press = async (key) => {
            await gf.keyPress(key);
            await gf.sleep(100);
        };

        it("A navigation area that a state mounts joins navigation", async () => {
            await scenario(0);
            await gf.sleep(200);

            await focus('.flow-e1');
            await press(gf.KEYS.ARROW_RIGHT);
            assert.equal(await activeId(), 'flowe2');
            await press(gf.KEYS.ARROW_RIGHT);
            assert.equal(await activeId(), 'flowe1', 'wraps inside "extras"');

            await focus('.flow-btn-2');
            for (const key of [gf.KEYS.ARROW_DOWN, gf.KEYS.ARROW_RIGHT, gf.KEYS.ARROW_DOWN]) {
                await press(key);
                assert.ok(!['flowe1', 'flowe2'].includes(await activeId()), `the screen area reached ${await activeId()}`);
            }
        });

        it("An area with wrap off stops at its edges", async () => {
            await focus('.flow-l3');
            await press(gf.KEYS.ARROW_RIGHT);
            assert.equal(await activeId(), 'flowl3');
            await press(gf.KEYS.ARROW_LEFT);
            assert.equal(await activeId(), 'flowl2', 'navigation inside the area still works');
        });

        it("Switching to an area focuses its first focus element", async () => {
            await scenario(6);
            await gf.sleep(100);
            assert.equal(await activeId(), 'flowl2');
        });

        it("Edge handlers set by the screen survive a state change", async () => {
            await scenario(0);
            await gf.sleep(200);

            await focus('.flow-s2');
            await press(gf.KEYS.ARROW_RIGHT);
            assert.equal(await text('.flow-edge-hits'), '1');
            assert.equal(await activeId(), 'flows2', 'the handler returned false, so focus stays');
        });
    });

    describe('Components inside the screen', () => {
        const focus = (selector) => gf.executeScript((sel) => document.querySelector(sel).focus(), selector);
        const press = async (key) => {
            await gf.keyPress(key);
            await gf.sleep(100);
        };

        it("A component's state change that shows a focusable element makes it reachable", async () => {
            await scenario(7);
            await gf.sleep(200);
            assert.ok(await exists('.flow-card-buy'), 'the card shows Buy');

            // Buy sits under Two.
            await focus('.flow-btn-2');
            await press(gf.KEYS.ARROW_DOWN);
            assert.equal(await activeId(), 'cardbuy0', 'down from Two reaches Buy');
        });

        it("A component with its own areas keeps them focusable when a state mounts it", async () => {
            await scenario(0);
            await gf.sleep(200);
            await scenario(2);
            await gf.sleep(200);

            await focus('.flow-p1');
            assert.equal(await activeId(), 'panelp1', 'P1 takes focus');
            await press(gf.KEYS.ARROW_RIGHT);
            assert.equal(await activeId(), 'panelp2');
            await press(gf.KEYS.ARROW_RIGHT);
            assert.equal(await activeId(), 'panelp1', 'wraps inside the panel area');
        });
    });

    describe('States', () => {
        it("Elements stay focusable after a state change", async () => {
            // Video adds a focusable element (Four), so the screen area is re-registered on each change.
            for (const i of [0, 1, 0]) {
                await scenario(i);
                await gf.sleep(100);
                assert.equal(await canFocus('.flow-btn-1'), true, `One after scenario ${i}`);
                assert.equal(await canFocus('.flow-btn-2'), true, `Two after scenario ${i}`);
                if (i === 0) assert.equal(await canFocus('.flow-btn-4'), true, 'Four, added by Video');
            }
        });

        it("State groups start in their initial states", async () => {
            assert.equal(await text('.flow-current-tabs'), 'Audio');
            assert.equal(await text('.flow-current-save'), 'Has save');
        });

        it("Switching a state puts its modifier class on the root", async () => {
            await scenario(0);
            assert.equal(await text('.flow-current-tabs'), 'Video');
            const classes = await (await gf.get('.flow-root')).classes();
            assert.ok(classes.includes('tabs--video'), `root classes: ${classes}`);

            await scenario(1);
            const after = await (await gf.get('.flow-root')).classes();
            assert.ok(!after.includes('tabs--video'), 'modifier class should be removed');
        });

        it("Elements that exist only in a state mount when it becomes active", async () => {
            assert.equal(await exists('.flow-video'), false);
            await scenario(0);
            assert.ok(await gf.get('.flow-video'), 'Show content should mount');
            assert.equal(await text('.flow-entered'), '1');
        });

        it("Data bindings fill on elements a state change mounts", async () => {
            await scenario(0);
            await gf.sleep(50);
            assert.equal(await text('.flow-bound'), 'bound');
        });

        it("A state that follows a condition can't be set directly", async () => {
            await scenario(3);
            assert.equal(await text('.flow-current-save'), 'Has save', 'set() on a following state is refused');

            await scenario(2);
            assert.equal(await text('.flow-current-save'), 'No save file');
            assert.ok((await (await gf.get('.flow-root')).classes()).includes('save--no-save-file'));

            await scenario(2);
            assert.equal(await text('.flow-current-save'), 'Has save');
        });

        it("Code outside Solid finds a state group from an element", async () => {
            await scenario(5);
            assert.equal(await text('.flow-current-tabs'), 'Video');
        });
    });

    describe('Overlays', () => {
        it("An overlay opens on top and returns the value it closes with", async () => {
            await scenario(4);
            const overlay = await gf.get('.flow-confirm');
            assert.ok(overlay, 'overlay should mount');
            assert.equal(await gf.getAttribute('[data-gf-overlay="Confirm"]', 'data-gf-owner'), 'flowroot');
            const outsideRoot = await gf.executeScript(() =>
                !document.querySelector('.flow-root').contains(document.querySelector('[data-gf-overlay="Confirm"]')));
            assert.equal(outsideRoot, true, 'overlay is portalled outside the screen root');

            await gf.sleep(300);
            assert.equal(await activeId(), 'confno00', 'overlay first focus');

            await gf.click('.flow-confirm-yes');
            await gf.sleep(50);
            assert.equal(await text('.flow-assert'), 'closed:yes');
            assert.equal(await exists('.flow-confirm'), false);
        });
    });

    describe('Overlay focus and Back', () => {
        // Opened by a dispatched click: a real click on the scenario <button> would move focus to it.
        const openConfirm = () => gf.executeScript(() => {
            document.querySelector('.flow-scenario.scenario-4').dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        it("Focus returns to the opener when an overlay closes", async () => {
            await gf.executeScript(() => document.querySelector('.flow-btn-1').focus());
            assert.equal(await activeId(), 'flowbtn1');
            await openConfirm();
            await gf.sleep(300);
            assert.equal(await activeId(), 'confno00');

            await gf.click('.flow-confirm-yes');
            await gf.sleep(100);
            assert.equal(await activeId(), 'flowbtn1');
        });

        it("Back closes an overlay opened with closeOnBack", async () => {
            await openConfirm();
            await gf.sleep(300);
            assert.equal(await exists('.flow-confirm'), true);

            await gf.keyPress(gf.KEYS.ESC);
            await gf.sleep(100);
            assert.equal(await exists('.flow-confirm'), false);
            assert.equal(await text('.flow-assert'), 'closed:undefined');
        });
    });

    describe('Overlay without a flow', () => {
        it("An overlay without its own flow doesn't take the screen's navigation settings", async () => {
            // Dispatched: the button wraps past the right edge of the test window, where a real click can't reach it.
            await gf.executeScript(() => {
                document.querySelector('.flow-scenario.scenario-8').dispatchEvent(new MouseEvent('click', { bubbles: true }));
            });
            await gf.sleep(600);
            assert.ok(await exists('.flow-plain'), 'the overlay is mounted');
            const focused = await gf.executeScript(() => document.activeElement && document.activeElement.className);
            assert.ok(focused && focused.includes('flow-plain-first'), `focus is on ${focused}`);
        });
    });

    describe('Dev hooks (Live states)', () => {
        it("The editor sets and reads a state through the dev hooks", async () => {
            await gf.executeScript((file) => window.__gfFlows.states.set(file, 'Tabs', 'Video'), FILE);
            assert.equal(await text('.flow-current-tabs'), 'Video');
            const value = await gf.executeScript((file) => window.__gfFlows.states.get(file, 'Tabs'), FILE);
            assert.equal(value, 'Video');
        });

        it("A state the editor forces wins until the next change", async () => {
            await gf.executeScript((file) => window.__gfFlows.states.set(file, 'Save', 'No save file'), FILE);
            assert.equal(await text('.flow-current-save'), 'No save file');
            await scenario(2); // the condition changes: last change wins
            await scenario(2);
            assert.equal(await text('.flow-current-save'), 'Has save');
        });

        it("State changes are reported to the editor except the ones it forced", async () => {
            await gf.executeScript(() => {
                window.__flowCalls = [];
                window.__gfStateChanged = (file, group, state) => window.__flowCalls.push(`${file}|${group}|${state}`);
            });
            await scenario(0);
            await gf.executeScript((file) => window.__gfFlows.states.set(file, 'Tabs', 'Audio'), FILE);
            await gf.sleep(50);
            const calls = await gf.executeScript(() => window.__flowCalls.join(','));
            assert.equal(calls, `${FILE}|Tabs|Video`);
        });

        it("The editor opens and closes overlays through the dev hooks", async () => {
            await gf.executeScript(() => window.__gfFlows.overlays.open('Confirm'));
            assert.ok(await gf.get('.flow-confirm'));
            await gf.executeScript(() => window.__gfFlows.overlays.close());
            await gf.sleep(50);
            assert.equal(await exists('.flow-confirm'), false);
        });
    });
});
