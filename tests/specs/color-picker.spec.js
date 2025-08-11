const assert = require('assert');
const selectors = require('../shared/color-picker-selectors.json');

const colorDragPositions = {
    '#FFE6E6FF': { x: 25, y: 0 },
    '#00FF3CFF': { x: 100, y: 250 },
    '#FF00005E': { x: 100, y: 250 }
}

async function testColorPickerDrag(color, sliderEl, assertionEl, dragging2D = false) {
    const { x, y } = colorDragPositions[color];
    if (x === undefined || y === undefined) throw new Error(`No drag position defined for color ${color}`);
    await sliderEl.drag(x, y);

    assert.equal(await assertionEl.getValue(), color, `${dragging2D ? 'Color picker' : 'Slider'}\'s value should change to '${color}'`);
}

describe('Color Picker', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.color-picker-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const colorPickerElements = await (await gf.get(`.${selectors.colorPicker}`)).children();
        assert.equal(colorPickerElements.length, 5, 'Color Picker should have 5 children: xySlider, hueSlider, alphaSlider, segment and color preview');
    })

    it('Should change color with dragging the xy slider', async () => {
        const colorPickerElements = await (await gf.get(`.${selectors.colorPicker}`)).children();

        const assertionEl = await colorPickerElements.last().find('input');
        const xySliderHandle = (await (await colorPickerElements.first()).children()).last();

        await testColorPickerDrag('#FFE6E6FF', xySliderHandle, assertionEl, true);
    })

    it('Should change color with dragging the hue slider', async () => {
        const colorPickerElements = await (await gf.get(`.${selectors.colorPicker}`)).children();

        const assertionEl = await colorPickerElements.last().find('input');
        const hueSliderEl = await colorPickerElements.nth(1);
        const hueSliderTrackEl = (await hueSliderEl.children()).first();
        const hueSliderHandle = (await hueSliderTrackEl.children()).first();

        await testColorPickerDrag('#00FF3CFF', hueSliderHandle, assertionEl);
    })

    it('Should change color with dragging the alpha slider', async () => {
        const colorPickerElements = await (await gf.get(`.${selectors.colorPicker}`)).children();

        const assertionEl = await colorPickerElements.last().find('input');
        const alphaSliderEl = await colorPickerElements.nth(2);
        const alphaSliderTrackEl = (await alphaSliderEl.children()).first();
        const alphaSliderHandleEl = (await alphaSliderTrackEl.children()).first();

        await testColorPickerDrag('#FF00005E', alphaSliderHandleEl, assertionEl);
    })

    it('Should change apha and check the color preview element', async () => {
        const colorPickerElements = await (await gf.get(`.${selectors.colorPicker}`)).children();

        const assertionEl = await colorPickerElements.last().find('input');
        const alphaSliderEl = await colorPickerElements.nth(2);
        const alphaSliderTrackEl = (await alphaSliderEl.children()).first();
        const alphaSliderHandleEl = (await alphaSliderTrackEl.children()).first();

        await testColorPickerDrag('#FF00005E', alphaSliderHandleEl, assertionEl);

        const colorPreviewWrapperEl = await colorPickerElements.last();
        const colorPreviewEl = (await colorPreviewWrapperEl.children()).first();
        const colorPreviewBoxEl = (await colorPreviewEl.children()).first();
        const colorPreviewStyles = await colorPreviewBoxEl.styles();
        assert.equal(colorPreviewStyles['background-color'], 'rgba(255, 0, 0, 0.37)', 'Color preview element should have rgba(255, 0, 0, 0.37) as background color');
    })

    it('Should change color preview value to rgba instead of hex', async () => {
        const colorPickerElements = await (await gf.get(`.${selectors.colorPicker}`)).children();

        const assertionEl = await colorPickerElements.last().find('input');
        const segment = await colorPickerElements.nth(3);
        await ((await segment.children()).last()).click();

        assert.equal(await assertionEl.getValue(), 'rgba(255, 0, 0, 1)', 'Slider\'s value should change to \'rgba(255, 0, 0, 1)\'');
    })

    it('Should change value via ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        assert.equal(await assertionEl.text(), 'rgba(128, 117, 64, 1)', 'Slider\'s value should change to \'rgba(128, 117, 64, 1)\'');
    })

    describe('reactivity', () => {
        it(`should update styles & classes reactively on props change — background`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
            const el = await gf.get(`.${selectors.colorPicker}`);
            const styles = await el.styles();
            const classes = await el.classes();
            assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
            assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
        });
    });
});