const assert = require('assert');
const selectors = require('../../shared/chart-selectors.json');
const { navigateToPage } = require('../../shared/utils');

const count = async (selector) => {
    try {
        const elements = await gf.getAll(selector);
        return elements.length;
    } catch {
        return 0;
    }
};

const paths = async (selector) => {
    const elements = await gf.getAll(selector);
    const result = [];

    for (const element of elements) {
        result.push(await element.getAttribute('d'));
    }

    return result;
};

describe('Chart.Line', function () {
    this.beforeAll(async () => {
        await navigateToPage('.chart-line-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render one stroke per series', async () => {
        assert.equal(await count(`.${selectors.lineStroke}`), 2);
    });

    it('Should place vertices at category centres', async () => {
        const [first] = await paths(`.${selectors.lineStroke}`);

        // Three categories across a 432px plot: centres at 72, 216 and 360, so
        // a line lands over the middle of the equivalent bar.
        assert.equal(first, 'M72,100.8L216,158.4L360,57.6', `Unexpected line: ${first}`);
    });

    it('Should render point markers when asked to show them', async () => {
        assert.equal(await count(`.${selectors.linePoint}`), 6, 'Two series over three categories');
    });

    it('Should break the line where a category is undeclared', async () => {
        const strokes = await paths(`.${selectors.gapStroke}`);
        const partial = strokes[1];

        // The second series declares strength and stamina but not agility.
        // With connectNulls={false} that is a gap, not a straight line through.
        const subpaths = partial.split('M').length - 1;
        assert.equal(subpaths, 2, `Expected two subpaths, got: ${partial}`);
    });

    it('Should resolve the nearest vertex and snap the tooltip to it', async () => {
        const probe = await gf.get(`.${selectors.lineProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.lineTooltip}`), 1, 'Tooltip should appear');

        // The probe sits between the two lines at the first category, but is
        // nearer the Enemy vertex (7) than the Player one (13). Resolving to
        // Enemy is the point: the series is chosen by vertical distance, not
        // by which one happens to come first.
        assert.equal(await gf.text(`.${selectors.lineTooltip}`), 'strength7');

        // Nearest-x is a crosshair, so the tooltip sits on the vertex rather
        // than under the pointer.
        const tooltip = await gf.get(`.${selectors.lineTooltip}`);
        const style = await tooltip.getAttribute('style');
        assert.ok(style.includes('left: 112px'), `Tooltip should snap to the vertex: ${style}`);
    });

    it('Should remove a line when its series is hidden', async () => {
        const entry = async (i) => (await gf.getAll(`.${selectors.lineLegend} > div`))[i];

        await (await entry(1)).click();
        assert.equal(await count(`.${selectors.lineStroke}`), 1, 'Hiding a series removes its line');

        await (await entry(1)).click();
        assert.equal(await count(`.${selectors.lineStroke}`), 2);
    });
});
