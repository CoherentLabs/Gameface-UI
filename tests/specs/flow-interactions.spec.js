const assert = require('assert');
const { navigateToPage } = require('../shared/utils');

const scenario = (i) => gf.click(`.ix-scenario-${i}`);
const text = async (selector) => (await gf.get(selector)).text();
const log = () => text('.ix-log');
const focus = (selector) => gf.executeScript((sel) => document.querySelector(sel).focus(), selector);
const blur = () => gf.executeScript(() => {
    const active = document.activeElement;
    if (active && active !== document.body && active.blur) active.blur();
});
const press = async (key) => {
    await gf.keyPress(key);
    await gf.sleep(100);
};
const expectLog = (expected, message) => gf.retryIfFails(async () => assert.equal(await log(), expected, message));
const glyph = () => gf.executeScript(() => document.querySelector('.ix-hint [data-glyph]')?.getAttribute('data-glyph'));
const device = () => gf.getAttribute('.ix-hint', 'data-input-device');
const htmlHasClass = (name) => gf.executeScript((n) => document.documentElement.classList.contains(n), name);

describe('Flow interactions', function () {
    this.beforeAll(async () => {
        await navigateToPage('flow-interactions');
        // The page has no cohtml.js of its own; the harness loads it on its first binding script. The runtime
        // subscribes to game events once the engine exists.
        await gf.executeBindingScript(() => {});
        // The runtime wires the root one frame after mount; input rows register when Navigation hands over its API.
        await gf.sleep(500);
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
        await gf.sleep(100);
    });

    describe('Events', () => {
        it('Screen shows runs once after the screen mounts', async () => {
            assert.equal(await text('.ix-shown'), '1');
        });

        it("A screen input row runs on its action's key", async () => {
            await blur();
            await press('E');
            await expectLog('screen-interact');
        });

        it("An element row runs while its element has focus, and stopHere skips the screen's row", async () => {
            await focus('.ix-scoped');
            await press('E');
            await gf.sleep(100);
            assert.equal(await log(), 'element-interact');
        });

        it("onAction on an element runs before the screen's row for the same action", async () => {
            await focus('.ix-onaction');
            await press(gf.KEYS.ENTER);
            await expectLog('onaction-confirm,confirm');
        });

        it('A hold row runs once the key has been held for its time', async () => {
            await blur();
            await gf.keyDown('H');
            await gf.sleep(150);
            assert.equal(await text('.ix-charge'), 'charging', 'progress runs while held');
            assert.equal(await log(), '', 'not before the hold time');
            await gf.sleep(1000);
            await gf.keyUp('H');
            await expectLog('charged');
            await gf.retryIfFails(async () => assert.equal(await text('.ix-charge'), 'idle', 'progress resets on release'));
        });

        it('Releasing a hold before its time runs nothing', async () => {
            await gf.keyDown('H');
            await gf.sleep(300);
            await gf.keyUp('H');
            await gf.sleep(1000);
            assert.equal(await log(), '');
        });

        it('A released row runs on key up', async () => {
            await gf.keyDown('R');
            await gf.sleep(100);
            assert.equal(await log(), '', 'not on key down');
            await gf.keyUp('R');
            await expectLog('dropped');
        });

        it('A combo beats the plain input', async () => {
            await gf.keyDown('Q');
            await gf.sleep(50);
            await press('C');
            await gf.keyUp('Q');
            await expectLog('combo', 'combo with the modifier held');
            await press('C');
            await expectLog('combo,plain-c', 'plain row alone');
        });

        it('A double press beats the single press', async () => {
            await gf.keyPress('D');
            await gf.sleep(50);
            await gf.keyPress('D');
            await gf.sleep(400);
            assert.equal(await log(), 'double');
            await gf.keyPress('D');
            await gf.sleep(450);
            assert.equal(await log(), 'double,single', 'one press runs the single row after the double-press window');
        });

        it('Raw keys run their row', async () => {
            await press(gf.KEYS.F1);
            await expectLog('f1');
        });

        it('A mouse row runs on a click on its element only', async () => {
            await gf.click('.ix-held');
            await gf.sleep(100);
            assert.equal(await log(), '');
            await gf.click('.ix-scoped');
            await expectLog('pick');
        });

        it('Held runs once the mouse has been held on the element', async () => {
            const rect = await gf.executeScript(() => {
                const r = document.querySelector('.ix-held').getBoundingClientRect();
                return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            });
            await gf.mousePress(rect.x, rect.y);
            await gf.sleep(150);
            assert.equal(await text('.ix-hold'), 'holding');
            await gf.sleep(1000);
            await gf.mouseRelease(rect.x, rect.y);
            await expectLog('held');
            await gf.retryIfFails(async () => assert.equal(await text('.ix-hold'), 'idle'));
        });

        it('A game event runs its row with the payload', async () => {
            await gf.triggerEngineEvent('playerHit', 25);
            await expectLog('hit:25');
        });

        it('An analog trigger row runs only past its threshold', async () => {
            // The harness's gamepad mock only presses buttons fully; set the left trigger's value directly.
            const pull = (value) => gf.executeScript((id, v) => {
                const trigger = window._getGamepad(id).buttons[6];
                trigger.pressed = v > 0;
                trigger.value = v;
            }, 'ix-trigger', value);
            await gf.connectGamepad('ix-trigger');
            try {
                await pull(0.3);
                await gf.sleep(600);
                await pull(0);
                await gf.sleep(600);
                assert.equal(await log(), '', 'a pull below the threshold runs nothing');

                await pull(0.8);
                await gf.sleep(600);
                await pull(0);
                await expectLog('fire');
            } finally {
                await gf.disconnectGamepad('ix-trigger');
            }
        });
    });

    describe('Bindings, platform and hints', () => {
        it("Remapping an action moves its row to the player's key", async () => {
            await scenario(4);
            await gf.sleep(100);
            await blur();
            await press(gf.KEYS.ENTER);
            assert.equal(await log(), '', 'the old key no longer runs the row');
            await press(gf.KEYS.F2);
            await expectLog('confirm');
        });

        it('The input hint shows the keyboard glyph on PC', async () => {
            await scenario(0);
            await gf.retryIfFails(async () => {
                assert.equal(await device(), 'keyboard');
                assert.equal(await glyph(), 'pc/enter');
            });
        });

        it("Switching the platform re-binds actions to its buttons and switches the hint's glyphs", async () => {
            await scenario(1);
            await gf.retryIfFails(async () => {
                assert.equal(await device(), 'gamepad');
                assert.equal(await glyph(), 'switch/face-button-right', 'Switch confirms with the right face button');
            });

            await gf.connectGamepad('ix-pad');
            const pad = gf.getGamepad('ix-pad');
            await blur();
            await pad.press(gf.GAMEPAD_BUTTONS.FACE_BUTTON_RIGHT, 400);
            await expectLog('confirm');
            await gf.disconnectGamepad('ix-pad');
        });

        it('The game sets the platform', async () => {
            await gf.triggerEngineEvent('platform', 'playstation');
            await gf.retryIfFails(async () => assert.equal(await glyph(), 'playstation/face-button-down'));
        });

        it('The game and the canvas toolbar set the style mode on <html>', async () => {
            await scenario(5);
            assert.equal(await htmlHasClass('colorblind'), true, 'toolbar switch');
            await gf.triggerEngineEvent('style-mode', 'high-contrast');
            await gf.retryIfFails(async () => {
                assert.equal(await htmlHasClass('high-contrast'), true);
                assert.equal(await htmlHasClass('colorblind'), false, 'the previous mode is removed');
            });
        });
    });

    describe('Steps', () => {
        it('Play sound asks the game to play it', async () => {
            const name = await gf.onEngineEvent('play-sound', () => scenario(3));
            assert.equal(name, 'buy');
        });

        it('Go to screen runs the hide handlers, then tells the game', async () => {
            const screen = await gf.onEngineEvent('navigate', () => scenario(2));
            assert.equal(screen, 'Settings');
            assert.equal(await log(), 'hide');
        });

        it('The runtime answers screen-closing with screen-closing-ready', async () => {
            await gf.onEngineEvent('screen-closing-ready', () => gf.triggerEngineEvent('screen-closing'));
        });
    });
});
