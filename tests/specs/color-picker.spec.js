const assert = require('assert');
const selectors = require('../shared/color-picker-selectors.json');
const { navigateToPage, elementChildren } = require('../shared/utils');
/** @typedef {import('gameface-e2e/dist/commands/dom-element').DOMElement} DOMElement*/

const colorDragPositions = {
    '#FFB8B8FF': { x: -231, y: 0 },
    '#37FF00FF': { x: 81, y: 0 },
    '#FF000080': { x: -137, y: 0 }
}

/**
 * @param {string} color 
 * @param {DOMElement} sliderEl
 * @param {DOMElement} assertionEl
 * @param {boolean} dragging2D 
 */
async function testColorPickerDrag(color, sliderEl, assertionEl, dragging2D = false) {
    const { x, y } = colorDragPositions[color];
    if (x === undefined || y === undefined) throw new Error(`No drag position defined for color ${color}`);
    await sliderEl.dragBy(x, y);

    assert.equal(await assertionEl.getValue(), color, `${dragging2D ? 'Color picker' : 'Slider'}\'s value should change to '${color}'`);
}

describe('Color Picker', function () {
    this.beforeAll(async () => {
        await navigateToPage('.color-picker-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const colorPickerElements = await elementChildren(await gf.get(`.${selectors.colorPicker}`));
        assert.equal(colorPickerElements.length, 5, 'Color Picker should have 5 children: xySlider, hueSlider, alphaSlider, segment and color preview');
    })

    it('Should change color with dragging the xy slider', async () => {
        const colorPickerElements = await elementChildren(await gf.get(`.${selectors.colorPicker}`));

        const assertionEl = await colorPickerElements.last().find('input');
        const xySliderHandle = (await elementChildren(await colorPickerElements.first())).last();

        await testColorPickerDrag('#FFB8B8FF', xySliderHandle, assertionEl, true);
    })

    it('Should change color with dragging the hue slider', async () => {
        const colorPickerElements = await elementChildren(await gf.get(`.${selectors.colorPicker}`));

        const assertionEl = await colorPickerElements.last().find('input');
        const hueSliderEl = await colorPickerElements.nth(1);
        const hueSliderTrackEl = (await elementChildren(hueSliderEl)).first();
        const hueSliderHandle = (await elementChildren(hueSliderTrackEl)).first();

        await testColorPickerDrag('#37FF00FF', hueSliderHandle, assertionEl);
    })

    it('Should change color with dragging the alpha slider', async () => {
        const colorPickerElements = await elementChildren(await gf.get(`.${selectors.colorPicker}`));

        const assertionEl = await colorPickerElements.last().find('input');
        const alphaSliderEl = await colorPickerElements.nth(2);
        const alphaSliderTrackEl = (await elementChildren(alphaSliderEl)).first();
        const alphaSliderHandleEl = (await elementChildren(alphaSliderTrackEl)).first();

        await testColorPickerDrag('#FF000080', alphaSliderHandleEl, assertionEl);
    })

    it('Should change alpha and check the color preview element', async () => {
        const colorPickerElements = await elementChildren(await gf.get(`.${selectors.colorPicker}`));

        const assertionEl = await colorPickerElements.last().find('input');
        const alphaSliderEl = await colorPickerElements.nth(2);
        const alphaSliderTrackEl = (await elementChildren(alphaSliderEl)).first();
        const alphaSliderHandleEl = (await elementChildren(alphaSliderTrackEl)).first();

        await testColorPickerDrag('#FF000080', alphaSliderHandleEl, assertionEl);

        const colorPreviewWrapperEl = await colorPickerElements.last();
        const colorPreviewEl = (await elementChildren(colorPreviewWrapperEl)).first();
        const colorPreviewBoxEl = (await elementChildren(colorPreviewEl)).first();
        const colorPreviewStyles = await colorPreviewBoxEl.styles();
        assert.equal(colorPreviewStyles['background-color'], 'rgba(255, 0, 0, 0.5)', 'Color preview element should have rgba(255, 0, 0, 0.5) as background color');
    })

    it('Should change color preview value to rgba instead of hex', async () => {
        const colorPickerElements = await elementChildren(await gf.get(`.${selectors.colorPicker}`));

        const assertionEl = await colorPickerElements.last().find('input');
        const segment = await colorPickerElements.nth(3);
        await ((await elementChildren(segment))[1]).click();

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