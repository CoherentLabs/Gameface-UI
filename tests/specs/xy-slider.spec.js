const assert = require('assert');
const selectors = require('../shared/xy-slider-selectors.json');

describe('XYSlider', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.xy-slider-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
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
        await handle.drag(25, 250);

        assert.equal(await assertionEl.text(), 'x: 39 | y: 106', 'Slider\'s value should change to \'x: 39 | y: 106\'');
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

        assert.equal(await assertionEl.text(), 'x: 100 | y: 99', 'Slider\'s thumb should move to the center');
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