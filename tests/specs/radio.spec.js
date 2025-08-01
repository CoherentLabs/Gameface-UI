const assert = require('assert');
const selectors = require('../shared/radio-selectors.json');

describe('Radio', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.radio-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const radio = await gf.get(`.${selectors.radio}`);
        const radioButtons = Array.from(await radio.children());

        assert.ok(radio, 'Radio should be in the DOM');
        assert.equal(radioButtons.length, 3, 'Radio buttons should be in the DOM');
    })
    
    it('Should change selected option', async () => {
        const radio = await gf.get(`.${selectors.radio}`);
        const radioButtons = await radio.children()

        assert.equal(await gf.isVisible(`.${selectors.radioIndicator}0`), true, 'The first option indicator should be visible initially');

        await radioButtons[2].click();
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible(`.${selectors.radioIndicator}0`), false, 'The first option indicator should be hidden after selecting the third option');
            assert.equal(await gf.isVisible(`.${selectors.radioIndicator}2`), true, 'The third option indicator should be visible after selection');
        })
    })

    it('Should change selected option via ref', async () => {
        assert.equal(await gf.isVisible(`.${selectors.radioIndicator}0`), true, 'The first option indicator should be visible initially');

        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);        
        await gf.retryIfFails(async () => {
            assert.equal(await gf.isVisible(`.${selectors.radioIndicator}0`), false, 'The first option indicator should be hidden after selecting the third option');
            assert.equal(await gf.isVisible(`.${selectors.radioIndicator}2`), true, 'The third option indicator should be visible after selection');
        })
    })

    it('Should toggle disabled state and prevent selection', async () => {
        const radio = await gf.get(`.${selectors.radio}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        await (await radio.children())[1].click();

        assert.equal(await gf.isVisible(`.${selectors.radioIndicator}0`), true, 'The first option indicator should be visible initially');
        assert.equal((await radio.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.radio}`, desc: 'root' },
            { selector: `.${selectors.radioButton}1`, desc: 'radio button' },
            { selector: `.${selectors.radioControl}1`, desc: 'radio control' },
            { selector: `.${selectors.radioIndicator}1`, desc: 'radio indicator' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.radioButton}1`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
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
        const radioButton = await gf.get(`.${selectors.radioButton}1`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await radioButton.click();

        assert.equal(await gf.isVisible(`.${selectors.radioIndicator}0`), true, 'The first option indicator should be visible initially');
        assert.equal((await radioButton.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
    })

    it('Should render label before control', async () => {
        const radioButton = await gf.get(`.${selectors.radioButton}0`);
        const children = await radioButton.children();

        assert.equal(children[0].node.nodeType, 3, 'The first child should be a text node');
    })
});