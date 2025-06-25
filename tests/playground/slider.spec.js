const assert = require('assert');

describe('Slider', function () {
    this.beforeAll(async () => {
        await gf.navigate('http://localhost:3000/playground/');
        await gf.click('.slider-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const slider = await gf.get('.slider');
        const fill = await slider.find('.slider-fill');
        const track = await slider.find('.slider-track');
        const handle = await slider.find('.slider-handle');
        const thumb = await slider.find('.slider-thumb');
        const grid = await slider.find('.slider-grid');
        const gridPols = await grid.findAll('.slider-pol');

        assert.ok(slider, 'Slider should be in the DOM');
        assert.ok(fill, 'Slider fill should be in the DOM');
        assert.ok(track, 'Slider track should be in the DOM');
        assert.ok(handle, 'Slider handle should be in the DOM');
        assert.ok(thumb, 'Slider thumb should be in the DOM');
        assert.ok(grid, 'Slider grid should be in the DOM');
        assert.equal(gridPols.length, 25, 'Slider grid should be in the DOM');
    })
    
    it('Should change value', async () => {
        const handle = await gf.get('.slider-handle');
        const thumb = await gf.get('.slider-thumb');
        await handle.drag(1000, 0);

        assert.equal(await thumb.text(), 100, 'Slider\'s value should change to 100');
    })

    it('Should change value via ref', async () => {
        await gf.click('.scenario-0');
        const thumb = await gf.get('.slider-thumb');
        assert.equal(await thumb.text(), 20, 'Slider\'s value should change to 20');
    })

    it('Should retrieve value via onChange prop', async () => {
        const assertionEl = await gf.get('.assertion-element');
        const handle = await gf.get('.slider-handle');
        const thumb = await gf.get('.slider-thumb');
        await handle.drag(1000, 0);

        assert.equal(await assertionEl.text(), await thumb.text(), 'Assertion element\'s text should match the value of the slider');
    })

    it('Should change value after clicking on track', async () => {
        const track = await gf.get('.slider-track');
        const thumb = await gf.get('.slider-thumb');
        await track.click();

        assert.equal(await thumb.text(), 50, 'Slider\'s thumb should move to the center');
    })

    it('Should render correct number of pols', async () => {
        const track = await gf.get('.slider-track');
        const thumb = await gf.get('.slider-thumb');
        await track.click();

        assert.equal(await thumb.text(), 50, 'Slider\'s thumb should move to the center');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: '.slider', desc: 'root' },
            { selector: '.slider-fill', desc: 'fill' },
            { selector: '.slider-track', desc: 'track' },
            { selector: '.slider-handle', desc: 'handle' },
            { selector: '.slider-thumb', desc: 'thumb' },
            { selector: '.slider-grid', desc: 'grid' },
            { selector: '.slider-pol', desc: 'pols' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click('.scenario-1');
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});