const assert = require('assert');
const selectors = require('../shared/toast-selectors.json');
const { navigateToPage } = require('../shared/utils');
const TIMEOUT = 2000;
// Keep in sync with tests/src/components/Toaster/ToasterTest.tsx
const MAX_POSITION = 'bottom-left';
const HIDE_TIMEOUT = 1500;
const positions = [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center',
    'middle-left',
    'middle-right',
    'middle-center',
];

describe('Toast', function () {
    this.beforeAll(async () => {
        await navigateToPage('.toaster-link');
    });

    it('Should render toast', async () => {
        const toastText = 'Test Toast';
        await gf.trigger('create-toast', { text: toastText, position: 'top-right', timeout: TIMEOUT });
        const toast = await gf.get(`.${selectors.toast}`);
        assert.ok(toast, 'Toast should be in the DOM');
        const toastTextElement = await gf.get(`.${selectors.toastText}`);
        assert.equal(await toastTextElement.text(), `${toastText}`, 'Toast should have correct text');
        await gf.sleep(TIMEOUT);
    });

    it('Should render toast with close button', async () => {
        const toastText = 'Toast with Close Button';
        await gf.trigger('create-toast', {
            text: toastText,
            hasCloseButton: true,
            position: 'top-right',
            timeout: TIMEOUT,
        });
        const closeButton = await gf.get(`.${selectors.toastCloseButton}`);
        assert.ok(closeButton, 'Close button should be present');
        await gf.sleep(TIMEOUT);
    });

    it('Should close toast on close button click', async () => {
        const toastText = 'Toast to be closed';
        await gf.trigger('create-toast', {
            text: toastText,
            hasCloseButton: true,
            position: 'top-right',
            timeout: TIMEOUT,
        });
        await gf.click(`.${selectors.toastCloseButton}`);
        await gf.sleep(500);
        try {
            await gf.get(`.${selectors.toast}`);
        } catch (error) {
            // Expected error since the toast should be gone
            assert.ok(true, 'Toast should be removed from the DOM after timeout');
            return;
        }
        assert.fail('Toast should have been removed from the DOM');
    });

    it('Should auto-dismiss toast after timeout', async () => {
        const toastText = 'Auto-dismiss Toast';
        const autoDismissTimeout = 1000; // 1 second
        await gf.trigger('create-toast', { text: toastText, position: 'top-right', timeout: autoDismissTimeout });
        await gf.sleep(autoDismissTimeout + 500); // Wait for timeout plus a buffer
        // Look for this toast only - a toast from an earlier test can still be
        // fading out when this one is checked.
        const stillThere = await gf.executeScript(
            (selector, text) => [...document.querySelectorAll(selector)].some((el) => el.textContent.trim() === text),
            `.${selectors.toastText}`,
            toastText
        );
        assert.ok(!stillThere, 'Toast should have been removed from the DOM');
    });

    it('Should show progress bar', async () => {
        const toastText = 'Toast with Progress Bar';
        await gf.trigger('create-toast', { text: toastText, position: 'top-right', timeout: TIMEOUT });
        const progressBar = await gf.get(`.${selectors.toastProgress}`);
        assert.ok(progressBar, 'Progress bar should be present');
        await gf.sleep(TIMEOUT);
    });

    it('Should change progress', async () => {
        const toastText = 'Toast with Changing Progress';
        await gf.trigger('create-toast', { text: toastText, position: 'top-right', timeout: TIMEOUT });
        const progressBar = await gf.get(`.${selectors.toastProgress}`);
        const initialSize = await progressBar.getSize();
        await gf.sleep(TIMEOUT / 2);
        const midSize = await progressBar.getSize();
        assert.notEqual(initialSize.width, midSize.width, 'Progress bar width should change over time');
        await gf.sleep(TIMEOUT / 2 + 500); // Wait for the rest of the timeout plus a buffer
    });

    it('Should render multiple toasts', async () => {
        const toastText1 = 'First Toast';
        const toastText2 = 'Second Toast';
        await gf.trigger('create-toast', { text: toastText1, position: 'top-right', timeout: TIMEOUT });
        await gf.trigger('create-toast', { text: toastText2, position: 'top-right', timeout: TIMEOUT });
        const toasts = await gf.getAll(`.${selectors.toast}`);
        assert.equal(toasts.length, 2, 'There should be two toasts in the DOM');
        await gf.sleep(TIMEOUT);
    });

    const countToasts = (text) => gf.executeScript(
        (selector, t) => [...document.querySelectorAll(selector)].filter((el) => el.textContent.trim() === t).length,
        `.${selectors.toastText}`,
        text
    );

    it('Should count progress down from 1 to 0', async () => {
        await gf.trigger('create-toast', { text: 'Progress range', position: 'top-left', timeout: TIMEOUT });
        const read = () => gf.executeScript(
            (selector) => Number(document.querySelector(selector).getAttribute('data-progress')),
            `.${selectors.toastProgress}`
        );
        const start = await read();
        await gf.sleep(TIMEOUT / 2);
        const mid = await read();
        assert.ok(start <= 1 && start > mid, `Progress should start at 1 and go down (start ${start}, mid ${mid})`);
        assert.ok(mid > 0 && mid < 1, `Progress should stay between 0 and 1 (mid ${mid})`);
        await gf.sleep(TIMEOUT / 2 + 500);
    });

    it('Should keep at most max toasts per position, removing the oldest', async () => {
        for (const text of ['Max 1', 'Max 2', 'Max 3']) {
            await gf.trigger('create-toast', { text, position: MAX_POSITION, timeout: TIMEOUT });
        }
        await gf.sleep(200);
        assert.equal(await countToasts('Max 1'), 0, 'The oldest toast should have been removed');
        assert.equal(await countToasts('Max 2'), 1, 'The second toast should stay');
        assert.equal(await countToasts('Max 3'), 1, 'The newest toast should stay');
        await gf.sleep(TIMEOUT);
    });

    it('Should not limit positions without a max', async () => {
        for (const text of ['Free 1', 'Free 2', 'Free 3']) {
            await gf.trigger('create-toast', { text, position: 'top-center', timeout: TIMEOUT });
        }
        const toasts = await gf.getAll(`.${selectors.toast}`);
        assert.equal(toasts.length, 3, 'All three toasts should be shown');
        await gf.sleep(TIMEOUT);
    });

    it('Should wait for the hide hook before removing the toast', async () => {
        const text = 'Hide hook';
        await gf.trigger('create-toast', { text, position: 'middle-left', timeout: 0, hideDelay: 400 });
        await gf.click(`.${selectors.toastCloseButton}`);
        await gf.sleep(150);
        assert.equal(await countToasts(text), 1, 'Toast should stay while its hide hook runs');
        const leaving = await gf.executeScript(
            (selector) => document.querySelector(selector).parentElement.getAttribute('data-toast-state'),
            `.${selectors.toast}`
        );
        assert.equal(leaving, 'leaving', 'Toast should be marked as leaving');
        await gf.sleep(500);
        assert.equal(await countToasts(text), 0, 'Toast should be removed after its hide hook');
    });

    it('Should remove the toast after hideTimeout when the hide hook never ends', async () => {
        const text = 'Stuck hide hook';
        await gf.trigger('create-toast', { text, position: 'middle-left', timeout: 0, hideDelay: -1 });
        await gf.click(`.${selectors.toastCloseButton}`);
        await gf.sleep(HIDE_TIMEOUT + 300);
        assert.equal(await countToasts(text), 0, 'Toast should be removed after hideTimeout');
    });

    it('Should wait for a CSS exit animation before removing the toast', async () => {
        const text = 'CSS exit';
        // The animation (400 ms) is shorter than HIDE_TIMEOUT, so only animationend can remove the toast at ~400 ms
        await gf.trigger('create-toast', { text, position: 'middle-left', timeout: 0, cssExit: true });
        await gf.click(`.${selectors.toastCloseButton}`);
        await gf.sleep(150);
        assert.equal(await countToasts(text), 1, 'Toast should stay while its CSS animation runs');
        await gf.sleep(350);
        assert.equal(await countToasts(text), 0, 'Toast should be removed when its CSS animation ends');
    });

    it('Should ignore clicks while the toast is hiding', async () => {
        const text = 'No clicks while hiding';
        // The click counter sits outside the toast, so it can be read even after the toast is removed
        const readClicks = () => gf.executeScript(
            (selector) => document.querySelector(selector).getAttribute('data-clicks'),
            `.${selectors.toastActionClicks}`
        );
        // The hide hook never resolves, so the toast hides for the full HIDE_TIMEOUT
        await gf.trigger('create-toast', { text, position: 'middle-left', timeout: 0, hideDelay: -1, withAction: true });

        // gf.click() checks visibility with a hit test, which a hiding toast (pointer-events: none)
        // fails, so both clicks are mouse clicks at the button's position
        const button = await gf.get(`.${selectors.toastActionButton}`);
        const { x, y } = await button.getPositionOnScreen();
        const { width, height } = await button.getSize();
        const clickButton = async () => {
            const cx = Math.round(x + width / 2);
            const cy = Math.round(y + height / 2);
            await gf.mouseMove(cx, cy);
            await gf.mousePress(cx, cy);
            await gf.mouseRelease(cx, cy);
        };

        await clickButton();
        assert.equal(await readClicks(), '1', 'A shown toast should react to clicks');

        await gf.click(`.${selectors.toastCloseButton}`);
        await clickButton();
        assert.equal(await countToasts(text), 1, 'The toast should still be hiding after the click');
        assert.equal(await readClicks(), '1', 'A hiding toast should not react to clicks');
        await gf.sleep(HIDE_TIMEOUT + 300);
    });

    for (const position of positions) {
        it(`Should render toast at ${position}`, async () => {
            const windowSize = {
                width: await gf.executeScript(() => window.innerWidth),
                height: await gf.executeScript(() => window.innerHeight),
            };

            const toastText = `Toast at ${position}`;
            await gf.trigger('create-toast', { text: toastText, position: position, timeout: 1000 });
            const toast = await gf.get(`.${selectors.toast}`);
            const toastSize = await toast.getSize();
            const toastLocation = await toast.getPositionOnScreen();
            switch (position) {
                case 'top-left':
                    assert.ok(
                        toastLocation.x <= windowSize.width / 3 && toastLocation.y <= windowSize.height / 3,
                        'Toast should be in the top-left quadrant'
                    );
                    break;
                case 'top-right':
                    assert.ok(
                        toastLocation.x >= (windowSize.width / 3) * 2 && toastLocation.y <= windowSize.height / 3,
                        'Toast should be in the top-right quadrant'
                    );
                    break;
                case 'bottom-left':
                    assert.ok(
                        toastLocation.x <= windowSize.width / 3 && toastLocation.y >= (windowSize.height / 3) * 2,
                        'Toast should be in the bottom-left quadrant'
                    );
                    break;
                case 'bottom-right':
                    assert.ok(
                        toastLocation.x >= (windowSize.width / 3) * 2 && toastLocation.y >= (windowSize.height / 3) * 2,
                        'Toast should be in the bottom-right quadrant'
                    );
                    break;
                case 'top-center':
                    assert.ok(
                        toastLocation.x + toastSize.width / 2 === windowSize.width / 2 &&
                        toastLocation.y <= windowSize.height / 3,
                        'Toast should be in the top-center quadrant'
                    );
                    break;
                case 'bottom-center':
                    assert.ok(
                        toastLocation.x + toastSize.width / 2 === windowSize.width / 2 &&
                        toastLocation.y >= windowSize.height / 3,
                        'Toast should be in the bottom-center quadrant'
                    );
                    break;
                case 'middle-left':
                    assert.ok(
                        toastLocation.x <= windowSize.width / 3 &&
                        toastLocation.y + toastSize.height / 2 === windowSize.height / 2,
                        'Toast should be in the middle-left quadrant'
                    );
                    break;
                case 'middle-right':
                    assert.ok(
                        toastLocation.x > windowSize.width / 2 &&
                        toastLocation.y + toastSize.height / 2 === windowSize.height / 2,
                        'Toast should be in the middle-right quadrant'
                    );
                    break;
                case 'middle-center':
                    assert.ok(
                        toastLocation.x + toastSize.width / 2 === windowSize.width / 2 &&
                        toastLocation.y + toastSize.height / 2 === windowSize.height / 2,
                        'Toast should be in the middle-center quadrant'
                    );
                    break;
            }
            await gf.sleep(1000);
        });
    }
});
