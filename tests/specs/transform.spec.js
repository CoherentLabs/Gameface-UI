const assert = require('assert');
const selectors = require('../shared/transform-selectors.json');

const transformProperties = ['transform', 'transform', 'transform-origin']
describe('Transform', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.transform-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    transformProperties.forEach((property, index) => {
        it(`Should change ${property} property`, async () => {
            const transform = await gf.get(`.${selectors.transform}`);
            // compare inline styles
            const oldStyles = await transform.styles();
            await gf.click(`.${selectors.scenarioBtn}.scenario-${index}`)
            const newStyles = await transform.styles();

            assert.notEqual(oldStyles[property], newStyles[property], `New ${property} style should be applied`);
        });
    })
 
    it('Should update styles & classes reactively on props change', async () => {
        const transform = await gf.get(`.${selectors.transform}`);
        await transform.click();

        const styles = await transform.styles();
        const classes = await transform.classes();

        assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'background-color should update');
        assert.ok(classes.includes(selectors.reactive), 'reactive class applied');
    });
});