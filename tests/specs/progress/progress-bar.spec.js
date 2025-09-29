const assert = require('assert');
const selectors = require('../../shared/progress-selectors.json');

describe('Progress Bar', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.progress-bar-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const progress= await gf.get(`.${selectors.base}`);
        const fill= await progress.find(`.${selectors.fill}`);

        assert.ok(progress, 'Progress bar should be in the DOM');
        assert.ok(fill, 'Progress bar fill should be in the DOM');
    })
    
    it('Should load to 100%', async () => {
        const fill= await gf.get(`.${selectors.fill}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        const hasStyle = await fill.waitForStyles({ width: '100%' });
        assert(hasStyle);
    })

    it('Should load to 50%', async () => {
        const fill= await gf.get(`.${selectors.fill}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);

        const hasStyle = await fill.waitForStyles({ width: '50%' });
        assert(hasStyle);
    })

    it('Should not load beyond 100%', async () => {
        const fill= await gf.get(`.${selectors.fill}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);

        await gf.sleep(1000)
        const {width} = await fill.styles();
        assert.notEqual(width, 120, 'Width should be with be a 100%');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.base}`, desc: 'base' },
            { selector: `.${selectors.fill}`, desc: 'fill' },
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