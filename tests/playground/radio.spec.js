const assert = require('assert');

describe('Radio', function () {
    this.beforeAll(async () => {
        await gf.navigate('http://localhost:3000/playground/');
        await gf.click('.radio-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const radio = await gf.get('.test-radio');
        const radioButtons = Array.from(await radio.children());

        assert.ok(radio, 'Checkbox should be in the DOM');
        assert.equal(radioButtons.length, 3, 'Radio buttons should be in the DOM');
    })
    
    it('Should change selected option', async () => {
        const radio = await gf.get('.test-radio');
        const radioButtons = await radio.children()

        assert.equal(await gf.isVisible('.test-indicator0'), true, 'The first option indicator should be visible initially');

        await radioButtons[2].click();
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible('.test-indicator0'), false, 'The first option indicator should be hidden after selecting the third option');
            assert.equal(await gf.isVisible('.test-indicator2'), true, 'The third option indicator should be visible after selection');
        })
    })

    it('Should change selected option via ref', async () => {
        assert.equal(await gf.isVisible('.test-indicator0'), true, 'The first option indicator should be visible initially');

        await gf.click('.scenario-0');        
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible('.test-indicator0'), false, 'The first option indicator should be hidden after selecting the third option');
            assert.equal(await gf.isVisible('.test-indicator2'), true, 'The third option indicator should be visible after selection');
        })
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const radio = await gf.get('.test-radio');

        await gf.click('.scenario-1');
        await (await radio.children())[1].click();

        assert.equal(await gf.isVisible('.test-indicator0'), true, 'The first option indicator should be visible initially');
        assert.equal((await radio.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    it('Should update styles and classes reactively when props change', async () => {
        const radio = await gf.get('.test-radio');
        await (await radio.children())[1].click();

        const radioStyles = await radio.styles();
        const isReactive = (await radio.classes()).includes('reactive');

        assert.equal(radioStyles['background-color'], 'rgba(0, 128, 0, 1)', "Styles should change dynamically");
        assert.equal(isReactive, true);
    })
});

describe('Radio Button', function () {
    this.beforeAll(async () => {
        await gf.navigate('http://localhost:3000/playground/');
        await gf.click('.radio-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const radioButton = await gf.get('.test-button1');

        await gf.click('.scenario-2');
        await radioButton.click();

        assert.equal(await gf.isVisible('.test-indicator0'), true, 'The first option indicator should be visible initially');
        assert.equal((await radioButton.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    it('Should update styles and classes reactively when props change', async () => {
        const radioButton = await gf.get('.test-button1');
        await radioButton.click();

        const radioBtnStyles = await radioButton.styles();
        const isReactive = (await radioButton.classes()).includes('reactive');

        assert.equal(radioBtnStyles['background-color'], 'rgba(0, 0, 255, 1)', "Styles should change dynamically");
        assert.equal(isReactive, true);
    })

    it('Should update styles and classes reactively when props change - Control slot', async () => {
        const radioControl = await gf.get('.test-control1');
        await gf.click('.test-button1');

        const radioControlStyles = await radioControl.styles();
        const isReactive = (await radioControl.classes()).includes('reactive');

        assert.equal(radioControlStyles['background-color'], 'rgba(0, 0, 255, 1)', "Styles should change dynamically");
        assert.equal(isReactive, true);
    })

    it('Should update styles and classes reactively when props change - Indicator slot', async () => {
        const radioIndicator = await gf.get('.test-indicator1');
        await gf.click('.test-button1');

        const radioIndicatorStyle = await radioIndicator.styles();
        const isReactive = (await radioIndicator.classes()).includes('reactive');

        assert.equal(radioIndicatorStyle['background-color'], 'rgba(0, 0, 255, 1)', "Styles should change dynamically");
        assert.equal(isReactive, true);
    })

    it('Should render label before control', async () => {
        const radioButton = await gf.get('.test-button0');
        const children = await radioButton.children();

        assert.equal(children[0].node.nodeType, 3, 'The first child should be a text node');
    })
});