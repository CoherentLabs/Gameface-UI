const assert = require('assert');
const selectors = require('../shared/media-selectors.json');
const { navigateToPage } = require('../shared/utils');

/** Components that render an `<img>` and carry the source on the `src` attribute. */
const imgBased = [selectors.liveView];

/** Components that render a `div` and carry the source in a CSS property. */
const cssBased = [
    { type: selectors.image, property: 'background-image' },
    { type: selectors.imageOptions, property: 'background-image' },
    { type: selectors.maskImage, property: 'mask-image' },
];

const allTypes = imgBased.concat(cssBased.map((c) => c.type));

/** Components that take `options`, so their classes change with them. */
const withOptions = [selectors.imageOptions, selectors.maskImage];

describe('Media components', function () {
    this.beforeAll(async () => {
        await navigateToPage('.media-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    imgBased.forEach((type) => {
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

    cssBased.forEach(({ type, property }) => {
        it(`Should change it\'s source - ${type}`, async () => {
            const image = await gf.get(`.${type}`);
            const styles = await image.styles();

            await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
            const newStyles = await image.styles();

            assert.notEqual(styles[property], newStyles[property], `${type} source should change`);
        });
    })

    it(`Should fill its container - ${selectors.image}`, async () => {
        const image = await gf.get(`.${selectors.image}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const {width, height} = await image.styles();
        assert.equal(width, '100%', `${selectors.image} width should be 100%`);
        assert.equal(height, '100%', `${selectors.image} height should be 100%`);
    });

    withOptions.forEach((type) => {
        it(`Should change it\'s options - ${type}`, async () => {
            const image = await gf.get(`.${type}`);
            const classes = await image.classes();

            await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
            const newClasses = await image.classes();

            assert.notEqual(classes, newClasses, `${type} options should change`);
        });
    })

    allTypes.forEach((type) => {
        it(`Should update styles & classes reactively on props change - ${type}`, async () => {
            const el = await gf.get(`.${type}`);
            await el.click();

            const styles = await el.styles();
            const classes = await el.classes();

            assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'background-color should update');
            assert.ok(classes.includes(selectors.reactive), 'reactive class applied');
        });
    })

    describe('Image dot paths', function () {
        it('Should resolve a dot path to a built asset', async () => {
            const el = await gf.get(`.${selectors.imageDot}`);
            const { 'background-image': background } = await el.styles();

            assert.ok(background, 'the dot path should set a background image');
            assert.ok(/url\(.*\/a-.*\.png\)/.test(background), `expected a built a.png, got ${background}`);
        });

        it('Should resolve a dot path and a direct import to the same asset', async () => {
            const dot = await gf.get(`.${selectors.imageDot}`);
            const imported = await gf.get(`.${selectors.imageDotRef}`);

            const dotStyles = await dot.styles();
            const importedStyles = await imported.styles();

            assert.equal(
                dotStyles['background-image'],
                importedStyles['background-image'],
                'the dot path and the direct import should point at one file',
            );
        });

        it('Should swap the image when a computed key changes', async () => {
            const { 'background-image': before } = await (await gf.get(`.${selectors.imageDynamic}`)).styles();

            await gf.click(`.${selectors.scenarioBtn}.scenario-4`);

            // Dynamic throws the old element away and mounts a new one
            const { 'background-image': after } = await (await gf.get(`.${selectors.imageDynamic}`)).styles();

            assert.notEqual(before, after, 'the computed key should change the image');
            assert.ok(/url\(.*\/b-.*\.png\)/.test(after), `expected a built b.png, got ${after}`);
        });
    });

    describe('Image options', function () {
        it('Should apply the default image styles without options', async () => {
            const el = await gf.get(`.${selectors.image}`);
            const styles = await el.styles();

            assert.equal(styles['background-size'], 'contain', 'default size should be contain');
            assert.equal(styles['background-repeat'], 'no-repeat', 'default should not repeat');
        });

        it('Should map known option values to styles', async () => {
            const el = await gf.get(`.${selectors.imageOptions}`);
            const styles = await el.styles();

            assert.equal(styles['background-size'], 'cover', 'size cover should apply');
            assert.equal(styles['background-repeat'], 'repeat-x', 'repeat x should apply');
        });

        it('Should pass unknown option values through as styles', async () => {
            const el = await gf.get(`.${selectors.imageCustomOptions}`);
            const styles = await el.styles();

            // Gameface splits the position shorthand into its two axes.
            assert.equal(styles['background-size'], '50px 50px', 'a raw size should be used as is');
            assert.equal(styles['background-position-x'], '10px', 'a raw position should be used as is');
            assert.equal(styles['background-position-y'], '20px', 'a raw position should be used as is');
        });

        it('Should update option styles reactively', async () => {
            const el = await gf.get(`.${selectors.imageOptions}`);
            await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
            const styles = await el.styles();

            assert.equal(styles['background-size'], 'contain', 'size should change to contain');
            assert.equal(styles['background-repeat'], 'repeat-y', 'repeat should change to y');
        });
    });
});
