const assert = require('assert');

describe('Radio', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.radio-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const radio = await gf.get('.radio');
        const radioButtons = Array.from(await radio.children());

        assert.ok(radio, 'Checkbox should be in the DOM');
        assert.equal(radioButtons.length, 3, 'Radio buttons should be in the DOM');
    })
    
    it('Should change selected option', async () => {
        const radio = await gf.get('.radio');
        const radioButtons = await radio.children()

        assert.equal(await gf.isVisible('.radio-indicator0'), true, 'The first option indicator should be visible initially');

        await radioButtons[2].click();
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible('.radio-indicator0'), false, 'The first option indicator should be hidden after selecting the third option');
            assert.equal(await gf.isVisible('.radio-indicator2'), true, 'The third option indicator should be visible after selection');
        })
    })

    it('Should change selected option via ref', async () => {
        assert.equal(await gf.isVisible('.radio-indicator0'), true, 'The first option indicator should be visible initially');

        await gf.click('.scenario-0');        
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible('.radio-indicator0'), false, 'The first option indicator should be hidden after selecting the third option');
            assert.equal(await gf.isVisible('.radio-indicator2'), true, 'The third option indicator should be visible after selection');
        })
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const radio = await gf.get('.radio');

        await gf.click('.scenario-1');
        await (await radio.children())[1].click();

        assert.equal(await gf.isVisible('.radio-indicator0'), true, 'The first option indicator should be visible initially');
        assert.equal((await radio.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: '.radio', desc: 'root' },
            { selector: '.radio-button1', desc: 'radio button' },
            { selector: '.radio-control1', desc: 'radio control' },
            { selector: '.radio-indicator1', desc: 'radio indicator' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click('.radio-button1');
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});

describe('Radio Button', function () {
    this.beforeAll(async () => {
        await gf.navigate('http://localhost:3000/components-e2e/');
        await gf.click('.radio-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const radioButton = await gf.get('.radio-button1');

        await gf.click('.scenario-2');
        await radioButton.click();

        assert.equal(await gf.isVisible('.radio-indicator0'), true, 'The first option indicator should be visible initially');
        assert.equal((await radioButton.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    it('Should render label before control', async () => {
        const radioButton = await gf.get('.radio-button0');
        const children = await radioButton.children();

        assert.equal(children[0].node.nodeType, 3, 'The first child should be a text node');
    })
});