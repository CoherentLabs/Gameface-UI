const assert = require('assert');
const selectors = require('../shared/pagination-selectors.json');

describe('Pagination', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.pagination-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const pagination = await gf.get(`.${selectors.pagination}`);
        const paginationControl = await pagination.findAll(`.${selectors.paginationControl}`);
        const paginationItems = await pagination.findAll(`.${selectors.paginationItem}`);

        assert.ok(pagination, 'Pagination should be in the DOM');
        assert.equal(paginationControl.length, 2, 'Two pagination control components should be in the DOM');
        assert.equal(paginationItems.length, 5, 'Five pagination item components should be in the DOM');
    })
    
    it('Should change index with controls', async () => {
        const paginationControl = await gf.getAll(`.${selectors.paginationControl}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await paginationControl[1].click();
        assert.equal(await assertionEl.text(), "2", 'The second item should be selected after clicking the control');
        
        await paginationControl[0].click();
        assert.equal(await assertionEl.text(), "1", 'The first option should be selected after clicking the left control');
    })

    it('Should change index with ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        assert.equal(await assertionEl.text(), "3", 'The third item should be selected');
    })

    it('Should cycle through pages with ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`); // next page
        assert.equal(await assertionEl.text(), "2", 'The second item should be selected');
        
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`); // previous page
        assert.equal(await assertionEl.text(), "1", 'The first option should be selected');
    })

    it('Should change index by clicking the items', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const paginationItems = await gf.getAll(`.${selectors.paginationItem}`);

        await paginationItems[paginationItems.length - 1].click();
        assert.equal(await assertionEl.text(), "5", 'The last item should be selected after clicking on it');

        await paginationItems[0].click();
        assert.equal(await assertionEl.text(), "1", 'The first item should be selected after clicking on it');
    })

    it('Should change page size to ten', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);

        const paginationItems = await gf.getAll(`.${selectors.paginationItem}`);
        assert.equal(paginationItems.length, 10, 'Ten pagination item components should be in the DOM');

        await paginationItems[paginationItems.length - 1].click();
        assert.equal(await assertionEl.text(), "10", 'The last item should be selected after clicking on it');
    })

    it('Should remove page numbers on items', async () => {
        const paginationItems = await gf.getAll(`.${selectors.paginationItem}`);
        assert.equal(await paginationItems[0].text(), "1", 'Pagination item should have it\'s index as text');

        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);        
        assert.equal(await paginationItems[0].text(), "", 'Pagination item should not have it\'s index as text');
    })

    it('Should fail to loop through items', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const paginationControls = await gf.getAll(`.${selectors.paginationControl}`);
        const paginationItems = await gf.getAll(`.${selectors.paginationItem}`)
        const leftCotnrol = await paginationControls.first();
        const rightControl = await paginationControls.last();

        await leftCotnrol.click();
        assert.equal(await assertionEl.text(), "1", 'The first item should remain selected');
        
        await paginationItems[paginationItems.length - 1].click();
        
        await rightControl.click();
        assert.equal(await assertionEl.text(), "5", 'The last item should remain selected');
    })

    it('Should enable loop and loop through items', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const paginationControls = await gf.getAll(`.${selectors.paginationControl}`);
        const leftCotnrol = await paginationControls.first();
        const rightControl = await paginationControls.last();

        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        
        await leftCotnrol.click();
        assert.equal(await assertionEl.text(), "5", 'The last item should be selected after looping through the items');
        
        await rightControl.click();
        assert.equal(await assertionEl.text(), "1", 'The first item should be selected after looping through the items');
    })

    it('Should fail to loop through items using ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const paginationItems = await gf.getAll(`.${selectors.paginationItem}`)

        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        assert.equal(await assertionEl.text(), "1", 'The first item should remain selected');
        
        await paginationItems[paginationItems.length - 1].click();
        
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        assert.equal(await assertionEl.text(), "5", 'The last item should remain selected');
    })

    it('Should enable loop and loop through items with ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        assert.equal(await assertionEl.text(), "5", 'The last item should be selected after looping through the items');
        
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        assert.equal(await assertionEl.text(), "1", 'The first item should be selected after looping through the items');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.pagination}`, desc: 'root' },
            { selector: `.${selectors.paginationControl}`, desc: 'pagination control' },
            { selector: `.${selectors.paginationItem}`, desc: 'pagination items' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-7`);
                const rightControl = await ( await gf.getAll(`.${selectors.paginationControl}`)).last();
                await rightControl.click();
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});

describe('Stepper Control', function () {
    this.beforeEach(async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-6`);
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render custom icon', async () => {
        const customControl = await gf.getAll(`.${selectors.paginationCustomControl}`);

        assert.ok(customControl, 'Custom control buttons should be in the DOM');
        assert.equal(customControl.length, 2, 'Two custom control buttons should be in the DOM');
    })

    it('Shound have custom hidden class', async () => {
        const leftControl = await gf.get(`.${selectors.paginationControl}`);
        
        const controlStyles = await leftControl.styles();
        const controlClasses = await leftControl.classes();

        assert.equal(controlClasses.includes(selectors.controlHidden), true, "Control should have custom class when hidden");
        assert.equal(controlStyles['background-color'], 'rgba(255, 0, 0, 1)', "Custom class should apply different styles");
    })
});