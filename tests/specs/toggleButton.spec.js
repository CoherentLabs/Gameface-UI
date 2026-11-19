const assert = require('assert');
const selectors = require('../shared/toggle-button-selectors.json');
const { navigateToPage, elementChildren, childNodesInfo, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

describe('ToggleButton', function () {
    this.beforeAll(async () => {
        await navigateToPage('.toggle-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('toggle-button', [], 'No onChange for the initial value');
        await expectOnChangeCalls('toggle-button-controlled', [], 'No onChange for the initial value (controlled)');
    });

    describe('onChange calls', () => {
        it('Should call onChange once per click', async () => {
            const toggle = await gf.get(`.${selectors.base}`);
            await toggle.click();
            await expectOnChangeCalls('toggle-button', [true], 'One call after the first click');
            await toggle.click();
            await expectOnChangeCalls('toggle-button', [true, false], 'One more call after the second click');
        });

        it('Should call onChange synchronously from the ref setter', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
            assert.deepEqual(await onChangeSyncCalls('toggle-button'), [true], 'onChange fired before setChecked returned');
            await expectOnChangeCalls('toggle-button', [true], 'No late duplicate');
        });

        it('Should support the updater form of the ref setter', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
            assert.deepEqual(await onChangeSyncCalls('toggle-button'), [true], 'setChecked(prev => !prev) reported the new value');
        });

        it('Should not call onChange when setting the same value', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
            assert.deepEqual(await onChangeSyncCalls('toggle-button'), [], 'setChecked(false) on an unchecked toggle');
            await expectOnChangeCalls('toggle-button', [], 'No call at all');
        });

        it('Should not call onChange when disabled', async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
            await (await gf.get(`.${selectors.base}`)).click();
            await expectOnChangeCalls('toggle-button', [], 'A click on a disabled toggle');
        });

        it('Should call onChange once per click when controlled', async () => {
            const toggle = await gf.get(`.${selectors.controlled}`);
            await toggle.click();
            await expectOnChangeCalls('toggle-button-controlled', [true], 'The echo through the checked prop is not reported');
            await toggle.click();
            await expectOnChangeCalls('toggle-button-controlled', [true, false], 'One more call after the second click');
        });
    });

    it('Should render itself correctly', async () => {
        const toggle = await gf.get(`.${selectors.base}`);
        const control = await toggle.find(`.${selectors.control}`);
        const indicator = await control.find(`.${selectors.indicator}`);
        const handle = await control.find(`.${selectors.handle}`);

        assert.ok(toggle, 'ToggleButton should be in the DOM');
        const childNodes = await childNodesInfo(toggle);
        assert.equal(childNodes[0].text, 'Off', '\"off\" should be first child of toggleButton');
        assert.equal(childNodes[childNodes.length - 1].text, 'On', '\"on\" should be last child of toggleButton');
        assert.ok(control, 'ToggleButton control should be in the DOM');
        assert.ok(indicator, 'ToggleButton indicator should be in the DOM');
        assert.ok(handle, 'ToggleButton handle should be in the DOM');
    });

    it('Should toggle checked state', async () => {
        const toggle = await gf.get(`.${selectors.base}`);
        const indicator = await toggle.find(`.${selectors.indicator}`);

        assert.equal(await indicator.isVisible(), false, 'Indicator should be hidden initially');
        await toggle.click();
        assert.equal(await indicator.isVisible(), true, 'Indicator should be visible after click');
        await toggle.click();
        await gf.retryIfFails(async () => {
            assert.equal(await indicator.isVisible(), false, 'Indicator should be hidden after second click');
        })
    });

    it('Should retrieve checked state via onChange prop', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.equal(await assertionEl.text(), 'true', 'Assertion element\'s text should be set to true');
    })

    it('Should apply checked styles', async () => {
        const toggle = await gf.get(`.${selectors.base}`);
        const handle = await toggle.find(`.${selectors.handle}`);

        await toggle.click();
        const toggleClasses = await toggle.classes();
        const handleClasses = await handle.classes();
        const handleStyles = await handle.styles();

        assert.ok(toggleClasses.includes(selectors['base-checked']), 'Checked class should be applied');
        assert.ok(handleClasses.includes(selectors['handle-checked']), 'Handle checked class should be applied');
        assert.equal(handleStyles['border-top-color'], 'rgba(255, 255, 255, 1)', 'Handle checked class should be applied');
    });

    it('Should check programmatically', async () => {
        const indicator = await gf.get(`.${selectors.indicator}`);
        await gf.retryIfFails(async () => {
            assert.equal(await indicator.isVisible(), false, 'Indicator should be hidden initially');
        })
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await gf.retryIfFails(async () => {
            assert.equal(await indicator.isVisible(), true, 'Indicator should be visible after programmatic check');
        })
    });

    it('Should disable toggle button', async () => {
        const toggle = await gf.get(`.${selectors.base}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        await toggle.click();

        const toggleClasses = await toggle.classes();
        assert.ok(toggleClasses.includes(selectors['base-disabled']), 'Disabled class should be applied');
        assert.equal(await gf.isVisible(`.${selectors.indicator}`), false, 'Indicator should not be visible after clicking disabled toggle');
    });

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.base}`, desc: 'root' },
            { selector: `.${selectors.control}`, desc: 'control' },
            { selector: `.${selectors.indicator}`, desc: 'indicator' },
            { selector: `.${selectors.handle}`, desc: 'handle' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();

                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
                if (selector === `.${selectors.handle}`) {
                    await gf.retryIfFails(async () => {
                        assert.equal((await el.styles())['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                    });
                    return;
                }
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
            });
        };
    });
});