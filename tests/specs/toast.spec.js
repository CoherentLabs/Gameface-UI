const assert = require('assert');
const selectors = require('../shared/toast-selectors.json');
const TIMEOUT = 2000;
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
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.toaster-link');
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
        try {
            await gf.get(`.${selectors.toast}`);
        } catch (error) {
            // Expected error since the toast should be gone
            assert.ok(true, 'Toast should be removed from the DOM after timeout');
            return;
        }
        assert.fail('Toast should have been removed from the DOM');
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
