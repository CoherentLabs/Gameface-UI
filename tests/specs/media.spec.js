const assert = require('assert');
const selectors = require('../shared/media-selectors.json');
const { navigateToPage } = require('../shared/utils');

const normal = [selectors.image, selectors.liveView];
const withOptions = [selectors.backgroundImage, selectors.maskImage];

describe('Media component', function () {
    this.beforeAll(async () => {
        await navigateToPage('.media-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    normal.forEach((type) => {
        it(`Should change it\'s source - ${type}`, async () => {
            const image = await gf.get(`.${type}`);
            const source = await image.getAttribute('src');

            await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
            const newSource = await image.getAttribute('src');

            assert.notEqual(source, newSource, `${type} source should change`);
        });

        it(`Should fill its container - ${type}`, async () => {
            const image = await gf.get(`.${type}`);
            await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
            const {width, height} = await image.styles();
            assert.equal(width, '100%', `${type} width should be 100%`);
            assert.equal(height, '100%', `${type} height should be 100%`);
        });
    })

    withOptions.forEach((type) => {
        it(`Should change it\'s source - ${type}`, async () => {
            const image = await gf.get(`.${type}`);
            const styles = await image.styles();

            await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
            const newStyles = await image.styles();

            assert.notEqual(styles[type], newStyles[type], `${type} source should change`);
        });

        it(`Should change it\'s options - ${type}`, async () => {
            const image = await gf.get(`.${type}`);
            const classes = await image.classes();

            await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
            const newClasses = await image.classes();

            assert.notEqual(classes, newClasses, `${type} options should change`);
        });
    })

    normal.concat(withOptions).forEach((type) => {
        it(`Should update styles & classes reactively on props change - ${type}`, async () => {
            const el = await gf.get(`.${type}`);
            await el.click();

            const styles = await el.styles();
            const classes = await el.classes();

            assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'background-color should update');
            assert.ok(classes.includes(selectors.reactive), 'reactive class applied');
        });
    })

});