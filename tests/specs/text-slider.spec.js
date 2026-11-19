const assert = require('assert');
const selectors = require('../shared/slider-selectors.json');
const { navigateToPage, onChangeCalls, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

describe('TextSlider', function () {
    this.beforeAll(async () => {
        await navigateToPage('.text-slider-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('text-slider', [], 'No onChange for the initial value');
    })

    it('Should render itself and its children correctly', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const fill = await slider.find(`.${selectors.sliderFill}`);
        const track = await slider.find(`.${selectors.sliderTrack}`);
        const handle = await slider.find(`.${selectors.sliderHandle}`);
        const thumb = await slider.find(`.${selectors.sliderThumb}`);
        const gridPols = await slider.findAll(`.${selectors.sliderPol}`);

        assert.ok(slider, 'Slider should be in the DOM');
        assert.ok(fill, 'Slider fill should be in the DOM');
        assert.ok(track, 'Slider track should be in the DOM');
        assert.ok(handle, 'Slider handle should be in the DOM');
        assert.ok(thumb, 'Slider thumb should be in the DOM');
        assert.equal(gridPols.length, 4, 'Slider grid should be in the DOM');
    })

    it('Should change value', async () => {
        const handle = await gf.get(`.${selectors.sliderHandle}`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        await handle.dragBy(1000, 0);

        assert.equal(await thumb.text(), 'Extreme', 'Slider\'s value should change to Extreme');
    })

    it('Should change value via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        assert.equal(await thumb.text(), 'Medium', 'Slider\'s value should change to \'Medium\'');
    })

    it('Should retrieve value via onChange prop', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const handle = await gf.get(`.${selectors.sliderHandle}`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        await handle.dragBy(1000, 0);

        assert.equal(await assertionEl.text(), await thumb.text(), 'Assertion element\'s text should match the value of the slider');
    })

    it('Should change value after clicking on track', async () => {
        const track = await gf.get(`.${selectors.sliderTrack}`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        await track.click();

        assert.equal(await thumb.text(), 'Hard', 'Slider\'s thumb should move to the center');
    })

    it('Should update value via the value prop (two-way binding)', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);

        assert.equal(await thumb.text(), 'Hard', 'TextSlider value should update to \'Hard\' via the value prop');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.slider}`, desc: 'root' },
            { selector: `.${selectors.sliderFill}`, desc: 'fill' },
            { selector: `.${selectors.sliderTrack}`, desc: 'track' },
            { selector: `.${selectors.sliderHandle}`, desc: 'handle' },
            { selector: `.${selectors.sliderThumb}`, desc: 'thumb' },
            { selector: `.${selectors.sliderPol}`, desc: 'pols' },
            { selector: `.${selectors.sliderPolText}`, desc: 'pols-text' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
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

describe('TextSlider onChange calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should report every new value once while dragging', async () => {
        await (await gf.get(`.${selectors.sliderHandle}`)).dragBy(1000, 0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const calls = await onChangeCalls('text-slider');
        assert.ok(calls.length > 0, 'The drag reported at least one value');
        assertNoRepeatedValues(calls, 'Drag');
    })

    it('Should call onChange synchronously from the ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.deepEqual(await onChangeSyncCalls('text-slider'), ['Medium'], 'onChange fired before changeValue returned');
        await expectOnChangeCalls('text-slider', ['Medium'], 'No late duplicate');
    })

    it('Should not call onChange when setting the same value', async () => {
        await gf.trigger('textSliderSameValue');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('text-slider'), [], 'changeValue with the current value');
        })
        await expectOnChangeCalls('text-slider', [], 'No call at all');
    })

    // Behavior as on master: a change through the `value` prop is reported once (TASKS 13 may change this).
    it('Should call onChange once when the value prop changes', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await expectOnChangeCalls('text-slider', ['Hard'], 'value prop "Hard"');
    })
});
