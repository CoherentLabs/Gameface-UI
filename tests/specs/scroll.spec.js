const assert = require('assert');
const { sleep } = require('gameface-e2e/core/utils');

describe('Scroll', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.scroll-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    this.beforeEach(async () => {
        await gf.click('.scenario-0');
    })

    it('Should render itself and its children correctly', async () => {
        const scroll = await gf.get('.scroll');
        const content = await scroll.find('.content');
        const contentChild = await content.find('.scroll-child');
        const assertionEl = await scroll.find('.assertion-element');
        const bar = await scroll.find('.bar');
        const handle = await scroll.find('.handle');
        
        assert.ok(scroll, 'Scroll should be in the DOM');
        assert.ok(content, 'Scroll content should in the DOM');
        assert.ok(contentChild, 'Content should render its children');
        assert.ok(assertionEl, 'Element should appear after overflow');
        assert.ok(bar, 'Scroll bar should be in the DOM');
        assert.ok(handle, 'Scroll handle should be in the DOM');
    })
    
    it('Should scroll up and down', async () => {
        const content = await gf.get('.content');
        const contentChild = await content.find('.scroll-child');

        await content.scroll(0, 200);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling down');
        })
        
        await content.scroll(0, -200);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), true, 'Element should be visible in the area after scrolling up');
        })        
    })

    it('Should scroll up and down with scroll handle', async () => {
        const content = await gf.get('.content');
        const contentChild = await content.find('.scroll-child');
        const handle = await gf.get('.handle');

        await handle.drag(0, 500);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling down');
        })
        
        await handle.drag(0, 0);
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), true, 'Element should be visible in the area after scrolling up');
        })        
    })

    it('Should scroll up and down with scroll ref', async () => {
        const content = await gf.get('.content');
        const contentChild = await content.find('.scroll-child');
        
        await gf.click('.scenario-2')
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling down');
        })
        
        await gf.click('.scenario-1')
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), true, 'Element should be visible in the area after scrolling up');
        })        
    })

    it('Should scroll to the end of the content with ref', async () => {
        const content = await gf.get('.content');
        const contentChild = await content.find('.scroll-child');
        
        await gf.click('.scenario-4')
        await gf.retryIfFails(async () => {
            assert.equal(await contentChild.isVisibleInScrollableArea(content), false, 'Element should not be visible in the area after scrolling to the end');
        })
    })


    it('Should scroll to a specified element', async () => {
        const content = await gf.get('.content');
        const assertionEl = await gf.get('.assertion-element');
        
        await gf.click('.scenario-5')
        await gf.retryIfFails(async () => {
            assert.equal(await assertionEl.isVisibleInScrollableArea(content), true, 'Element should be scrolled to');
        })
    })

    it('Should scroll a specified element into view', async () => {
        const content = await gf.get('.content');
        const assertionEl = await gf.get('.assertion-element');
        
        await gf.click('.scenario-6')
        await gf.retryIfFails(async () => {
            assert.equal(await assertionEl.isVisibleInScrollableArea(content), true, 'Element should be scrolled into view');
        })
    })

    it('Should execute logic after scrolling', async () => {
        const assertionEl = await gf.get('.assertion-element');
        
        await gf.click('.scenario-2')
        assert.equal(await assertionEl.text(), 'down', 'Element\'s text should correspond with scroll direction');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: '.scroll', desc: 'root' },
            { selector: '.content', desc: 'content' },
            { selector: '.bar', desc: 'bar' },
            { selector: '.handle', desc: 'handle' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click('.scenario-2');
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
            });
        }
    });
});