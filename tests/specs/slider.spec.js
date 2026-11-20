const assert = require('assert');
const selectors = require('../shared/slider-selectors.json');
const { navigateToPage, onChangeCalls, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

describe('Slider', function () {
    this.beforeAll(async () => {
        await navigateToPage('.slider-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('slider', [], 'No onChange for the initial value');
    })

    it('Should render itself and its children correctly', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const fill = await slider.find(`.${selectors.sliderFill}`);
        const track = await slider.find(`.${selectors.sliderTrack}`);
        const handle = await slider.find(`.${selectors.sliderHandle}`);
        const thumb = await slider.find(`.${selectors.sliderThumb}`);
        const grid = await slider.find(`.${selectors.sliderGrid}`);
        const gridPols = await grid.findAll(`.${selectors.sliderPol}`);

        assert.ok(slider, 'Slider should be in the DOM');
        assert.ok(fill, 'Slider fill should be in the DOM');
        assert.ok(track, 'Slider track should be in the DOM');
        assert.ok(handle, 'Slider handle should be in the DOM');
        assert.ok(thumb, 'Slider thumb should be in the DOM');
        assert.ok(grid, 'Slider grid should be in the DOM');
        assert.equal(gridPols.length, 25, 'Slider grid should be in the DOM');
    })

    it('Should change value', async () => {
        const handle = await gf.get(`.${selectors.sliderHandle}`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        await handle.dragBy(1000, 0);

        assert.equal(await thumb.text(), 100, 'Slider\'s value should change to 100');
    })

    it('Should change value via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        assert.equal(await thumb.text(), 20, 'Slider\'s value should change to 20');
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

        assert.equal(await thumb.text(), 50, 'Slider\'s thumb should move to the center');
    })

    it('Should update value via the value prop (two-way binding)', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);

        assert.equal(await thumb.text(), 80, 'Slider value should update to 80 via the value prop');
    })

    it('Should not call onChangeEnd before any interaction', async () => {
        const changeEndEl = await gf.get(`.${selectors.changeEndElement}`);

        assert.equal(await changeEndEl.text(), 'none', 'onChangeEnd should not fire on mount');
    })

    it('Should retrieve final value via onChangeEnd prop after dragging', async () => {
        const changeEndEl = await gf.get(`.${selectors.changeEndElement}`);
        const handle = await gf.get(`.${selectors.sliderHandle}`);
        const thumb = await gf.get(`.${selectors.sliderThumb}`);
        await handle.dragBy(1000, 0);

        assert.equal(await changeEndEl.text(), await thumb.text(), 'onChangeEnd element\'s text should match the final value of the slider');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.slider}`, desc: 'root' },
            { selector: `.${selectors.sliderFill}`, desc: 'fill' },
            { selector: `.${selectors.sliderTrack}`, desc: 'track' },
            { selector: `.${selectors.sliderHandle}`, desc: 'handle' },
            { selector: `.${selectors.sliderThumb}`, desc: 'thumb' },
            { selector: `.${selectors.sliderGrid}`, desc: 'grid' },
            { selector: `.${selectors.sliderPol}`, desc: 'pols' },
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

describe('Slider onChange calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should report every new value once while dragging', async () => {
        await (await gf.get(`.${selectors.sliderHandle}`)).dragBy(1000, 0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const calls = await onChangeCalls('slider');
        assert.ok(calls.length > 0, 'The drag reported at least one value');
        assert.equal(calls[calls.length - 1], 100, 'The last reported value is the end of the drag');
        assertNoRepeatedValues(calls, 'Drag');
    })

    it('Should call onChange synchronously from the ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.deepEqual(await onChangeSyncCalls('slider'), [20], 'onChange fired before changeValue returned');
        await expectOnChangeCalls('slider', [20], 'No late duplicate');
    })

    it('Should not call onChange when setting the same value', async () => {
        await gf.trigger('sliderSameValue');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('slider'), [], 'changeValue with the current value');
        })
        await expectOnChangeCalls('slider', [], 'No call at all');
    })

    // Behavior as on master: a change through the `value` prop is reported once (TASKS 13 may change this).
    it('Should call onChange once when the value prop changes', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await expectOnChangeCalls('slider', [80], 'value prop 80');
    })
});

describe('Slider onChangeEnd calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should call onChangeEnd once per drag, with the final value', async () => {
        await (await gf.get(`.${selectors.sliderHandle}`)).dragBy(200, 0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const changes = await onChangeCalls('slider');
        assert.ok(changes.length > 0, 'The drag changed the value');
        await expectOnChangeCalls('slider-end', [changes[changes.length - 1]], 'One onChangeEnd, on release, with the last onChange value');
    })

    it('Should not call onChangeEnd for a ref change', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        // the gamepad commit is debounced by 250 ms, so wait past it
        await new Promise((resolve) => setTimeout(resolve, 300));
        await expectOnChangeCalls('slider-end', [], 'onChangeEnd is only for user drags and gamepad steps');
    })
});
