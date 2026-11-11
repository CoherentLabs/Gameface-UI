const assert = require('assert');
const selectors = require('../shared/scroll-selectors.json');
const { navigateToPage } = require('../shared/utils');

describe('Scroll', function () {
    this.beforeAll(async () => {
        await navigateToPage('.scroll-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    this.beforeEach(async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
    })

    it('Should render itself and its children correctly', async () => {
        const scroll = await gf.get(`.${selectors.scroll}`);
        const content = await scroll.find(`.${selectors.content}`);
        const contentChild = await content.find(`.${selectors.scrollChild}`);
        const assertionEl = await scroll.find(`.${selectors.assertionElement}`);
        const bar = await scroll.find(`.${selectors.bar}`);
        const handle = await scroll.find(`.${selectors.handle}`);

        assert.ok(scroll, 'Scroll should be in the DOM');
        assert.ok(content, 'Scroll content should in the DOM');
        assert.ok(contentChild, 'Content should render its children');
        assert.ok(assertionEl, 'Element should appear after overflow');
        assert.ok(bar, 'Scroll bar should be in the DOM');
        assert.ok(handle, 'Scroll handle should be in the DOM');
    })

    it('Should scroll up and down', async () => {
        const content = await gf.get(`.${selectors.content}`);
        const contentChild = await content.find(`.${selectors.scrollChild}`);

        await content.scroll(0, 200);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling down');
        })

        await content.scroll(0, -200);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), true, 'Element should be visible in the area after scrolling up');
        })
    })

    it('Should scroll up and down with scroll handle', async () => {
        const content = await gf.get(`.${selectors.content}`);
        const contentChild = await content.find(`.${selectors.scrollChild}`);
        const handle = await gf.get(`.${selectors.handle}`);

        await handle.dragBy(0, 20);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling down');
        })
        await handle.dragBy(0, -20);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), true, 'Element should be visible in the area after scrolling up');
        })
    })

    it('Should scroll up and down with scroll ref', async () => {
        const content = await gf.get(`.${selectors.content}`);
        const contentChild = await content.find(`.${selectors.scrollChild}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-2`)
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling down');
        })

        await gf.click(`.${selectors.scenarioBtn}.scenario-1`)
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), true, 'Element should be visible in the area after scrolling up');
        })
    })

    it('Should scroll to the end of the content with ref', async () => {
        const content = await gf.get(`.${selectors.content}`);
        const contentChild = await content.find(`.${selectors.scrollChild}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-4`)
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling to the end');
        })
    })


    it('Should scroll to a specified element', async () => {
        const content = await gf.get(`.${selectors.content}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-5`)
        await gf.retryIfFails(async () => {
            assert.equal(await assertionEl.isVisibleInScrollableArea(content), true, 'Element should be scrolled to');
        })
    })

    it('Should scroll a specified element into view', async () => {
        const content = await gf.get(`.${selectors.content}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-6`)
        await gf.retryIfFails(async () => {
            assert.equal(await assertionEl.isVisibleInScrollableArea(content), true, 'Element should be scrolled into view');
        })
    })

    it('Should execute logic after scrolling', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-2`)
        assert.equal(await assertionEl.text(), 'down', 'Element\'s text should correspond with scroll direction');
    })

    describe('track click-and-hold', () => {
        const getTrackPoint = async (ratio) => {
            const bar = await gf.get(`.${selectors.longBar}`);
            const { x, y } = await bar.getPositionOnScreen();
            const { width, height } = await bar.getSize();
            return { x: Math.round(x + width / 2), y: Math.round(y + height * ratio) };
        };

        const getHandleBounds = async () => {
            const handle = await gf.get(`.${selectors.longHandle}`);
            const { y } = await handle.getPositionOnScreen();
            const { height } = await handle.getSize();
            return { top: y, bottom: y + height };
        };

        it('Should stop the handle under the cursor without bouncing', async () => {
            const { x, y } = await getTrackPoint(0.6);
            await gf.mouseMove(x, y);
            await gf.mousePress(x, y);
            try {
                // The handle is ~1px tall here, so allow 1px for rounding
                await gf.retryIfFails(async () => {
                    const { top, bottom } = await getHandleBounds();
                    assert.ok(top - 1 <= y && y <= bottom + 1, `Handle (${top}-${bottom}) should be under the cursor (${y})`);
                });
                const { top } = await getHandleBounds();
                for (let i = 0; i < 5; i++) {
                    await gf.sleep(70);
                    assert.equal((await getHandleBounds()).top, top, 'Handle should stay still while the mouse is held');
                }
            } finally {
                await gf.mouseRelease(x, y);
            }
        });

        it('Should stop scrolling when the mouse is released outside the bar', async () => {
            const { x, y } = await getTrackPoint(0.95);
            await gf.mouseMove(x, y);
            await gf.mousePress(x, y);
            await gf.sleep(300);
            await gf.mouseMove(x - 200, y);
            await gf.mouseRelease(x - 200, y);

            const atRelease = await getHandleBounds();
            await gf.sleep(500);
            const after = await getHandleBounds();
            assert.ok(atRelease.bottom < y, 'Handle should still be scrolling when the mouse is released');
            assert.equal(after.top, atRelease.top, 'Handle should stop moving after release');
        });
    });

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.scroll}`, desc: 'root' },
            { selector: `.${selectors.content}`, desc: 'content' },
            { selector: `.${selectors.bar}`, desc: 'bar' },
            { selector: `.${selectors.handle}`, desc: 'handle' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});