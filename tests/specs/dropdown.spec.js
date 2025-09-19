const assert = require('assert');
const selectors = require("../shared/dropdown-selectors.json");
const { navigateToPage } = require('../shared/utils');

describe('Dropdown', function () {
    this.beforeAll(async () => {
        await navigateToPage('.dropdown-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const dropdown = await gf.get(`.${selectors.base}`);
        const optionsContainer = await dropdown.find(`.${selectors.options}`);
        const options = await optionsContainer.findAll(`.${selectors.option}`);
        const trigger = await dropdown.find(`.${selectors.trigger}`);
        const placeholder = await dropdown.find(`.${selectors.placeholder}`);
        const icon = await dropdown.find(`.${selectors.icon}`);

        assert.ok(dropdown, 'Dropdown should be in the DOM');
        assert.ok(optionsContainer, 'Dropdown options container should be found');
        assert.equal(options.length, 3, 'Three dropdown option components should be in the DOM');
        assert.ok(trigger, 'Dropdown trigger should be in the DOM');
        assert.ok(placeholder, 'Dropdown placeholder should be in the DOM');
        assert.ok(icon, 'Dropdown icon should be in the DOM');
    })

    it('Should change selected option', async () => {
        const dropdown = await gf.get(`.${selectors.base}`);
        const trigger = await dropdown.find(`.${selectors.trigger}`);

        await trigger.click();
        const options = await gf.get(`.${selectors.options}`);
        assert.equal(await options.isVisible(), true, 'Dropdown options should open');

        await gf.click(`.${selectors.option}2`)
        assert.equal(await (await trigger.children())[0].text(), 'test2', 'Trigger should hold the value of the selected option');
        assert.equal(await options.isVisible(), false, 'Dropdown options should close after selecting new option');
    })

    it('Should change selected option via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.equal(await (await gf.children(`.${selectors.trigger}`))[0].text(), 'test1', 'Trigger should hold the value of the selected option');
    })

    it('Should retrieve value via onChange prop', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.equal(await assertionEl.text(), 'test1', 'Assertion element\'s text should match the value of the dropdown');
    })

    it('Should toggle', async () => {
        const trigger = await gf.get(`.${selectors.trigger}`);
        const options = await gf.get(`.${selectors.options}`);

        await trigger.click();
        assert.equal(await options.isVisible(), true, 'Dropdown options should open');

        await trigger.click();
        assert.equal(await options.isVisible(), false, 'Dropdown options should close');
    })

    it('Should close after clicking outside it', async () => {
        const trigger = await gf.get(`.${selectors.trigger}`);
        const options = await gf.get(`.${selectors.options}`);

        await trigger.click();
        assert.equal(await options.isVisible(), true, 'Dropdown options should open');

        await gf.click('body');
        assert.equal(await options.isVisible(), false, 'Dropdown options should close when click occurs elsewhere');
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const options = await gf.get(`.${selectors.options}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        await gf.click(`.${selectors.trigger}`);

        assert.equal(await options.isVisible(), false, 'Dropdown options should not open when dropdown is disabled');
        assert.equal((await gf.getStyles(`.${selectors.base}`))['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.base}`, desc: 'root' },
            { selector: `.${selectors.trigger}`, desc: 'trigger' },
            { selector: `.${selectors.options}`, desc: 'options container' },
            { selector: `.${selectors.option}`, desc: 'individual option' },
            { selector: `.${selectors.icon}`, desc: 'icon' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});

describe('Dropdown options', function () {
    this.beforeEach(async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Shound have custom selected class', async () => {
        const dropdown = await gf.get(`.${selectors.base}`);
        const trigger = await dropdown.find(`.${selectors.trigger}`);

        await trigger.click();
        const option = await gf.get(`.${selectors.option}2`);
        await option.click();

        const optionClasses = await option.classes();
        const optionStyles = await option.styles();

        assert.equal(optionClasses.includes('option-selected'), true, "Selected option should have the class 'option-selected'");
        assert.equal(optionStyles['background-color'], 'rgba(255, 0, 0, 1)', "Custom class should apply different styles");
    })

    it('Shound disable and have custom disabled class', async () => {
        const dropdown = await gf.get(`.${selectors.base}`);
        const options = await gf.get(`.${selectors.options}`);
        const trigger = await dropdown.find(`.${selectors.trigger}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const option = await gf.get(`.${selectors.option}2`);
        await trigger.click();
        await option.click();

        const optionClasses = await option.classes();
        const optionStyles = await option.styles();

        assert.equal(await options.isVisible(), true, 'Dropdown options should remain opened');
        assert.equal(optionClasses.includes('option-disabled'), true, "Selected option should have the class 'option-disabled'");
        assert.equal(optionStyles['color'], 'rgba(255, 0, 0, 1)', "Custom class should apply different styles");
    })
});

describe('Dropdown icon', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Render custom icon', async () => {
        const icon = await gf.get(`.${selectors.icon}`);
        assert.equal(await icon.text(), "", 'Default icon should be an empty string');

        await gf.click(`.${selectors.scenarioBtn}.scenario-4`)
        assert.equal(await icon.text(), "Custom Icon", 'New icon should have text - Custom Icon');
    })
});

describe('Dropdown track and handle', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    this.beforeEach(async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`)
        await gf.click(`.${selectors.trigger}`)
    })

    it('Should render when dropdown overflows', async () => {
        const track = await gf.get(`.${selectors.track}`);
        const handle = await gf.get(`.${selectors.handle}`);

        assert.equal(await track.isVisible(), true, 'Dropdown track should be visible when dropdown overflows');
        assert.equal(await handle.isVisible(), true, 'Dropdown handle should be visible when dropdown overflows');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.track}`, desc: 'track' },
            { selector: `.${selectors.handle}`, desc: 'handle' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});