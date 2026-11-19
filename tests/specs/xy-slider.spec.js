const assert = require('assert');
const selectors = require('../shared/xy-slider-selectors.json');
const { navigateToPage, onChangeCalls, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

describe('XYSlider', function () {
    this.beforeAll(async () => {
        await navigateToPage('.xy-slider-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('xy-slider', [], 'No onChange for the initial value');
    })

    it('Should render itself and its children correctly', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const handle = await slider.find(`.${selectors.sliderHandle}`);
        const background = await slider.find(`.${selectors.sliderBackground}`);

        assert.ok(slider, 'Slider should be in the DOM');
        assert.ok(handle, 'Slider handle should be in the DOM');
        assert.ok(background, 'Slider background should be in the DOM');
    })

    it('Should change value with dragging', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const handle = await gf.get(`.${selectors.sliderHandle}`);
        await handle.dragBy(-8, -50);

        assert.equal(await assertionEl.text(), 'x: 40 | y: 0', 'Slider\'s value should change to \'x: 40 | y: 0\'');
    })

    it('Should change value via ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        assert.equal(await assertionEl.text(), 'x: 30 | y: 30', 'Slider\'s value should change to \'x: 30 | y: 30\'');
    })

    it('Should change value after clicking on bakcground', async () => {
        const background = await gf.get(`.${selectors.sliderBackground}`);
        await background.click();
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        // The click lands on the background's center pixel, so rounding can put
        // either axis 1 off the exact center (100) depending on the layout.
        const [x, y] = (await assertionEl.text()).match(/-?\d+/g).map(Number);
        assert.ok(Math.abs(x - 100) <= 1 && Math.abs(y - 100) <= 1, `Slider's thumb should move to the center (got x: ${x} | y: ${y})`);
    })

    it('Should change min and max reactively', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);

        assert.equal(await assertionEl.text(), 'x: 60 | y: 60', 'Slider\'s value should change to \'x: 60 | y: 60\'');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.slider}`, desc: 'root' },
            { selector: `.${selectors.sliderHandle}`, desc: 'handle' },
            { selector: `.${selectors.sliderBackground}`, desc: 'background' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                if (selector === `.${selectors.sliderBackground}`) {
                    assert.equal(styles['background-image'], 'linear-gradient(to bottom right,rgba(255, 0, 0, 1), rgba(185, 185, 185, 1), rgba(119, 119, 119, 1), rgba(59, 59, 59, 1), rgba(0, 0, 0, 1))', 'styles update');
                } else {
                    assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                }
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});

// A drag reports every new value once: the same value twice in a row is a duplicate call.
function assertNoRepeatedValues(calls, message) {
    for (let i = 1; i < calls.length; i++) {
        assert.notDeepEqual(calls[i], calls[i - 1], `${message}: call ${i} repeats the previous value ${JSON.stringify(calls[i])}`);
    }
}

describe('XYSlider onChange calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should report every new value once while dragging', async () => {
        await (await gf.get(`.${selectors.sliderHandle}`)).dragBy(-8, -50);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const calls = await onChangeCalls('xy-slider');
        assert.ok(calls.length > 0, 'The drag reported at least one value');
        assertNoRepeatedValues(calls, 'Drag');
    })

    it('Should call onChange synchronously from the ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.deepEqual(await onChangeSyncCalls('xy-slider'), [{ x: 30, y: 30 }], 'onChange fired before changeValue returned');
        await expectOnChangeCalls('xy-slider', [{ x: 30, y: 30 }], 'No late duplicate');
    })

    it('Should not call onChange when setting the same value', async () => {
        await gf.trigger('xySliderSameValue');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('xy-slider'), [], 'changeValue with the current value');
        })
        await expectOnChangeCalls('xy-slider', [], 'No call at all');
    })

    it('Should call onChange once when new bounds clamp the value', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await expectOnChangeCalls('xy-slider', [{ x: 60, y: 60 }], 'min 60 clamps { x: 50, y: 50 }');
    })
});
