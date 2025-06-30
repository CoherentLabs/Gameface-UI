const assert = require('assert');
const selectors = require('../shared/button-selectors.json');

describe('Button', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.button-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render', async () => {
        assert.ok(await gf.get(`.${selectors.button}`))
    })

    it('Should disable', async () => {
        const button = await gf.get(`.${selectors.button}`);
        const assertEl = await gf.get(`.${selectors.assertionElement}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await button.click();

        assert.equal(await assertEl.text(), 'red', 'Initial value should remain unchanged after clicking disabled button');
    })

    it('Should change size', async () => {
        const button = await gf.get(`.${selectors.button}`);
        const initialSize = await button.getSize();
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        await gf.retryIfFails(async () => {
            let newSize = await button.getSize();
            assert.notEqual(initialSize.width, newSize.width, "Width should not be equal")
            assert.notEqual(initialSize.height, newSize.height, "Height should not be equal")
        })
    })

    it(`should update styles & classes reactively on props change`, async () => {
        const button = await gf.get(`.${selectors.button}`);
        await button.click();

        const styles = await button.styles();
        const classes = await button.classes();

        assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
        assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
    });
});