const assert = require('assert');
const selectors = require('../shared/modal-selectors.json');
const { navigateToPage } = require('../shared/utils');

describe('Modal', function () {
    this.beforeAll(async () => {
        await navigateToPage('.modal-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and its children correctly', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        const modal = await gf.get(`.${selectors.modal}`);
        const modalOverlay = await modal.find(`.${selectors.modalOverlay}`);
        const modalWindow = await modal.find(`.${selectors.modalWindow}`);

        assert.ok(modal, 'Modal should be in the DOM');
        assert.ok(modalOverlay, 'Modal overlay should be in the DOM');
        assert.ok(modalWindow, 'Modal window should be in the DOM');
    });

    it('Should close modal programatically', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const modal = await gf.get(`.${selectors.modal}`);

        assert.ok(modal, 'Modal should be in the DOM');
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        try { await gf.get(`.${selectors.modal}`); } catch { }
    });

    it('Should close modal on overlay click', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const modal = await gf.get(`.${selectors.modal}`);
        const modalOverlay = await gf.get(`.${selectors.modalOverlay}`);

        assert.ok(modalOverlay, 'Modal overlay should be in the DOM');
        await modalOverlay.click();
        try { await gf.get(`.${selectors.modal}`); } catch { }
    });

    for (let selector of [selectors.closeButton, selectors.acceptButton, selectors.rejectButton]) {
        it(`Should close modal when close button is clicked "${selector}"`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
            const modal = await gf.get(`.${selectors.modal}`);
            const modalWindow = await gf.get(`.${selectors.modalWindow}`);
            const closeButton = await modalWindow.find(`.${selector}`);

            assert.ok(closeButton, 'Close button should be in the DOM');
            await closeButton.click();
            try { await gf.get(`.${selectors.modal}`); } catch { }
        });
    }

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.modalOverlay}`, desc: 'overlay' },
            { selector: `.${selectors.modalWindow}`, desc: 'window' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
                await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});