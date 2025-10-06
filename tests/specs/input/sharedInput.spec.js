const assert = require('assert');
const selectors = require('../../shared/input-selectors.json');
const { navigateToPage } = require('../../shared/utils');
const newValue = '100';

describe('Input components', function () {
    ['text', 'password', 'number'].forEach((type) => {
        describe(`${type.charAt(0).toUpperCase()}${type.slice(1)}Input`, function () {
            this.beforeAll(async () => {
                await navigateToPage(`.${type}-input-link`);
            })

            this.afterEach(async () => {
                await gf.trigger('reset');
            })

            it('Should change value', async () => {
                const input = await gf.get(`.${selectors.input}`);
                const assertEl = await gf.get(`.${selectors.assertionElement}`)

                await input.type(newValue);
                assert.equal(await assertEl.text(), newValue, "Input's value should have changed")
            })

            it('Should change value via ref', async () => {
                const assertEl = await gf.get(`.${selectors.assertionElement}`)
                await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

                assert.equal(await assertEl.text(), newValue, "Input's value should have changed")
            })

            if (type !== 'number') {
                it('Should not exceed max symbols', async () => {
                    const input = await gf.get(`.${selectors.input}`);
                    const assertEl = await gf.get(`.${selectors.assertionElement}`)
                    await input.type('123456789');

                    assert.equal(await assertEl.text(), '12345', "Input's value should not exceed 5 symbols")
                })
            }

            it('Should not change it\'s value if its read only', async () => {
                const input = await gf.get(`.${selectors.input}`);
                const assertEl = await gf.get(`.${selectors.assertionElement}`)

                await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
                await input.type(newValue);

                assert.equal(await assertEl.text(), '', "Input's value should not change")
            })

            it('Should toggle disabled state and prevent typing', async () => {
                const root = await gf.get(`.${selectors.root}`);
                const input = await gf.get(`.${selectors.input}`);
                const assertEl = await gf.get(`.${selectors.assertionElement}`)

                await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
                await input.type(newValue);

                assert.equal(await assertEl.text(), '', "Input's value shouldn't have changed")
                assert.equal((await root.styles())['background-color'], 'rgba(255, 0, 0, 1)', 'Disabled class should be toggled');
            })
        });
    })
})