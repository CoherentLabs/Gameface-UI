const assert = require('assert');
const selectors = require('../shared/carousel-selectors.json');
const { navigateToPage } = require('../shared/utils');

describe('Carousel', function () {
    this.beforeAll(async () => {
        await navigateToPage('.carousel-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        const carousel = await gf.get(`.${selectors.carousel}`);
        const carouselItems = await carousel.findAll(`.${selectors.carouselItem}`);
        const pages = await carousel.findAll(`.${selectors.carouselPages}`);

        assert.ok(carousel, 'Carousel should be in the DOM');
        assert.ok(carouselItems, 'Carousel items should be in the DOM');
        assert.equal(carouselItems.length, 10);
        assert.equal(pages.length, 10);
    })

    it('Should change active page/item', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const pages = await gf.getAll(`.${selectors.carouselPages}`);

        await pages.nth(2).click();
        assert.equal(await assertionEl.text(), 'Selected item/page: 2', 'Should select third item');
    });

    it('Should change active page/item via arrows', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        const controls = await gf.getAll(`.${selectors.carouselControl}`);
        const prev = controls.first();
        const next = controls.last();

        await next.click();
        await next.click();
        assert.equal(await assertionEl.text(), 'Selected item/page: 2', 'Should select third item');

        await prev.click();
        await prev.click();
        assert.equal(await assertionEl.text(), 'Selected item/page: 0', 'Should select first item');
    });

    it('Should change items width', async () => {
        const carouselItem = await gf.get(`.${selectors.carouselItem}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const hasStyle = await carouselItem.waitForStyles({ width: '20%' });
        assert(hasStyle);
    });

    it('Should change items gap', async () => {
        const carouselItem = await gf.get(`.${selectors.carouselItem}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        const hasStyle = await carouselItem.waitForStyles({ 'margin-right': '15%', 'margin-left': '15%' });
        assert(hasStyle);
    });

    it('Items should be aligned at center by default', async () => {
        const carouselItems = await gf.get(`.${selectors.carouselItems}`);
        const carouselItem = await gf.get(`.${selectors.carouselItem}`);
        await gf.retryIfFails(async () => {
            const sizeOfItemsContainer = await carouselItems.getSize();
            const itemPosition = await carouselItem.getPositionOnScreen();
            const carouselItemsContainerPosition = await carouselItems.getPositionOnScreen();
            assert.equal(itemPosition.x - carouselItemsContainerPosition.x, sizeOfItemsContainer.width / 4, 'Items are not positioned at the center of the carousel')
        });
    });

    it('Should change alignment to end', async () => {
        const carouselItems = await gf.get(`.${selectors.carouselItems}`);
        const carouselItem = await gf.get(`.${selectors.carouselItem}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        await gf.retryIfFails(async () => {
            const sizeOfItemsContainer = await carouselItems.getSize();
            const itemPosition = await carouselItem.getPositionOnScreen();
            const carouselItemsContainerPosition = await carouselItems.getPositionOnScreen();
            assert.equal(itemPosition.x - carouselItemsContainerPosition.x, sizeOfItemsContainer.width / 2, 'Items are not positioned at the end of the carousel')
        });
    });

    it('Should group items', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        await gf.retryIfFails(async () => {
            const carouselItems = await gf.getAll(`.${selectors.carouselItem}`);
            const pages = await gf.getAll(`.${selectors.carouselPages}`);
            assert.equal(carouselItems.length, 10);
            assert.equal(pages.length, 3);
        });
    });

    it('Should add item at the front and preserve the current selection items', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.nth(1).click();
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
        const firstItem = await gf.get(`.${selectors.carouselItem}`);
        const selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await firstItem.waitForText('Front'));
        assert(await selectedItem.waitForText('Item 2'));
    });

    it('Should add item at the front and select it', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.nth(1).click();
        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 2'));

        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        const firstItem = await gf.get(`.${selectors.carouselItem}`);
        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await firstItem.waitForText('Front'));
        assert(await selectedItem.waitForText('Front'));
    });

    it('Should add item between first and selected element', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.nth(1).click();
        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 2'));
        await gf.click(`.${selectors.scenarioBtn}.scenario-15`);
        const addedItem = (await gf.getAll(`.${selectors.carouselItem}`)).nth(1);
        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await addedItem.waitForText('Mid'));
        assert(await selectedItem.waitForText('Item 2'));
    });

    it('Should add item between first and selected element and select it', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.nth(2).click();
        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 3'));
        await gf.click(`.${selectors.scenarioBtn}.scenario-16`);
        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Mid selected'));
    });

    it('Should remove second item and preserve selection', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.nth(2).click();
        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 3'));
        await gf.click(`.${selectors.scenarioBtn}.scenario-17`);
        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 3'));
    });

    it('Should remove second item and preserve selection while the last item is seleted', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.last().click();
        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 10'));
        await gf.click(`.${selectors.scenarioBtn}.scenario-17`);
        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 10'));
    });

    it('Should add item at the back and preserve the current selection items', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.last().click();
        await gf.click(`.${selectors.scenarioBtn}.scenario-6`);
        const lastItem = (await gf.getAll(`.${selectors.carouselItem}`)).last();
        const selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await lastItem.waitForText('Back'));
        assert(await selectedItem.waitForText('Item 10'));
    });

    it('Should add item at the back and select it', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.last().click();
        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 10'));

        await gf.click(`.${selectors.scenarioBtn}.scenario-7`);
        const lastItem = (await gf.getAll(`.${selectors.carouselItem}`)).last();
        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await lastItem.waitForText('Back'));
        assert(await selectedItem.waitForText('Back'));
    });

    it('Should remove last item and preserve selection', async () => {
        let carouselItems = await gf.getAll(`.${selectors.carouselItem}`);
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        assert(await carouselItems.last().waitForText('Item 10'));

        await pages.nth(1).click();

        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 2'));

        await gf.click(`.${selectors.scenarioBtn}.scenario-8`);

        carouselItems = await gf.getAll(`.${selectors.carouselItem}`);
        assert(await carouselItems.last().waitForText('Item 9'));

        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 2'));
    });

    it('Should remove last item and change selection', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.last().click();

        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 10'));

        await gf.click(`.${selectors.scenarioBtn}.scenario-8`);

        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 9'));
    });

    it('Should remove first item and preserve selection', async () => {
        let carouselItems = await gf.getAll(`.${selectors.carouselItem}`);
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        assert(await carouselItems.first().waitForText('Item 1'));

        await pages.last().click();

        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 10'));

        await gf.click(`.${selectors.scenarioBtn}.scenario-9`);

        carouselItems = await gf.getAll(`.${selectors.carouselItem}`);
        assert(await carouselItems.first().waitForText('Item 2'));

        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 10'));
    });

    it('Should remove last item and change selection', async () => {
        const pages = await gf.getAll(`.${selectors.carouselPages}`);
        await pages.first().click();

        let selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 1'));

        await gf.click(`.${selectors.scenarioBtn}.scenario-9`);

        selectedItem = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await selectedItem.waitForText('Item 2'));
    });

    it('Should change active page/item via ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-10`);
        assert.equal(await assertionEl.text(), 'Selected item/page: 1', 'Should select second item');

        await gf.click(`.${selectors.scenarioBtn}.scenario-11`);
        assert.equal(await assertionEl.text(), 'Selected item/page: 0', 'Should select first item');
    });

    it('Should scroll to second element via ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-12`);
        assert.equal(await assertionEl.text(), 'Selected item/page: 2', 'Should select third item');
    });

    it('Should remove trailing spaces', async () => {
        const carouselItemsContainer = await gf.get(`.${selectors.carouselItems}`);
        let carouselItemSelected = await gf.get(`.${selectors.carouselItemSelected}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-13`);
        await gf.retryIfFails(async () => {
            const { x } = await carouselItemSelected.getPositionOnScreen();
            assert.equal(x, 0, 'First item is not positioned at start of the carousel')
        });

        // Change to next element
        await gf.click(`.${selectors.scenarioBtn}.scenario-10`);
        carouselItemSelected = await gf.get(`.${selectors.carouselItemSelected}`);

        await gf.retryIfFails(async () => {
            const sizeOfItemsContainer = await carouselItemsContainer.getSize();
            const itemPosition = await carouselItemSelected.getPositionOnScreen();
            const carouselItemsContainerPosition = await carouselItemsContainer.getPositionOnScreen();
            assert.equal(itemPosition.x - carouselItemsContainerPosition.x, sizeOfItemsContainer.width / 4, 'Second item is not positioned at the center of the carousel')
        });
    });

    it('Should scroll to second element via ref', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-14`);
        const prevBtn = await gf.get(`.${selectors.carouselCustomPrev}`);
        const nextBtn = await gf.get(`.${selectors.carouselCustomNext}`);
        assert(prevBtn);
        assert(nextBtn);

        await nextBtn.click();
        let carouselItemSelected = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await carouselItemSelected.waitForText('Item 2'));

        await prevBtn.click();
        carouselItemSelected = await gf.get(`.${selectors.carouselItemSelected}`);
        assert(await carouselItemSelected.waitForText('Item 1'));
    });

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.carousel}`, desc: 'root' },
            { selector: `.${selectors.carouselItem}`, desc: 'item' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-18`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                if (selector === `.${selectors.carouselItem}`) {
                    assert.equal(styles['background-image'], 'linear-gradient(to bottom right,rgba(255, 0, 0, 1), rgba(185, 185, 185, 1), rgba(119, 119, 119, 1), rgba(59, 59, 59, 1), rgba(0, 0, 0, 1))', 'styles update');
                } else {
                    assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                }
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});