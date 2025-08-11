const assert = require('assert');
const selectors = require('../shared/toggle-button-selectors.json');

describe('ToggleButton', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.toggle-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render itself correctly', async () => {
        const toggle = await gf.get(`.${selectors.base}`);
        const control = await toggle.find(`.${selectors.control}`);
        const indicator = await control.find(`.${selectors.indicator}`);
        const handle = await control.find(`.${selectors.handle}`);

        assert.ok(toggle, 'ToggleButton should be in the DOM');
        assert.equal(await (await toggle.children())[0].text(), 'Off', '\"off\" should be first child of toggleButton');
        assert.equal(await (await toggle.children())[2].text(), 'On', '\"on\" should be last child of toggleButton');
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