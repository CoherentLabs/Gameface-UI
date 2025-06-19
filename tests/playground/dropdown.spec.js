const assert = require('assert');
const { retryIfFails } = require('gameface-e2e/core/utils');

describe('Dropdown', function () {
    this.beforeAll(async () => {
        await gf.navigate('http://localhost:3000/playground/');
        await gf.click('.dropdown-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const dropdown = await gf.get('.dropdown');
        const optionsContainer = await dropdown.find('.dropdown-options');
        const options = await optionsContainer.findAll('.dropdown-option');
        const trigger = await dropdown.find('.dropdown-trigger');
        const placeholder = await dropdown.find('.dropdown-placeholder');
        const icon = await dropdown.find('.dropdown-icon');

        assert.ok(dropdown, 'Dropdown should be in the DOM');
        assert.ok(optionsContainer, 'Dropdown options container should be found');
        assert.equal(options.length, 3, 'Three dropdown option components should be in the DOM');
        assert.ok(trigger, 'Dropdown trigger should be in the DOM');
        assert.ok(placeholder, 'Dropdown placeholder should be in the DOM');
        assert.ok(icon, 'Dropdown icon should be in the DOM');
    })
    
    it('Should change selected option', async () => {
        const dropdown = await gf.get('.dropdown');
        const trigger = await dropdown.find('.dropdown-trigger');
        
        await trigger.click();
        const options = await gf.get('.dropdown-options');
        assert.equal(await options.isVisible(), true, 'Dropdown options should open');
        
        await gf.click('.dropdown-option2')
        assert.equal(await (await trigger.children())[0].text(), 'test2', 'Trigger should hold the value of the selected option');
        assert.equal(await options.isVisible(), false, 'Dropdown options should close after selecting new option');
    })

    it('Should change selected option via ref', async () => {
        await gf.click('.scenario-0');        
        assert.equal(await (await gf.children(".dropdown-trigger"))[0].text(), 'test1', 'Trigger should hold the value of the selected option');
    })

    it('Should retrieve value via onChange prop', async () => {
        const assertionEl = await gf.get('.assertion-element');
        await gf.click('.scenario-0');  
        assert.equal(await assertionEl.text(), 'test1', 'Assertion element\'s text should match the value of the dropdown');
    })

    it('Should toggle', async () => {
        const trigger = await gf.get('.dropdown-trigger');
        const options = await gf.get('.dropdown-options');
        
        await trigger.click();
        assert.equal(await options.isVisible(), true, 'Dropdown options should open');

        await trigger.click();
        assert.equal(await options.isVisible(), false, 'Dropdown options should close');
    })

    it('Should close after clicking outside it', async () => {
        const trigger = await gf.get('.dropdown-trigger');
        const options = await gf.get('.dropdown-options');
        
        await trigger.click();
        assert.equal(await options.isVisible(), true, 'Dropdown options should open');

        await gf.click('body');
        assert.equal(await options.isVisible(), false, 'Dropdown options should close when click occurs elsewhere');
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const options = await gf.get('.dropdown-options');
        
        await gf.click('.scenario-1');
        await gf.click('.dropdown-trigger');

        assert.equal(await options.isVisible(), false, 'Dropdown options should not open when dropdown is disabled');
        assert.equal((await gf.getStyles('.dropdown'))['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: '.dropdown', desc: 'root' },
            { selector: '.dropdown-trigger', desc: 'trigger' },
            { selector: '.dropdown-options', desc: 'options container' },
            { selector: '.dropdown-option', desc: 'individual option' },
            { selector: '.dropdown-icon', desc: 'icon' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click('.scenario-0');
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
        await gf.click('.scenario-4');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Shound have custom selected class', async () => {
        const dropdown = await gf.get('.dropdown');
        const trigger = await dropdown.find('.dropdown-trigger');
        
        await trigger.click();
        const option = await gf.get('.dropdown-option2');
        await option.click();
        await trigger.click();
        
        const optionClasses = await option.classes();
        const optionStyles = await option.styles();

        assert.equal(optionClasses.includes('option-selected'), true, "Selected option should have the class 'option-selected'");
        assert.equal(optionStyles['background-color'], 'rgba(255, 0, 0, 1)', "Custom class should apply different styles");
    })

    it('Shound disable and have custom disabled class', async () => {
        const dropdown = await gf.get('.dropdown');
        const options = await gf.get('.dropdown-options');
        const trigger = await dropdown.find('.dropdown-trigger');
        
        await gf.click('.scenario-2');
        const option = await gf.get('.dropdown-option2');
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
        const icon = await gf.get('.dropdown-icon');
        assert.equal(await icon.text(), "", 'Default icon should be an empty string');
        
        await gf.click('.scenario-4')
        assert.equal(await icon.text(), "Custom Icon", 'New icon should have text - Custom Icon');
    })
});

describe('Dropdown track and handle', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    this.beforeEach(async () => {
        await gf.click('.scenario-3')
        await gf.click('.dropdown-trigger')
    })

    it('Should render when dropdown overflows', async () => {
        const track = await gf.get('.dropdown-track');
        const handle = await gf.get('.dropdown-handle');

        assert.equal(await track.isVisible(), true, 'Dropdown track should be visible when dropdown overflows');
        assert.equal(await handle.isVisible(), true, 'Dropdown handle should be visible when dropdown overflows');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: '.dropdown-track', desc: 'track' },
            { selector: '.dropdown-handle', desc: 'handle' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click('.scenario-0');
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});