const assert = require('assert');
const selectors = require('../shared/segment-selectors.json');
const { navigateToPage, elementChildren, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

describe('Segment', function () {
    this.beforeAll(async () => {
        await navigateToPage('.segment-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('segment', [], 'The initially selected button is not reported');
    })

    it('Should render itself and it\'s slots correctly', async () => {
        const segment = await gf.get(`.${selectors.segment}`);
        const segmentButtons = Array.from(await elementChildren(segment));

        assert.ok(segment, 'Segment should be in the DOM');
        assert.equal(segmentButtons.length, 3, 'Segment buttons should be in the DOM');

        // The indicator slot renders after the first selection change.
        await segmentButtons[1].click();
        await gf.retryIfFails(async () => {
            assert.equal((await elementChildren(segment)).length, 4, 'Segment indicator should be in the DOM');
        });
    })

    it('Should change selected option', async () => {
        const segment = await gf.get(`.${selectors.segment}`);
        const segmentButtons = await elementChildren(segment)
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
        await (await elementChildren(segment))[1].click();

        assert.equal(await gf.text(`.${selectors.assertionElement}`), "test1", 'Selected button should still be the first one');
        assert.equal((await segment.styles())['background-color'], 'rgba(255, 0, 0, 1)');
    })

    it('Should test Segment.Button disabled state', async () => {
        await gf.click(`.${selectors.disableSegmentBtn}`);
        const buttonToDisable = (await elementChildren(await gf.get(`.${selectors.segment}`)))[1];
        await buttonToDisable.click();

        assert.equal(await gf.text(`.${selectors.assertionElement}`), "test1", 'Selected button should still be the first one');
        assert.equal((await buttonToDisable.styles())['background-color'], 'rgba(255, 0, 0, 1)');
    })

    it('Should test it\'s props reactivity', async () => {
        const segment = await gf.get(`.${selectors.segment}`);
        await (await elementChildren(segment))[2].click();

        const segmentStyles = await segment.styles();
        const isReactive = (await segment.classes()).includes(selectors.reactive);

        assert.equal(segmentStyles['background-color'], 'rgba(0, 128, 0, 1)');
        assert.equal(isReactive, true);
    })

    it('Should test Segment.Buttons props reactivity', async () => {
        const segmentButton = (await elementChildren(await gf.get(`.${selectors.segment}`)))[1];

        await segmentButton.click();
        const btnStyles = await segmentButton.styles();
        const isReactive = (await segmentButton.classes()).includes(selectors.reactive);

        assert.equal(btnStyles['background-color'], 'rgba(0, 128, 0, 1)');
        assert.equal(isReactive, true);
    })
});

describe('Segment onChange calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should call onChange once per selection', async () => {
        await gf.click(`.${selectors.segmentButton2}`);
        await expectOnChangeCalls('segment', ['test2'], 'One call for the new option');
    })

    it('Should not call onChange when the selected button is clicked again', async () => {
        await gf.click(`.${selectors.segmentButton1}`);
        await expectOnChangeCalls('segment', [], 'test1 is already selected');
    })

    it('Should call onChange synchronously from the ref', async () => {
        await gf.trigger('selectSegmentOption');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('segment'), ['test3'], 'onChange fired before selectOption returned');
        })
        await expectOnChangeCalls('segment', ['test3'], 'No late duplicate');
    })

    it('Should not call onChange when disabled', async () => {
        await gf.click(`.${selectors.disableSegment}`);
        await gf.click(`.${selectors.segmentButton2}`);
        await expectOnChangeCalls('segment', [], 'A click on a disabled segment');
    })
});
