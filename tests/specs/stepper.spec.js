const assert = require('assert');

describe('Stepper', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.stepper-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const stepper = await gf.get('.stepper');
        const stepperControl = await stepper.findAll('.stepper-control');
        const stepperItems = await stepper.find('.stepper-items');
        const stepperItem = await stepperItems.find('.stepper-item');

        assert.ok(stepper, 'Stepper should be in the DOM');
        assert.equal(stepperControl.length, 2, 'Two stepper control components should be in the DOM');
        assert.ok(stepperItems, 'Stepper items should be in the DOM');
        assert.ok(stepperItem, 'Stepper item should be in the DOM');
    })
    
    it('Should change selected option', async () => {
        const stepperControl = await gf.getAll('.stepper-control');

        assert.equal(await gf.isVisible('.stepper-item0'), true, 'The first option should be selected initially');

        await stepperControl[1].click();
        await stepperControl[1].click();

        assert.equal(await gf.isVisible('.stepper-item2'), true, 'The last option should be selected');
    })

    it('Should change selected option via ref', async () => {
        assert.equal(await gf.isVisible('.stepper-item0'), true, 'The first option should be selected initially');

        await gf.click('.scenario-0');        
        assert.equal(await gf.isVisible('.stepper-item1'), true, 'The last option should be selected');
    })

    it('Should retrieve value via onChange prop', async () => {
        const assertionEl = await gf.get('.assertion-element');
        await gf.click('.scenario-0');  
        assert.equal(await assertionEl.text(), 'test1', 'Assertion element\'s text should match the value of the last stepper item');
    })

    it('Should enable loop and loop through options', async () => {
        const stepperControl = await gf.getAll('.stepper-control');
        const leftCotnrol = await stepperControl.first();

        await gf.click('.scenario-2');
        for (let i = 0; i < 3; i++) {
            await leftCotnrol.click();
        }

        assert.equal(await gf.isVisible('.stepper-item0'), true, 'The first option should be selected after looping three times');
    })

    it('Should cycle through control position options', async () => {
        await gf.click('.scenario-3');

        const children = await gf.children('.stepper');
        assert.equal((await children[0].classes()).includes('stepper-control'), true, 'First child should be stepper control');
        assert.equal((await children[1].classes()).includes('stepper-control'), true, 'Second child should be stepper control');
        
        await gf.click('.scenario-3');

        const updatedChildren = await gf.children('.stepper');
        const length = updatedChildren.length;
        assert.equal(
            (await updatedChildren[length - 1].classes()).includes('stepper-control'),
            true,
            'Last child should be stepper control after cycling control position'
        );
        assert.equal(
            (await updatedChildren[length - 2].classes()).includes('stepper-control'),
            true,
            'Second to last child should be stepper control after cycling control position'
        );
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const stepper = await gf.get('.stepper');

        await gf.click('.scenario-1');
        await (await gf.getAll('.stepper-control'))[1].click();

        assert.equal(await gf.isVisible('.stepper-item0'), true, 'The first option should still be selected');
        assert.equal((await stepper.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: '.stepper', desc: 'root' },
            { selector: '.stepper-control', desc: 'stepper control' },
            { selector: '.stepper-items', desc: 'stepper items' },
            { selector: '.stepper-item', desc: 'stepper item' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                const rightControl = await ( await gf.getAll('.stepper-control')).last();
                await rightControl.click();
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});

describe('Stepper Control', function () {
    this.beforeEach(async () => {
        await gf.click('.scenario-4');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render', async () => {
        const customControl = await gf.getAll(".stepper-custom-control");

        assert.ok(customControl, 'Custom control buttons should be in the DOM');
        assert.equal(customControl.length, 2, 'Two custom control buttons should be in the DOM');
    })

    it('Shound have custom hidden class', async () => {
        const rightControl = await ( await gf.getAll('.stepper-control')).last();
        await rightControl.click();

        for (let i = 0; i < 2; i++) {
            await rightControl.click();
        }
        
        const controlStyles = await rightControl.styles();
        const controlClasses = await rightControl.classes();

        assert.equal(controlClasses.includes('control-hidden'), true, "Control should have custom class when hidden");
        assert.equal(controlStyles['background-color'], 'rgba(255, 0, 0, 1)', "Custom class should apply different styles");
    })
});