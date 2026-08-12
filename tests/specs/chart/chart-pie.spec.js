const assert = require('assert');
const selectors = require('../../shared/chart-selectors.json');
const { navigateToPage } = require('../../shared/utils');

/**
 * Counts matches without throwing when nothing is there — the tooltip and the
 * marks are conditionally rendered, so "absent" is a valid expected state.
 */
const count = async (selector) => {
    try {
        const elements = await gf.getAll(selector);
        return elements.length;
    } catch {
        return 0;
    }
};

const animationState = async () => gf.text(`.${selectors.animationState}`);

const sliceGeometry = async (selector) => {
    const slices = await gf.getAll(selector);
    const paths = [];

    for (const slice of slices) {
        paths.push(await slice.getAttribute('d'));
    }

    return paths.join('|');
};

describe('Chart.Pie', function () {
    this.beforeAll(async () => {
        await navigateToPage('.chart-pie-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render itself and its children correctly', async () => {
        const chart = await gf.get(`.${selectors.base}`);

        assert.ok(chart, 'Chart should be in the DOM');
        assert.equal(await count(`.${selectors.slice}`), 4, 'Should render one slice per point');
        assert.equal(await count(`.${selectors.label}`), 4, 'Should render one label per slice');
        assert.equal(await count(`.${selectors.legend} > div`), 4, 'Should render one legend entry per slice');
    });

    it('Should re-render when the data changes', async () => {
        const before = await sliceGeometry(`.${selectors.slice}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const after = await sliceGeometry(`.${selectors.slice}`);

        assert.notEqual(before, after, 'Slice geometry should follow the data');
    });

    it('Should add a slice when a point is added', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);

        assert.equal(await count(`.${selectors.slice}`), 5);
        assert.equal(await count(`.${selectors.legend} > div`), 5);
    });

    it('Should remove slices when points are removed', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);

        assert.equal(await count(`.${selectors.slice}`), 2);
        assert.equal(await count(`.${selectors.legend} > div`), 2);
    });

    it('Should treat a negative value as zero', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);

        // A negative slice has no meaning in a pie: it is clamped away entirely
        // rather than drawn, but it keeps its legend entry.
        assert.equal(await count(`.${selectors.slice}`), 2, 'The negative point should not be drawn');
        assert.equal(await count(`.${selectors.legend} > div`), 3, 'The category should still be listed');
    });

    it('Should render nothing for empty data', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);

        assert.equal(await count(`.${selectors.slice}`), 0);
        assert.equal(await count(`.${selectors.label}`), 0);
        assert.equal(await count(`.${selectors.legend} > div`), 0);
    });

    it('Should toggle a slice from the legend', async () => {
        const entries = await gf.getAll(`.${selectors.legend} > div`);
        await entries.first().click();

        assert.equal(await count(`.${selectors.slice}`), 3, 'Clicking an entry should hide its slice');

        // Legend visibility is component state and survives `reset`, so put it
        // back rather than leaking into the next test.
        const restored = await gf.getAll(`.${selectors.legend} > div`);
        await restored.first().click();

        assert.equal(await count(`.${selectors.slice}`), 4, 'Clicking again should restore it');
    });

    it('Should animate between data sets', async () => {
        // The test view uses a deliberately long duration. Reading four path
        // attributes is several protocol round trips, so a realistic 300ms
        // animation would already be finished by the time they come back and
        // every "is it still moving?" assertion would race.
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`); // enable animation
        const before = await sliceGeometry(`.${selectors.slice}`);

        await gf.click(`.${selectors.scenarioBtn}.scenario-0`); // change values

        // Read fresh each time: a cached element handle goes stale as the
        // chart re-renders around it.
        assert.equal(await animationState(), 'running', 'onStart should have fired');

        const during = await sliceGeometry(`.${selectors.slice}`);
        assert.notEqual(during, before, 'Geometry should start moving immediately');

        await gf.sleep(3500);

        assert.equal(await animationState(), 'done', 'onEnd should have fired');
        const settled = await sliceGeometry(`.${selectors.slice}`);
        assert.notEqual(settled, during, 'Geometry should keep moving until it settles');
    });

    it('Should not animate when no animation is configured', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`); // change values only

        assert.equal(await animationState(), 'idle', 'No tween should run without the prop');
    });

    it('Should show a tooltip on hover', async () => {
        // Hovering a <path> directly is impossible: getBoundingClientRect
        // returns zeros for SVG children in Gameface, so the driver has no
        // coordinates to aim at. The probe is a click-through element parked
        // over a known slice.
        const probe = await gf.get(`.${selectors.probe}`);
        // Scroll first: hover() resolves its coordinates before scrolling, so
        // an off-screen target gets pointed at where it used to be.
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.tooltip}`), 1, 'Tooltip should appear');

        const tooltip = await gf.get(`.${selectors.tooltip}`);
        assert.equal(await tooltip.text(), 'strength13', 'Tooltip should describe the hovered slice');
    });

    it('Should resolve the same point in overlay mode as in svg mode', async () => {
        const probe = await gf.get(`.${selectors.overlayProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.overlayTooltip}`), 1, 'Overlay tooltip should appear');

        const tooltip = await gf.get(`.${selectors.overlayTooltip}`);
        assert.equal(
            await tooltip.text(),
            'strength13',
            'Native SVG hit-testing and the overlay resolver must agree on the same point',
        );
    });
});
