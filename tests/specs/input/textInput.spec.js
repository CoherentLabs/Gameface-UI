const assert = require('assert');
const selectors = require('../../shared/input-selectors.json');
const { navigateToPage, onChangeCalls, onChangeSyncCalls, expectOnChangeCalls } = require('../../shared/utils');

describe('TextInput', function () {
    this.beforeAll(async () => {
        await navigateToPage('.text-input-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('text-input', [], 'No onChange for the initial value');
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

    it('Should debounce onChange when delay prop is set', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
        const input = await gf.get(`.${selectors.input}`);
        const assertEl = await gf.get(`.${selectors.assertionElement}`);

        await input.type('test');
        assert.equal(await assertEl.text(), '', 'onChange should not fire immediately when delay is set');

        await new Promise(resolve => setTimeout(resolve, 400));
        assert.equal(await assertEl.text(), 'test', 'onChange should fire after the delay expires');
    })

    it('Should update the input when the value prop changes', async () => {
        const getPlaceholder = async () => {
            try {
                return await gf.get(`.${selectors.inputPlaceholder}`);
            } catch {
                return null;
            }
        };

        assert.ok(await getPlaceholder(), 'Placeholder should be visible initially');
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        assert.ok(!(await getPlaceholder()), 'Placeholder should be hidden after the value prop changes');
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
describe('TextInput onChange calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should call onChange once per typed character', async () => {
        await (await gf.get(`.${selectors.input}`)).type('ab');
        await expectOnChangeCalls('text-input', ['a', 'ab'], 'One call per keystroke');
    })

    it('Should call onChange synchronously from the ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.deepEqual(await onChangeSyncCalls('text-input'), ['100'], 'onChange fired before changeValue returned');
        await expectOnChangeCalls('text-input', ['100'], 'No late duplicate');
    })

    it('Should call onChange once after the delay when debounced', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
        await (await gf.get(`.${selectors.input}`)).type('test');
        await new Promise((resolve) => setTimeout(resolve, 400));
        await expectOnChangeCalls('text-input', ['test'], 'One debounced call with the final value');
    })

    // Behavior as on master: a change through the `value` prop is not reported (TASKS 13 may change this).
    it('Should not call onChange when the value prop changes', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        await expectOnChangeCalls('text-input', [], 'value prop "hello"');
    })
});
