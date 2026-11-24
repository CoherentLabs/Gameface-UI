const assert = require('assert');
const { navigateToPage } = require('../shared/utils');

const activeId = () => gf.executeScript(() => document.activeElement && document.activeElement.getAttribute('data-gf-id'));

describe('Flow runtime: root swap', function () {
    this.beforeAll(async () => {
        await navigateToPage('flow-swap');
        await gf.sleep(300);
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it("Navigation keeps working after the root element is replaced", async () => {
        await gf.click('.flow-swap-toggle');
        // The new root wires one frame after it mounts; its area registers a frame after that.
        await gf.sleep(300);
        assert.ok(await gf.get('.flow-swap-b'), 'the new root is mounted');

        await gf.executeScript(() => document.querySelector('.flow-swap-b1').focus());
        await gf.keyPress(gf.KEYS.ARROW_RIGHT);
        await gf.sleep(100);
        assert.equal(await activeId(), 'swapb2');
        await gf.keyPress(gf.KEYS.ARROW_RIGHT);
        await gf.sleep(100);
        assert.equal(await activeId(), 'swapb1');
    });
});
