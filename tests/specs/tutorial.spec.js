const assert = require('assert');
const selectors = require('../shared/tutorial/tutorial-selectors.json');
const events = require('../shared/tutorial/tutorial-events.json')
// Resolve element keys in steps.json using selectors.json so we can reference selector names instead of hardcoding full class strings.
const steps = require('../shared/tutorial/tutorial-steps.json')
    .map(step => ({ ...step, element: selectors[step.element.slice(1)] }));

describe('Tutorial', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.tutorial-link');
    });

    this.beforeEach(async () => {
        await gf.trigger(events.start);
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should start a tour', async () => {
        const tutorial = await gf.get(`.${selectors.tutorial}`);
        const tooltip = await gf.get(`.${selectors.tooltip}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        assert.ok(await tutorial.isVisible(), 'Tutorial element should be visible');
        assert.ok(tooltip.waitForVisibility(true), 'Tooltip element should be visible');
        assert.equal(await assertionEl.text(), '1', 'Step should be 1');
    });

    it('Should proceed to next step', async () => {
        await gf.click(`.${selectors['tooltip-next']}`);
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '2', 'Step should be 2');
    });

    it('Should return to previous step', async () => {
        await gf.click(`.${selectors['tooltip-next']}`);
        await gf.click(`.${selectors['tooltip-prev']}`);
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '1', 'Step should be 1');
    });

    it('Should exit', async () => {
        await gf.trigger(events.end);
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '0', 'Step should be 0');
    });

    it('Should pause', async () => {
        await gf.trigger(events.pause);
        
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '0', 'Step should be 0');
        assert.ok(await gf.isHidden(`.${selectors.tutorial}`), 'Tutorial element should be hidden');
    });

    it('Should Resume', async () => {
        await gf.trigger(events.pause);
        await gf.trigger(events.resume);
        
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '1', 'Step should be 1');
        assert.ok(await gf.isVisible(`.${selectors.tutorial}`), 'Tutorial element should be visible');
    });

    it('Should Resume from next step', async () => {
        await gf.trigger(events.pause);
        await gf.trigger(events['resume-from-next']);
        
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '2', 'Step should be 2');
        assert.ok(await gf.isVisible(`.${selectors.tutorial}`), 'Tutorial element should be visible');
    });

    it('Should prevent navigation to steps below 1', async () => {
        await gf.click(`.${selectors['tooltip-prev']}`);
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '1', 'Step should be 1');
    });

    it('Should programatically change step', async () => {
        await gf.trigger(events['change-step'], { step: 3 })
        assert.equal(await gf.text(`.${selectors.assertionElement}`), '3', 'Step should be 3');
    });

    it('Should end tour if next is clicked when on last step', async () => {
        await gf.trigger(events['change-step'], { step: steps.length  })
        await gf.click(`.${selectors['tooltip-next']}`);
        assert.equal(await gf.text(`.${selectors.assertionElement}`), `0`, `Step should be 0`);
    });

    it('Should complete the whole tour', async () => {
        const assertEl = await gf.get(`.${selectors.assertionElement}`);
        for (let i = 1; i < steps.length; i++) {
            await gf.click(`.${selectors['tooltip-next']}`);
            if (i < steps.length) {
                assert.equal(await assertEl.text(), `${i + 1}`, `Step should be ${i + 1}`);
            } else {
                assert.equal(await assertEl.text(), `0`, `Tour should have concluded`);
            }
        }
    });

    it('Should work with dynamic elements', async () => {
        await gf.trigger(events['dynamic-element']);
        await gf.trigger(events['change-step'], {step: steps.length});
        await gf.click(`.${selectors['tooltip-next']}`);
        assert.equal(await gf.text(`.${selectors.assertionElement}`), `${steps.length + 1}`, `Dynamic step ${steps.length + 1} should have appeared`);
    });

    describe('Tooltip', function () {
        it('Should update title and content correctly', async () => {
            const title = await gf.get(`.${selectors['tooltip-title']}`);
            const content = await gf.get(`.${selectors['tooltip-content']}`);

            assert.equal(await title.text(), steps[0].title, "Title should match")
            assert.equal(await content.text(), steps[0].content, "Content should match")

            await gf.click(`.${selectors['tooltip-next']}`);

            assert.equal(await title.text(), steps[1].title, "Title should match")
            assert.equal(await content.text(), steps[1].content, "Content should match")
        });
        
        it('Should update progress correctly', async () => {
            const progressFill = await gf.get(`.${selectors['tooltip-progress-fill']}`);
            const getPercentage = (step) => (step / steps.length) * 100 + "%";
            const hasCorrectWidth = async (step) => await progressFill.waitForStyles({width: getPercentage(step)});

            for (let step = 1; step <= steps.length; step++) {
                assert(await hasCorrectWidth(step), "Progress is correct")
                await gf.trigger(events['change-step'], {step: step + 1});
            }
        });

        it('Should be in the correct position', async () => {
            const tooltip = await gf.get(`.${selectors.tooltip}`);
            
            for (let step = 1; step <= steps.length; step++) {
                const position = steps[step - 1].position ?? null;
                if (position) {
                    await gf.sleep(700);
                    const tooltipPos = await tooltip.getPositionOnScreen();
                    const refEl = await gf.get(`.${steps[step - 1].element}`);
                    const refElPos = await refEl.getPositionOnScreen();
                    const refElSize = await refEl.getSize();
    
                    switch (position) {
                        case "top":
                            assert(tooltipPos.y <= refElPos.y, "Tooltip is on top of the ref element")
                            break;
                        case "bottom":
                            assert(tooltipPos.y >= (refElPos.y + refElSize.height), "Tooltip is at the bottom of the ref element")
                            break;
                        case "left":
                            assert(tooltipPos.x <= refElPos.x, "Tooltip is on the left of the ref element")
                            break;
                        case "right":
                            assert(tooltipPos.x >= (refElPos.x + refElSize.width), "Tooltip is on the right of the ref element")
                            break;
                    }
                }
                await gf.trigger(events['change-step'], {step: step + 1});
            }
        });
    })

    describe("Rect", function () {
        it('Should match the wrapped element\'s dimensions', async () => {
            const tutorial = await gf.get(`.${selectors.tutorial}`);
            const isSameSize = (rect1, rect2) => rect1.x === rect2.x && rect1.y === rect2.y; 
            const isSamePos = (rect1, rect2) => rect1.width === rect2.width && rect1.height === rect2.height; 

            for (let step = 0; step < steps.length; step++) {
                const rectPos = await tutorial.getPositionOnScreen();
                const rectSize = await tutorial.getSize();
                const refEl = await gf.get(`.${steps[step].element}`);
                const refElPos = await refEl.getPositionOnScreen();
                const refElSize = await refEl.getSize();

                assert(isSamePos(rectPos, refElPos), "Positions are the same")
                assert(isSameSize(rectSize, refElSize), "Positions are the same")

                await gf.trigger(events['change-step'], {step: step + 2});
            }
        });
    })

    describe("Rectivity", function () {
        it(`should update styles & classes reactively on props change`, async () => {
            await gf.trigger(events['change-styles']);
            const el = await gf.get(`.${selectors.tutorial}`);
            const styles = await el.styles();
            const classes = await el.classes();
            assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
            assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
        });
    })
});
