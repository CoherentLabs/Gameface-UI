const assert = require('assert');
const selectors = require('../shared/segment-selectors.json');

describe('Segment', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.segment-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s slots correctly', async () => {
        const segment = await gf.get(`.${selectors.segment}`);
        const segmentButtons = Array.from(await segment.children());

        assert.ok(segment, 'Checkbox should be in the DOM');
        assert.equal(segmentButtons.length, 4, 'Segment buttons should be in the DOM');
    })
    
    it('Should change selected option', async () => {
        const segment = await gf.get(`.${selectors.segment}`);
        const segmentButtons = await segment.children()
        const assertionEl = await gf.get(`.${selectors.assertionElement}`)
        
        assert.equal(await assertionEl.text(), "test1", 'Initial selected button should be the first one');
        await segmentButtons[2].click();
        assert.equal(await assertionEl.text(), "test3", 4, 'Selected button should be the last one');
    })

    it('Should change selected option via ref', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`)

        assert.equal(await assertionEl.text(), "test1", 'Initial selected button should be the first one');
        await gf.trigger('selectSegmentOption');        
        assert.equal(await assertionEl.text(), "test3", 4, 'Selected button should be the last one');
    })

    it('Should test it\'s disabled state', async () => {
        const segment = await gf.get(`.${selectors.segment}`);

        await gf.click(`.${selectors.disableSegment}`);
        await (await segment.children())[1].click();

        assert.equal(await gf.text(`.${selectors.assertionElement}`), "test1", 'Selected button should still be the first one');
        assert.equal((await segment.styles())['background-color'], 'rgba(255, 0, 0, 1)');
    })

    it('Should test Segment.Button disabled state', async () => {
        await gf.click(`.${selectors.disableSegmentBtn}`);
        const buttonToDisable = (await gf.children(`.${selectors.segment}`))[1];
        await buttonToDisable.click();

        assert.equal(await gf.text(`.${selectors.assertionElement}`), "test1", 'Selected button should still be the first one');
        assert.equal((await buttonToDisable.styles())['background-color'], 'rgba(255, 0, 0, 1)');
    })

    it('Should test it\'s props reactivity', async () => {
        const segment = await gf.get(`.${selectors.segment}`);
        await (await segment.children())[2].click();

        const segmentStyles = await segment.styles();
        const isReactive = (await segment.classes()).includes(selectors.reactive);

        assert.equal(segmentStyles['background-color'], 'rgba(0, 128, 0, 1)');
        assert.equal(isReactive, true);
    })

    it('Should test Segment.Buttons props reactivity', async () => {
        const segmentButton = (await gf.children(`.${selectors.segment}`))[1];

        await segmentButton.click();
        const btnStyles = await segmentButton.styles();
        const isReactive = (await segmentButton.classes()).includes(selectors.reactive);

        assert.equal(btnStyles['background-color'], 'rgba(0, 128, 0, 1)');
        assert.equal(isReactive, true);
    })
});