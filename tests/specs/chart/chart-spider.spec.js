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

/**
 * Vertex distances from the centre.
 *
 * The shapes are drawn inside a group translated to the centre, so a path
 * coordinate is already an offset from it.
 */
const radii = (path) => Array.from(path.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g))
    .map(match => Math.hypot(Number(match[1]), Number(match[2])));

describe('Chart.Spider', function () {
    this.beforeAll(async () => {
        await navigateToPage('.chart-spider-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render a closed shape per series', async () => {
        const shapes = await paths(`.${selectors.spiderShape}`);
        assert.equal(shapes.length, 2);

        for (const shape of shapes) {
            assert.ok(shape.endsWith('Z'), `A spider shape must close: ${shape}`);
            assert.equal(radii(shape).length, 5, 'One vertex per category');
        }
    });

    it('Should put the first category straight up', async () => {
        const [first] = await paths(`.${selectors.spiderShape}`);

        // Angles run clockwise from 12 o'clock, so the first vertex has no
        // horizontal offset at all.
        assert.ok(first.startsWith('M0,-'), `First vertex should sit due north: ${first}`);
    });

    it('Should draw the requested number of web rings', async () => {
        assert.equal(await count(`.${selectors.spiderWeb}`), 4);
    });

    it('Should draw a circular web when asked', async () => {
        assert.equal(await count(`.${selectors.spiderCircleWeb}`), 5, 'Five levels, as circles');
    });

    it('Should label every axis around the perimeter', async () => {
        const labels = await gf.getAll(`div.${selectors.spiderAxis}`);
        const texts = [];

        for (const label of labels) {
            texts.push(await label.text());
        }

        assert.deepEqual(texts, ['strength', 'agility', 'stamina', 'intellect', 'spirit']);
    });

    it('Should keep low values small when maxValue pins the scale', async () => {
        const [fixed] = await paths(`.${selectors.spiderFixedShape}`);
        const largest = Math.max(...radii(fixed));

        // That chart has no legend and no axis labels, so its outer ring is
        // 176px. With maxValue={100} and a peak of 18, the shape must stay
        // near the centre instead of stretching to fill the web.
        assert.ok(largest < 44, `Expected a small shape, largest radius was ${largest}`);
    });

    it('Should resolve the nearest vertex on the nearest spoke', async () => {
        const probe = await gf.get(`.${selectors.spiderProbe}`);
        await probe.scrollIntoView();
        await probe.hover();

        assert.equal(await count(`.${selectors.spiderTooltip}`), 1, 'Tooltip should appear');

        // The probe sits on the first spoke, nearer Player's vertex (13) than
        // Enemy's (7): the spoke picks the category, the radius picks the series.
        assert.equal(await gf.text(`.${selectors.spiderTooltip}`), 'strength13');
    });

    it('Should remove a shape when its series is hidden', async () => {
        const entry = async (i) => (await gf.getAll(`.${selectors.spiderLegend} > div`))[i];

        await (await entry(1)).click();
        assert.equal(await count(`.${selectors.spiderShape}`), 1);

        await (await entry(1)).click();
        assert.equal(await count(`.${selectors.spiderShape}`), 2);
    });
});
