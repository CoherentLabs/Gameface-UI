const assert = require('assert');
const selectors = require('../../shared/input-selectors.json');

describe('NumberInput', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.number-input-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const input = await gf.get(`.${selectors.root}`);
        const increaseControl = await gf.get(`.${selectors.inputIncreaseControl}`);
        const decreaseControl = await gf.get(`.${selectors.inputDecreaseControl}`);
        const inputElement = await gf.get(`.${selectors.input}`)
        const placeholder = await gf.get(`.${selectors.inputPlaceholder}`)

        assert.ok(input, 'Input root should be in the DOM');
        assert.ok(increaseControl, 'Before slot should be in the DOM');
        assert.ok(decreaseControl, 'After slot should be in the DOM');
        assert.ok(inputElement, 'Input element should be in the DOM');
        assert.ok(placeholder, 'Placeholder should be in the DOM');
    })
    
    it('Should hide placeholder after typing', async () => {
        const input = await gf.get(`.${selectors.input}`);

        const getPlaceholder = async () => {
            try {
                return await gf.get(`.${selectors.inputPlaceholder}`);
            } catch {
                return null;
            }
        };

        assert.ok(await getPlaceholder(), 'Placeholder should be in the DOM');
        await input.type('50');
        assert.ok(!(await getPlaceholder()), 'Placeholder should not be in the DOM after typing in the input');
    })

    it('Should increase and decrease the input value', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);
        const increaseControl = await gf.get(`.${selectors.inputIncreaseControl}`);
        const decreaseControl = await gf.get(`.${selectors.inputDecreaseControl}`);

        await input.type('50');
        
        await increaseControl.click();
        assert.equal(await assertionElement.text(), '60', 'Input\'s value should increase by 10');
        
        await decreaseControl.click();
        assert.equal(await assertionElement.text(), '50', 'Input\'s value should decrease by 10');
    })

    it('Should increase and decrease the input value via ref', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);
        
        await input.type('50');

        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);     
        assert.equal(await assertionElement.text(), '60', 'Input\'s value should increase by 10');

        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);     
        assert.equal(await assertionElement.text(), '50', 'Input\'s value should decrease by 10');
    })

     it('Should render custom increase button control', async () => {
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);
        const increaseControl = await gf.get(`.${selectors.inputIncreaseControl}`);
        assert.equal(await (await increaseControl.children()).first().node.nodeName, "SVG", 'Default icon should be of type SVG');
        
        await gf.click(`.${selectors.scenarioBtn}.scenario-6`)
        assert.equal(await increaseControl.text(), "Custom icon", 'New icon should have text - Custom Icon');

        await increaseControl.click();
        assert.equal(await assertionElement.text(), '10', 'Input\'s value should increase by 10');
    })

    it('Should not allow typing letters', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);

        await input.type('test');
        assert.equal(await assertionElement.text(), '', 'Input\'s value should remain empty');
    })

    it('Should not allow values below the set min', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);

        await input.type('-1000');
        assert.equal(await assertionElement.text(), '-100', 'Input\'s value should be equal to the specified min value');
    })

    it('Should not allow values above the set max', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);

        await input.type('1000');
        assert.equal(await assertionElement.text(), '100', 'Input\'s value should be equal to the specified max value');
    })

    it('Should support decimal values', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);

        await input.type('0.5');
        assert.equal(await assertionElement.text(), '0.5', 'Input\'s value should be a decimal value');

        await input.clear();

        await input.type('0.5');
        assert.equal(await assertionElement.text(), '0.5', 'Input\'s value should be a decimal value');
    })

    it('Should support correct decimal values', async () => {
        const input = await gf.get(`.${selectors.input}`);
        const assertionElement = await gf.get(`.${selectors.assertionElement}`);

        await input.type('-0.55.5');
        assert.equal(await assertionElement.text(), '-0.555', 'Input\'s value should be a decimal value');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.root}`, desc: 'root' },
            { selector: `.${selectors.inputIncreaseControl}`, desc: 'input increase control' },
            { selector: `.${selectors.inputDecreaseControl}`, desc: 'input decrease control' },
            { selector: `.${selectors.input}`, desc: 'input element' },
            { selector: `.${selectors.inputPlaceholder}`, desc: 'input placeholder' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});