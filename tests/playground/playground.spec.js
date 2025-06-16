const assert = require('assert');

describe('Checkbox', function () {
    this.beforeAll(async () => {
        await gf.navigate('http://localhost:3000/playground/');
        await gf.click('.checkbox-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible('.test-checkbox-indicator'), false, "Checkbox should reset")
        })
    })

    it('Should render and it\'s slots correctly', async () => {
        const checkbox = await gf.get('.test-checkbox');
        const indicator = await gf.get('.test-checkbox-indicator');

        assert.ok(checkbox, 'Checkbox should be in the DOM');
        assert.ok(indicator, 'Checkbox indicator should be in the DOM');
        assert.equal(await checkbox.text(), 'Test Checkbox', 'Checkbox Label should be in the DOM');
    })

    it('Should toggle', async () => {
        const checkbox = await gf.get('.test-checkbox');
        const indicator = await gf.get('.test-checkbox-indicator');

        assert.equal(await indicator.isVisible(), false, 'Checkbox should be unchecked')
        
        await checkbox.click();
        assert.equal(await indicator.isVisible(), true, 'Checkbox should be checked')

        await checkbox.click();
        await gf.retryIfFails(async () => {
            assert.equal(await indicator.isVisible(), false, 'Checkbox should be unchecked after transition')
        })
    })

    it('Should test it\'s onChange prop', async () => {
        const checkbox = await gf.get('.test-checkbox');

        await checkbox.click();
        assert.equal(await gf.isVisible('.assertion-element'), true)

        await checkbox.click();
        assert.equal(await gf.isVisible('.assertion-element'), false)
    })

    it('Should test it\'s disabled state', async () => {
        const checkbox = await gf.get('.test-checkbox');

        await gf.click('.disable-btn');
        await checkbox.click();

        const checkboxStyles = await checkbox.styles();
        const isDisabled = (await gf.getClasses('.test-checkbox')).includes('disabled');

        assert.equal(await gf.isVisible('.test-checkbox-indicator'), false, "Disabled checkbox should not toggle")
        assert.equal(checkboxStyles.opacity, '0.5');
        assert.equal(isDisabled, true);
    })

    it('Should test it\'s class-checked prop', async () => {
        const checkbox = await gf.get('.test-checkbox');
        await checkbox.click();

        const checkboxStyles = await checkbox.styles();
        const isChecked = (await gf.getClasses('.test-checkbox')).includes('checked');

        assert.equal(checkboxStyles.color, 'rgba(0, 218, 154, 1)');
        assert.equal(isChecked, true);
    })

    it('Should test it\'s props reactivity', async () => {
        const checkbox = await gf.get('.test-checkbox');
        await checkbox.click();

        const checkboxStyles = await checkbox.styles();
        const isReactive = (await gf.getClasses('.test-checkbox')).includes('reactive');

        assert.equal(checkboxStyles['background-color'], 'rgba(255, 0, 0, 1)');
        assert.equal(isReactive, true);
    })

    it('Should test it\'s events', async () => {
        const checkbox = await gf.get('.test-checkbox');
        const position = await checkbox.getPositionOnScreen();

        await gf.moveMouse(position.x, position.y + 5);
        assert.equal(await gf.isVisible('.assertion-element'), true)
    })
});