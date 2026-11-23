const assert = require('assert');
const expected = require('../shared/attr-forwarding-expected.json');
const events = require('../shared/attr-forwarding-events.json');
const { navigateToPage } = require('../shared/utils');

// Every slot on the page has `class="p-<name>"` and `attr:data-probe="<name>"`.
// Slot attributes must land on the element the slot's class lands on, and on every copy
// when one tag renders several elements (Stepper.Control, Pagination.Item, TextSlider.Pol...).

/** { [probe]: [{ hasClass, tick }] } for every element carrying data-probe. */
async function snapshot() {
    const json = await gf.executeScript(() => {
        const result = {};
        for (const el of document.querySelectorAll('[data-probe]')) {
            const name = el.getAttribute('data-probe');
            if (!result[name]) result[name] = [];
            result[name].push({
                hasClass: (el.getAttribute('class') || '').split(' ').includes(`p-${name}`),
                tick: el.getAttribute('data-tick'),
            });
        }
        return JSON.stringify(result);
    });

    return JSON.parse(json);
}

function assertForwarded(snap, name, count) {
    const elements = snap[name] || [];
    assert.equal(elements.length, count, `"${name}" should put its attributes on ${count} element(s), found ${elements.length}`);

    for (const element of elements) {
        assert.ok(element.hasClass, `"${name}" put its attributes on a different element than its class`);
    }
}

async function assertGroupForwarded(group) {
    await gf.retryIfFails(async () => {
        const snap = await snapshot();
        for (const [name, count] of Object.entries(group)) assertForwarded(snap, name, count);
    }, 5);
}

describe('Attribute forwarding', function () {
    this.beforeAll(async () => {
        await navigateToPage('attr-forwarding');
    });

    for (const [name, count] of Object.entries(expected.onLoad)) {
        it(`${name} forwards attr:* to the element its class lands on`, async () => {
            assertForwarded(await snapshot(), name, count);
        });
    }

    it('Segment.Indicator forwards attr:* once the selection changes', async () => {
        await gf.click('.segment-b');
        await assertGroupForwarded(expected.afterSegmentChange);
    });

    it('Modal slots forward attr:* when the modal is open', async () => {
        await gf.trigger(events.openModal);
        try {
            await assertGroupForwarded(expected.modalOpen);
        } finally {
            await gf.trigger(events.closeModal);
        }
    });

    it('Tutorial.Overlay forwards attr:* when the tutorial is running', async () => {
        await gf.trigger(events.startTutorial);
        try {
            await assertGroupForwarded(expected.tutorialActive);
        } finally {
            await gf.trigger(events.exitTutorial);
        }
    });

    it('Should update forwarded attributes reactively', async () => {
        await gf.trigger(events.tick);

        await gf.retryIfFails(async () => {
            const snap = await snapshot();
            const stale = Object.entries(snap)
                .filter(([, elements]) => elements.some((element) => element.tick !== '1'))
                .map(([name]) => name);

            assert.deepEqual(stale, [], `data-tick should be "1" everywhere, stale: ${stale.join(', ')}`);
        }, 5);
    });
});
