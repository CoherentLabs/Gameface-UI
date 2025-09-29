const assert = require('assert');
const selectors = require('../../shared/progress-selectors.json');

describe('Progress Circle', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.progress-circle-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const progress= await gf.get(`.${selectors.base}`);
        const fill = await progress.find(`.${selectors.fill}`);
        const outline = await progress.find(`.${selectors.outline}`);
        const text = await progress.find(`.${selectors.text}`);

        assert.ok(progress, 'Progress bar should be in the DOM');
        assert.ok(fill, 'Progress bar fill should be in the DOM');
        assert.ok(outline, 'Progress bar outline should be in the DOM');
        assert.ok(text, 'Progress bar text should be in the DOM');
    })
    
    it('Should load to 100%', async () => {
        const fill= await gf.get(`.${selectors.fill}`);
        const text= await gf.get(`.${selectors.text}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        const hasAttribute = await fill.waitForAttributes({ 'stroke-dashoffset': '0' });
        assert(hasAttribute);
        assert.equal(await text.text(), '100%', 'Circles\'s text should be 100%');
    })

    it('Should load to 50%', async () => {
        const fill= await gf.get(`.${selectors.fill}`);
        const text= await gf.get(`.${selectors.text}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);

        const hasAttribute = await fill.waitForAttributes({ 'stroke-dashoffset': '50' });
        assert(hasAttribute);
        assert.equal(await text.text(), '50%', 'Circles\'s text should be 50%');
    })

    it('Should not load beyond 100%', async () => {
        const fill= await gf.get(`.${selectors.fill}`);
        const text= await gf.get(`.${selectors.text}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);

        await gf.sleep(1000)
        const dashoffset = await fill.getAttribute('stroke-dashoffset');
        assert.notEqual(dashoffset, -20, 'Dashoffset should be 0');
        assert.equal(await text.text(), '100%', 'Circles\'s text should be 100%');
    })

    it('Should remove percent symbol from text', async () => {
        const text= await gf.get(`.${selectors.text}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);

        assert.equal(await text.text(), '10', 'Circles\'s text should be without %');
    })

    it('Should make fill round', async () => {
        const fill = await gf.get(`.${selectors.fill}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);

        const strokeLinecap = await fill.getAttribute('stroke-linecap');
        assert.equal(strokeLinecap, 'round', 'Circles\'s fill shape should be round');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.base}`, desc: 'base' },
            { selector: `.${selectors.fill}`, desc: 'fill' },
            { selector: `.${selectors.outline}`, desc: 'outline' },
            { selector: `.${selectors.text}`, desc: 'text' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();

                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
            });
        };
    });
});