const assert = require('assert');
const selectors = require('../../shared/input-selectors.json');

describe('TextInput', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.text-input-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const input = await gf.get(`.${selectors.root}`);
        const before = await gf.get(`.${selectors.inputBefore}`);
        const after = await gf.get(`.${selectors.inputAfter}`);
        const inputElement = await gf.get(`.${selectors.input}`)
        const placeholder = await gf.get(`.${selectors.inputPlaceholder}`)

        assert.ok(input, 'Input root should be in the DOM');
        assert.ok(before, 'Before slot should be in the DOM');
        assert.ok(after, 'After slot should be in the DOM');
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
        await input.type('test');
        assert.ok(!(await getPlaceholder()), 'Placeholder should not be in the DOM after typing in the input');
    }) 

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.root}`, desc: 'root' },
            { selector: `.${selectors.inputBefore}`, desc: 'input before' },
            { selector: `.${selectors.inputAfter}`, desc: 'input after' },
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