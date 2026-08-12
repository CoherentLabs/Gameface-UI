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

/** The y of each coordinate pair in a path, in order. */
const yValues = (path) => Array.from(path.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)).map(match => Number(match[2]));

describe('Chart.Area', function () {
    this.beforeAll(async () => {
        await navigateToPage('.chart-area-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render a fill and a stroke per series', async () => {
        assert.equal(await count(`.${selectors.areaFill}`), 2);
        assert.equal(await count(`.${selectors.areaStroke}`), 2, 'The outline reads over the translucent fill');
    });

    it('Should close an unstacked area onto the baseline', async () => {
        const [first] = await paths(`.${selectors.areaFill}`);
        const ys = yValues(first);

        // Three vertices along the top, then three along the bottom. Unstacked,
        // the bottom edge is the zero baseline, so all three share one y.
        const bottom = ys.slice(3);
        assert.equal(new Set(bottom).size, 1, `The lower edge should be flat: ${first}`);
    });

    it('Should ride a stacked area on the series beneath it', async () => {
        const [lower, upper] = await paths(`.${selectors.stackedAreaFill}`);

        const lowerTop = yValues(lower).slice(0, 3);
        const upperBottom = yValues(upper).slice(3).reverse();

        // The upper band's lower edge must trace the lower band's upper edge,
        // otherwise the two would overlap instead of stacking.
        assert.deepEqual(upperBottom, lowerTop, 'Stacked bands should meet exactly');

        // And that shared edge is not flat, which is what distinguishes a
        // stacked area from an overlapping one.
        assert.ok(new Set(upperBottom).size > 1, 'A stacked lower edge should follow the data');
    });

    it('Should show a tooltip on hover', async () => {
        const probe = await gf.get(`.${selectors.areaProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.areaTooltip}`), 1, 'Tooltip should appear');
        assert.equal(await gf.text(`.${selectors.areaTooltip}`), 'strength7');
    });
});
