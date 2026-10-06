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

const texts = async (selector) => {
    const elements = await gf.getAll(selector);
    const result = [];

    for (const element of elements) {
        result.push(await element.text());
    }

    return result;
};

describe('Chart.Bar', function () {
    this.beforeAll(async () => {
        await navigateToPage('.chart-bar-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render one bar per series per category', async () => {
        assert.equal(await count(`.${selectors.barMark}`), 6, 'Two series over three categories');
    });

    it('Should list series in the legend, not categories', async () => {
        // A pie legend lists slices; a bar legend lists series. This is the
        // difference that makes the two legends worth testing separately.
        assert.deepEqual(await texts(`.${selectors.barLegend} > div`), ['Player', 'Enemy']);
    });

    it('Should render axis labels on both axes', async () => {
        assert.deepEqual(
            await texts(`.${selectors.barCategoryLabel}`),
            ['strength', 'agility', 'stamina'],
        );

        // The domain is rounded out to readable steps rather than ending on
        // the raw maximum of 18.
        assert.deepEqual(await texts(`.${selectors.barValueLabel}`), ['0', '5', '10', '15', '20']);
    });

    it('Should round only the end away from the baseline', async () => {
        const [first] = await paths(`.${selectors.barMark}`);

        // A bar closes back down to the baseline square; only its far end is
        // rounded, otherwise bars look like they float.
        assert.ok(first.includes('a4,4'), 'The data end should be rounded');
        assert.ok(first.startsWith('M14.4,288v-'), 'The bar should stand on the baseline');
    });

    it('Should stack segments with a gap and round only the outer one', async () => {
        const stacked = await paths(`.${selectors.stackedMark}`);
        assert.equal(stacked.length, 6);

        // The first three are the lower segments, the last three the upper.
        const lower = stacked.slice(0, 3);
        const upper = stacked.slice(3);

        assert.ok(lower.every(d => !d.includes('a4,4')), 'Inner segments should be square');
        assert.ok(upper.every(d => d.includes('a4,4')), 'Outer segments should be rounded');

        // Lower segment of category 0 starts at y 183.6; the upper one ends at
        // 181.6, leaving the documented 2px surface gap between them.
        assert.ok(lower[0].startsWith('M14.4,183.6'), `Unexpected lower segment: ${lower[0]}`);
        assert.ok(upper[0].startsWith('M14.4,181.6'), `Unexpected upper segment: ${upper[0]}`);
    });

    it('Should lay bars out along the other axis when horizontal', async () => {
        const [first] = await paths(`.${selectors.horizontalMark}`);

        // Horizontal bars grow rightwards from a baseline on the left, so the
        // path opens with a horizontal run rather than a vertical one.
        assert.ok(/^M0,[\d.]+h/.test(first), `Expected a horizontal run, got: ${first}`);
    });

    it('Should place negative values on the far side of the baseline', async () => {
        const labels = await texts(`.${selectors.divergingBase} [class*="axis-label"]`);
        assert.ok(labels.includes('-10'), 'The domain should extend below zero');
        assert.ok(labels.includes('0'), 'Zero should remain a tick');

        const bars = await paths(`.${selectors.divergingMark}`);

        // Every bar starts on the same baseline; positives run up (v-) and
        // negatives run down (v followed by a digit).
        const ups = bars.filter(d => /^M[\d.]+,162v-/.test(d));
        const downs = bars.filter(d => /^M[\d.]+,162v\d/.test(d));

        assert.equal(ups.length, 2, 'Two positive values');
        assert.equal(downs.length, 2, 'Two negative values');
    });

    it('Should let the surviving series fill the band when one is hidden', async () => {
        const entry = async (i) => (await gf.getAll(`.${selectors.barLegend} > div`))[i];

        const before = (await paths(`.${selectors.barMark}`))[0];
        await (await entry(1)).click();

        assert.equal(await count(`.${selectors.barMark}`), 3, 'Hiding a series removes its bars');

        const widened = (await paths(`.${selectors.barMark}`))[0];
        assert.notEqual(widened, before, 'The remaining series should widen into the free space');

        // Legend visibility is component state and survives `reset`.
        await (await entry(1)).click();
        assert.equal(await count(`.${selectors.barMark}`), 6);
    });

    it('Should show a tooltip on hover', async () => {
        const probe = await gf.get(`.${selectors.barProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.barTooltip}`), 1, 'Tooltip should appear');
        assert.equal(await gf.text(`.${selectors.barTooltip}`), 'strength13');
    });
});
