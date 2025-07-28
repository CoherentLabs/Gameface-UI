const assert = require('assert');
const selectors = require('../../shared/input-selectors.json');

describe('PasswordInput', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.password-input-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const input = await gf.get(`.${selectors.root}`);
        const before = await gf.get(`.${selectors.inputBefore}`);
        const inputElement = await gf.get(`.${selectors.input}`)
        const visibilityButton = await gf.get(`.${selectors.inputVisibilityButton}`)

        assert.ok(input, 'Input root should be in the DOM');
        assert.ok(before, 'Before slot should be in the DOM');
        assert.ok(inputElement, 'Input element should be in the DOM');
        assert.ok(visibilityButton, 'Visibility button should be in the DOM');
    })

    it('Should toggle password visibility', async () => {
        const input = await gf.get(`.${selectors.input}`)
        const visibilityButton = await gf.get(`.${selectors.inputVisibilityButton}`)

        await input.type('test');
        await visibilityButton.click();
        
        assert.equal(await input.getAttribute('type'), 'text', 'Input\'s type should change to text')
        await visibilityButton.click();
        assert.equal(await input.getAttribute('type'), 'password', 'Input\'s type should change to password')
    })

    it('Should toggle password visibility via ref', async () => {
        const input = await gf.get(`.${selectors.input}`)
        await input.type('test');

        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);     
        assert.equal(await input.getAttribute('type'), 'text', 'Input\'s type should change to text')

        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);     
        assert.equal(await input.getAttribute('type'), 'password', 'Input\'s type should change to password')
    })

    it('Should change visibility button\'s position', async () => {
        const elementExists = async (selector) => {
            try {
                return await gf.get(`.${selector}`);
            } catch {
                return null;
            }
        };

        const childrenBeforeSwap = await (await gf.get(`.${selectors.root}`)).children();
        assert.ok(!(await elementExists(selectors.inputAfter)), 'After element should not be in the DOM');
        assert.equal((await childrenBeforeSwap[0].classes()).includes(selectors.inputBefore), true, 'First element of root should be the Before element')
        assert.equal((await childrenBeforeSwap[2].classes()).includes(selectors.inputVisibilityButton), true, 'Last element of root should be the Visibility button element')

        await gf.click(`.${selectors.scenarioBtn}.scenario-6`);   

        const childrenAfterSwap = await (await gf.get(`.${selectors.root}`)).children();
        assert.ok(!(await elementExists(selectors.inputBefore)), 'Before element should not be in the DOM');
        assert.equal((await childrenAfterSwap[0].classes()).includes(selectors.inputVisibilityButton), true, 'First element of root should be the Visibility button element')
        assert.equal((await childrenAfterSwap[2].classes()).includes(selectors.inputAfter), true, 'Last element of root should be the After element')
    }) 

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.root}`, desc: 'root' },
            { selector: `.${selectors.inputBefore}`, desc: 'input before' },
            { selector: `.${selectors.input}`, desc: 'input element' },
            { selector: `.${selectors.inputVisibilityButton}`, desc: 'input visibility button' },
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