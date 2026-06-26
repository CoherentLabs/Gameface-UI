const assert = require('assert');
const selectors = require('../shared/two-handle-slider-selectors.json');
const { navigateToPage } = require('../shared/utils');

describe('TwoHandleSlider', function () {
    this.beforeAll(async () => {
        await navigateToPage('.two-handle-slider-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const fill = await slider.find(`.${selectors.sliderFill}`);
        const track = await slider.find(`.${selectors.sliderTrack}`);
        const handles = await slider.findAll(`.${selectors.sliderHandle}`);
        const thumbs = await slider.findAll(`.${selectors.sliderThumb}`);
        const grid = await slider.find(`.${selectors.sliderGrid}`);
        const gridPols = await grid.findAll(`.${selectors.sliderPol}`);

        assert.ok(slider, 'Slider should be in the DOM');
        assert.ok(fill, 'Slider fill should be in the DOM');
        assert.ok(track, 'Slider track should be in the DOM');
        assert.equal(handles.length, 2, 'Both handles should be in the DOM');
        assert.equal(thumbs.length, 2, 'Both thumbs should be in the DOM');
        assert.ok(grid, 'Slider grid should be in the DOM');
        assert.equal(gridPols.length, 25, 'Grid should render the expected number of pols');
    })

    it('Should render the initial range', async () => {
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);

        assert.equal(await startEl.text(), 20, 'Start handle should start at 20');
        assert.equal(await endEl.text(), 60, 'End handle should start at 60');
    })

    it('Should change the start handle by dragging', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const handles = await slider.findAll(`.${selectors.sliderHandle}`);
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);
        await handles[0].dragBy(-30)

        assert.equal(await startEl.text(), 0, 'Start handle should move to the minimum');
    })

    it('Should change the end handle by dragging', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const handles = await slider.findAll(`.${selectors.sliderHandle}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);
        await handles[1].dragBy(1000, 0);

        assert.equal(await endEl.text(), 100, 'End handle should move to the maximum');
    })

    it('Should prevent the handles from crossing', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const handles = await slider.findAll(`.${selectors.sliderHandle}`);
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);
        await handles[0].dragBy(1000, 0); // try to drag the start handle past the end handle

        assert.equal(await endEl.text(), 60, 'End handle should stay in place');
        assert.equal(await startEl.text(), 50, 'Start handle should stop one step below the end handle');
    })

    it('Should change both handles via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);

        assert.equal(await startEl.text(), 30, 'Start handle should change to 30');
        assert.equal(await endEl.text(), 70, 'End handle should change to 70');
    })

    it('Should change the start handle via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);

        assert.equal(await startEl.text(), 40, 'Start handle should change to 40');
    })

    it('Should change the end handle via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);

        assert.equal(await endEl.text(), 80, 'End handle should change to 80');
    })

    it('Should step the start handle via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);

        assert.equal(await startEl.text(), 30, 'Start handle should step up to 30');
    })

    it('Should step the end handle via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);

        assert.equal(await endEl.text(), 50, 'End handle should step down to 50');
    })

    it('Should update the range via the value prop (two-way binding)', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-6`);
        const startEl = await gf.get(`.${selectors.assertionStartElement}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);

        assert.equal(await startEl.text(), 10, 'Start handle should update to 10');
        assert.equal(await endEl.text(), 90, 'End handle should update to 90');
    })

    it('Should retrieve the range via onChange prop', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const handles = await slider.findAll(`.${selectors.sliderHandle}`);
        const thumbs = await slider.findAll(`.${selectors.sliderThumb}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);
        await handles[1].dragBy(1000, 0);

        assert.equal(await endEl.text(), await thumbs[1].text(), 'onChange end value should match the end thumb');
    })

    it('Should change the nearest handle when clicking on the track', async () => {
        const track = await gf.get(`.${selectors.sliderTrack}`);
        const endEl = await gf.get(`.${selectors.assertionEndElement}`);
        await track.click();

        assert.equal(await endEl.text(), 50, 'Clicking the track center should move the nearest (end) handle to 50');
    })

    it('Should not call onChangeEnd before any interaction', async () => {
        const changeEndStartEl = await gf.get(`.${selectors.changeEndStartElement}`);
        const changeEndEndEl = await gf.get(`.${selectors.changeEndEndElement}`);

        assert.equal(await changeEndStartEl.text(), 'none', 'onChangeEnd should not fire on mount');
        assert.equal(await changeEndEndEl.text(), 'none', 'onChangeEnd should not fire on mount');
    })

    it('Should retrieve the final range via onChangeEnd after dragging', async () => {
        const slider = await gf.get(`.${selectors.slider}`);
        const handles = await slider.findAll(`.${selectors.sliderHandle}`);
        const thumbs = await slider.findAll(`.${selectors.sliderThumb}`);
        const changeEndEndEl = await gf.get(`.${selectors.changeEndEndElement}`);
        await handles[1].dragBy(1000, 0);

        assert.equal(await changeEndEndEl.text(), await thumbs[1].text(), 'onChangeEnd end value should match the end thumb');
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
