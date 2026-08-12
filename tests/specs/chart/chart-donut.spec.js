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

const textOf = async (selector) => {
    try {
        const element = await gf.get(selector);
        return await element.text();
    } catch {
        return null;
    }
};

/** Moves the pointer off the chart so a leftover hover cannot leak between tests. */
const clearHover = async () => {
    const legend = await gf.get(`.${selectors.donutBase} [class*="legend"]`);
    await legend.scrollIntoView();
    await legend.hover();
};

describe('Chart.Donut', function () {
    this.beforeAll(async () => {
        await navigateToPage('.chart-donut-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render itself and its children correctly', async () => {
        const donut = await gf.get(`.${selectors.donutBase}`);

        assert.ok(donut, 'Donut should be in the DOM');
        assert.equal(await count(`.${selectors.donutSlice}`), 4, 'Should render one slice per point');
    });

    it('Should render slices as rings rather than wedges', async () => {
        const slice = await gf.get(`.${selectors.donutSlice}`);
        const path = await slice.getAttribute('d');

        // A pie wedge closes through the centre with a line to 0,0. A ring
        // never touches the centre — it closes along the inner arc instead.
        assert.ok(!path.includes('L0,0'), 'A donut slice must not close through the centre');

        // The inner radius follows from the pinned 480x316 plot in the test
        // view: 60% of a 158px outer radius.
        assert.ok(path.includes('94.8'), 'Slice should carry the default 60% inner radius');
    });

    it('Should honour an explicit innerRadius', async () => {
        const slice = await gf.get(`.${selectors.donutOverlaySlice}`);
        const path = await slice.getAttribute('d');

        // The second donut asks for 40% of the same 158px outer radius.
        assert.ok(path.includes('63.2'), 'Slice should carry the requested 40% inner radius');
    });

    it('Should show the total in the hole when nothing is hovered', async () => {
        assert.equal(await textOf(`.${selectors.donutHoleLabel}`), '44', '13 + 9 + 16 + 6');
    });

    it('Should update the hole total when the data changes', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        assert.equal(await textOf(`.${selectors.donutHoleLabel}`), '60', '10 + 25 + 15 + 10');
    });

    it('Should render custom hole content from the Hole slot', async () => {
        assert.equal(await textOf(`.${selectors.donutCustomHole}`), 'Loadout');
    });

    it('Should show a tooltip when the ring is hovered', async () => {
        const probe = await gf.get(`.${selectors.donutRingProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.donutTooltip}`), 1, 'Tooltip should appear');
        assert.equal(await textOf(`.${selectors.donutTooltip}`), 'strength13');

        // The hole swaps the total for the hovered slice.
        assert.equal(await textOf(`.${selectors.donutHoleLabel}`), '13strength');

        await clearHover();
    });

    it('Should treat the hole as a gap in svg mode', async () => {
        const probe = await gf.get(`.${selectors.donutHoleProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.donutTooltip}`), 0, 'The hole has no geometry to hit');
        assert.equal(await textOf(`.${selectors.donutHoleLabel}`), '44', 'The hole should fall back to the total');
    });

    it('Should treat the hole as a gap in overlay mode', async () => {
        const ring = await gf.get(`.${selectors.donutOverlayRingProbe}`);
        await ring.scrollIntoView();
        await ring.hover();
        assert.equal(await textOf(`.${selectors.donutOverlayTooltip}`), 'strength13', 'The ring should still resolve');

        const hole = await gf.get(`.${selectors.donutOverlayHoleProbe}`);

        await hole.scrollIntoView();
        await hole.hover();

        // Nothing occupies the hole, so this proves the resolver rejects by
        // radius rather than relying on the absence of an element.
        assert.equal(await count(`.${selectors.donutOverlayTooltip}`), 0, 'The resolver should reject the hole by radius');
    });
});
