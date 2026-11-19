const assert = require('assert');
const selectors = require("../shared/checkbox-selectors.json");
const { navigateToPage, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

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

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('checkbox', [], 'No onChange for the initial value');
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

        await gf.mouseMove(position.x, position.y + 5);
        assert.equal(await gf.isVisible(`.${selectors.assertionElement}`), true)
    })

    describe('onChange calls', () => {
        it('Should call onChange once per click', async () => {
            const checkbox = await gf.get(`.${selectors.base}`);
            await checkbox.click();
            await expectOnChangeCalls('checkbox', [true], 'One call after the first click (1.x called it twice)');
            await checkbox.click();
            await expectOnChangeCalls('checkbox', [true, false], 'One more call after the second click');
        });

        it('Should call onChange synchronously from the ref setter', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
            assert.deepEqual(await onChangeSyncCalls('checkbox'), [true], 'onChange fired before setChecked returned');
            await expectOnChangeCalls('checkbox', [true], 'No late duplicate');
        });

        it('Should support the updater form of the ref setter', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
            assert.deepEqual(await onChangeSyncCalls('checkbox'), [true], 'setChecked(prev => !prev) reported the new value');
        });

        it('Should not call onChange when setting the same value', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
            assert.deepEqual(await onChangeSyncCalls('checkbox'), [], 'setChecked(false) on an unchecked checkbox');
            await expectOnChangeCalls('checkbox', [], 'No call at all');
        });

        it('Should not call onChange when disabled', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
            await (await gf.get(`.${selectors.base}`)).click();
            await expectOnChangeCalls('checkbox', [], 'A click on a disabled checkbox');
        });
    });
});