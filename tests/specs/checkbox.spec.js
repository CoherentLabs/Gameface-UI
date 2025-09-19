const assert = require('assert');
const selectors = require("../shared/checkbox-selectors.json");
const { navigateToPage } = require('../shared/utils');

describe('Checkbox', function () {
    this.beforeAll(async () => {
        await navigateToPage('.checkbox-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible(`.${selectors.indicator}`), false, "Checkbox should reset")
        })
    })

    it('Should render itself and it\'s slots correctly', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);
        const indicator = await gf.get(`.${selectors.indicator}`);

        assert.ok(checkbox, 'Checkbox should be in the DOM');
        assert.ok(indicator, 'Checkbox indicator should be in the DOM');
        assert.equal(await checkbox.text(), 'Test Checkbox', 'Checkbox Label should be in the DOM');
    })

    it('Should toggle', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);
        const indicator = await gf.get(`.${selectors.indicator}`);

        assert.equal(await indicator.isVisible(), false, 'Checkbox should be unchecked')

        await checkbox.click();
        assert.equal(await indicator.isVisible(), true, 'Checkbox should be checked')

        await checkbox.click();
        await gf.retryIfFails(async () => {
            assert.equal(await indicator.isVisible(), false, 'Checkbox should be unchecked after transition')
        })
    })

    it('Should test it\'s onChange prop', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);

        await checkbox.click();
        assert.equal(await gf.isVisible(`.${selectors.assertionElement}`), true)

        await checkbox.click();
        assert.equal(await gf.isVisible(`.${selectors.assertionElement}`), false)
    })

    it('Should test it\'s disabled state', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await checkbox.click();

        const checkboxStyles = await checkbox.styles();
        const isDisabled = (await gf.getClasses(`.${selectors.base}`)).includes('disabled');

        assert.equal(await gf.isVisible(`.${selectors.indicator}`), false, "Disabled checkbox should not toggle")
        assert.equal(checkboxStyles.opacity, '0.5');
        assert.equal(isDisabled, true);
    })

    it('Should test it\'s class-checked prop', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);
        await checkbox.click();

        const checkboxStyles = await checkbox.styles();
        const isChecked = (await gf.getClasses(`.${selectors.base}`)).includes('checked');

        assert.equal(checkboxStyles.color, 'rgba(0, 218, 154, 1)');
        assert.equal(isChecked, true);
    })

    it('Should test it\'s props reactivity', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);
        await checkbox.click();

        const checkboxStyles = await checkbox.styles();
        const isReactive = (await gf.getClasses(`.${selectors.base}`)).includes('reactive');

        assert.equal(checkboxStyles['background-color'], 'rgba(255, 0, 0, 1)');
        assert.equal(isReactive, true);
    })

    it('Should test it\'s events', async () => {
        const checkbox = await gf.get(`.${selectors.base}`);
        const position = await checkbox.getPositionOnScreen();

        await gf.moveMouse(position.x, position.y + 5);
        assert.equal(await gf.isVisible(`.${selectors.assertionElement}`), true)
    })
});