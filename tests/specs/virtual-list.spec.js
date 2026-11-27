const assert = require('assert');
const selectors = require('../shared/virtual-list-selectors.json');
const { navigateToPage } = require('../shared/utils');

// Keep in sync with tests/src/components/VirtualList/VirtualListTest.tsx
const ITEM_COUNT = 10;
const START = 2;
const PAGE = 3;

/** The rows of one list, as { id, uid, index, marker, text } */
async function rows(target) {
    return gf.executeScript((listSelector, rowSelector) => {
        const list = document.querySelector(listSelector);
        if (!list) return [];
        return [...list.querySelectorAll(rowSelector)].map((el) => ({
            id: Number(el.getAttribute('data-id')),
            uid: el.getAttribute('data-uid'),
            index: Number(el.getAttribute('data-index')),
            marker: Number(el.getAttribute('data-vl-index')),
            text: el.textContent.trim(),
        }));
    }, `.${selectors[target]}`, `.${selectors.row}`);
}

const ids = async (target) => (await rows(target)).map((r) => r.id);
const range = (from, to) => Array.from({ length: to - from }, (_, i) => from + i);

const setProps = (detail) => gf.trigger('vl-props', detail);
const setItems = (detail) => gf.trigger('vl-items', detail);
const refSet = (target, name, value) => gf.trigger('vl-ref', { target, name, value });
const refCall = (target, name) => gf.trigger('vl-ref', { target, name });
async function readRef(target) {
    await gf.trigger('vl-read-ref', { target });
    return JSON.parse(await gf.executeScript(() => document.body.getAttribute('data-vl-ref')));
}

describe('VirtualList', function () {
    this.beforeAll(async () => {
        await navigateToPage('.virtual-list-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    describe('Native parity', () => {
        it('Should render nothing without a pageSize', async () => {
            assert.equal((await rows('defaults')).length, 0, 'pageSize defaults to 0');
        });

        it('Should render pageSize items from startIndex, with absolute indexes', async () => {
            for (const target of ['keyed', 'unkeyed']) {
                const list = await rows(target);
                assert.deepEqual(list.map((r) => r.id), [2, 3, 4], `${target}: items 2, 3, 4`);
                assert.deepEqual(list.map((r) => r.index), [2, 3, 4], `${target}: index is absolute`);
                assert.deepEqual(list.map((r) => r.marker), [2, 3, 4], `${target}: data-vl-index is absolute`);
            }
        });

        it('Should render only the remaining items past the end', async () => {
            await setProps({ start: 8 });
            assert.deepEqual(await ids('keyed'), [8, 9]);
            await setProps({ start: ITEM_COUNT });
            assert.deepEqual(await ids('keyed'), [], 'A start at the end renders nothing');
            await setProps({ start: 20 });
            assert.deepEqual(await ids('keyed'), [], 'A start past the end renders nothing');
        });

        it('Should truncate fractional values and clamp negative ones to 0', async () => {
            await setProps({ start: 2.7, page: 2.9 });
            assert.deepEqual(await ids('keyed'), [2, 3], 'Values are truncated');
            await setProps({ start: -2 });
            assert.deepEqual(await ids('keyed'), [0, 1], 'A negative start is clamped to 0');
        });
    });

    describe('Props', () => {
        it('Should re-render the slice when startIndex or pageSize change', async () => {
            await setProps({ start: 5 });
            assert.deepEqual(await ids('keyed'), [5, 6, 7]);
            await setProps({ page: 1 });
            assert.deepEqual(await ids('keyed'), [5]);
            await setProps({ page: 0 });
            assert.deepEqual(await ids('keyed'), [], 'pageSize 0 renders nothing');
        });

        it('Should keep the rows still in the slice when startIndex moves by 1', async () => {
            for (const target of ['keyed', 'unkeyed']) {
                const before = await rows(target);
                await setProps({ start: START + 1 });
                const after = await rows(target);
                assert.deepEqual(after.map((r) => r.id), [3, 4, 5], target);
                assert.deepEqual(after.slice(0, 2).map((r) => r.uid), before.slice(1).map((r) => r.uid), `${target}: rows 3 and 4 are kept`);
                assert.deepEqual(after.map((r) => r.index), [3, 4, 5], `${target}: indexes update`);
                await setProps({ start: START });
            }
        });
    });

    describe('Changing the shown items', () => {
        /** { id: uid } of the rows of a list */
        const uidOf = async (target) => Object.fromEntries((await rows(target)).map((r) => [r.id, r.uid]));

        it('Growing the page size keeps the shown rows and adds rows after them', async () => {
            const before = await uidOf('keyed');
            await setProps({ page: 5 });
            assert.deepEqual(await ids('keyed'), [2, 3, 4, 5, 6]);
            const after = await uidOf('keyed');
            for (const id of [2, 3, 4]) assert.equal(after[id], before[id], `Row ${id} is kept`);
        });

        it('Shrinking the page size removes rows from the end only', async () => {
            const before = await uidOf('keyed');
            await setProps({ page: 2 });
            assert.deepEqual(await ids('keyed'), [2, 3]);
            const after = await uidOf('keyed');
            for (const id of [2, 3]) assert.equal(after[id], before[id], `Row ${id} is kept`);
        });

        it('Jumping to a page with no overlap replaces every row', async () => {
            const before = Object.values(await uidOf('keyed'));
            await setProps({ start: 7 });
            const after = await rows('keyed');
            assert.deepEqual(after.map((r) => r.id), [7, 8, 9]);
            assert.ok(after.every((r) => !before.includes(r.uid)), 'Every row is new');
            assert.deepEqual(after.map((r) => r.index), [7, 8, 9], 'Rows get their absolute indexes');
        });

        it('Moving the start index back by 1 keeps the rows still on the page', async () => {
            for (const target of ['keyed', 'unkeyed']) {
                const before = await uidOf(target);
                await setProps({ start: START - 1 });
                assert.deepEqual(await ids(target), [1, 2, 3], target);
                const after = await uidOf(target);
                for (const id of [2, 3]) assert.equal(after[id], before[id], `${target}: row ${id} is kept`);
                assert.ok(!Object.values(before).includes(after[1]), `${target}: item 1 gets a new row`);
                await setProps({ start: START });
            }
        });

        it('Inserting an item before the page shifts the shown items, and rows follow their items', async () => {
            const before = await uidOf('keyed');
            await setItems({ ids: [100, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });
            const after = await rows('keyed');
            assert.deepEqual(after.map((r) => r.id), [1, 2, 3], 'The page now starts one item earlier in the old order');
            const uids = Object.fromEntries(after.map((r) => [r.id, r.uid]));
            for (const id of [2, 3]) assert.equal(uids[id], before[id], `Item ${id} keeps its row`);
            assert.ok(!Object.values(before).includes(uids[1]), 'Item 1 gets a new row');
            assert.deepEqual(after.map((r) => r.index), [2, 3, 4], 'Indexes follow the new positions');
        });

        it('Removing an item on the page brings in the next item', async () => {
            const before = await uidOf('keyed');
            await setItems({ ids: [0, 1, 2, 4, 5, 6, 7, 8, 9] });
            const after = await rows('keyed');
            assert.deepEqual(after.map((r) => r.id), [2, 4, 5]);
            const uids = Object.fromEntries(after.map((r) => [r.id, r.uid]));
            for (const id of [2, 4]) assert.equal(uids[id], before[id], `Item ${id} keeps its row`);
            assert.ok(!Object.values(before).includes(uids[5]), 'Item 5 gets a new row');
        });

        it('Unkeyed: moving the start index by 1 keeps the rows whose index stays on the page', async () => {
            const before = await rows('unkeyed');
            await setProps({ start: START + 1 });
            const after = await rows('unkeyed');
            assert.deepEqual(after.map((r) => r.index), [3, 4, 5]);
            assert.deepEqual(after.slice(0, 2).map((r) => r.uid), before.slice(1).map((r) => r.uid), 'Rows at indexes 3 and 4 are kept');
            assert.ok(!before.map((r) => r.uid).includes(after[2].uid), 'Index 5 gets a new row');
        });

        it('Shrinking the list below the start index renders no rows', async () => {
            await setItems({ ids: [0, 1] });
            assert.deepEqual(await ids('keyed'), [], 'No item is at or after the start index');
            assert.deepEqual(await ids('unkeyed'), [], 'Unkeyed too');
            const fallback = await gf.executeScript((sel) => document.querySelectorAll(sel).length, `.${selectors.fallback}`);
            assert.equal(fallback, 0, 'The list is not empty, so the fallback is not shown');
        });
    });

    describe('Ref', () => {
        it('Should read startIndex, pageSize and length', async () => {
            assert.deepEqual(await readRef('keyed'), { startIndex: START, pageSize: PAGE, length: ITEM_COUNT });
        });

        it('Should re-render when startIndex or pageSize are set', async () => {
            await refSet('keyed', 'startIndex', 6);
            assert.deepEqual(await ids('keyed'), [6, 7, 8]);
            await refSet('keyed', 'pageSize', 2);
            assert.deepEqual(await ids('keyed'), [6, 7]);
            assert.deepEqual(await ids('unkeyed'), [2, 3, 4], 'Other lists are not affected');
        });

        it('Should page with nextPage and prevPage, and stop at both ends', async () => {
            await refCall('keyed', 'nextPage');
            assert.deepEqual(await ids('keyed'), [5, 6, 7]);
            await refCall('keyed', 'nextPage');
            assert.deepEqual(await ids('keyed'), [8, 9]);
            await refCall('keyed', 'nextPage');
            assert.deepEqual(await ids('keyed'), [8, 9], 'nextPage stops at the last page');
            await refCall('keyed', 'prevPage');
            await refCall('keyed', 'prevPage');
            assert.deepEqual(await ids('keyed'), [2, 3, 4]);
            await refCall('keyed', 'prevPage');
            assert.deepEqual(await ids('keyed'), [0, 1, 2], 'prevPage does not go below 0');
        });

        it('Should let a prop change override a value set through the ref', async () => {
            await refSet('keyed', 'startIndex', 7);
            assert.deepEqual(await ids('keyed'), [7, 8, 9]);
            await setProps({ start: 4 });
            assert.deepEqual(await ids('keyed'), [4, 5, 6], 'The prop wins after it changes');
        });

        it('Moving the page through the ref reports the new start index', async () => {
            const bound = () => gf.executeScript((sel) => {
                const el = document.querySelector(sel);
                return { start: Number(el.getAttribute('data-start')), page: Number(el.getAttribute('data-page')) };
            }, `.${selectors.bound}`);
            assert.deepEqual(await ids('bound'), [2, 3, 4], 'The list starts at the bound startIndex');

            await refCall('bound', 'nextPage');
            assert.deepEqual(await ids('bound'), [5, 6, 7]);
            assert.deepEqual(await bound(), { start: 5, page: PAGE }, 'nextPage reports the new start index');

            await gf.trigger('vl-bound', { start: START });
            assert.deepEqual(await ids('bound'), [2, 3, 4], 'Setting the binding back to its old value moves the list');

            await refSet('bound', 'pageSize', 2);
            assert.deepEqual(await bound(), { start: START, page: 2 }, 'Setting pageSize through the ref reports it');
        });
    });

    describe('Data', () => {
        it('Changing one item of an unkeyed list updates only that row', async () => {
            const state = () => gf.executeScript((sel) => {
                const el = document.querySelector(sel);
                return {
                    recomputes: Number(el.getAttribute('data-recomputes')),
                    texts: [...el.children].map((row) => row.textContent.trim()),
                };
            }, `.${selectors.plain}`);
            const before = await state();
            assert.deepEqual(before.texts, ['0', '1', '2', '3', '4'], 'Every row renders its item');

            await gf.trigger('vl-plain', { index: 2, value: 99 });
            const after = await state();
            assert.deepEqual(after.texts, ['0', '1', '99', '3', '4'], 'The changed row shows its new item');
            assert.equal(after.recomputes - before.recomputes, 1, 'Only the changed row recomputes its item');
        });

        it('Keyed: should keep row elements across insert, removal and reorder', async () => {
            const uidOf = async () => Object.fromEntries((await rows('keyed')).map((r) => [r.id, r.uid]));
            const before = await uidOf();

            await setItems({ ids: [0, 1, 100, 2, 3, 4, 5, 6, 7, 8, 9] });
            assert.deepEqual(await ids('keyed'), [100, 2, 3], 'Insert shifts the slice');
            const afterInsert = await uidOf();
            assert.equal(afterInsert[2], before[2], 'Item 2 keeps its element');
            assert.equal(afterInsert[3], before[3], 'Item 3 keeps its element');

            await setItems({ ids: [0, 1, 3, 2, 4, 5, 6, 7, 8, 9] });
            assert.deepEqual(await ids('keyed'), [3, 2, 4], 'Removal and reorder update the slice');
            const afterReorder = await uidOf();
            assert.equal(afterReorder[2], before[2], 'Item 2 keeps its element after the reorder');
            assert.equal(afterReorder[3], before[3], 'Item 3 keeps its element after the reorder');
            assert.deepEqual((await rows('keyed')).map((r) => r.index), [2, 3, 4], 'Indexes follow the new positions');
        });

        it('Keyed: should update field changes in place', async () => {
            const before = await rows('keyed');
            await setItems({ ids: range(0, ITEM_COUNT), suffix: '!' });
            const after = await rows('keyed');
            assert.deepEqual(after.map((r) => r.text), ['item2!', 'item3!', 'item4!']);
            assert.deepEqual(after.map((r) => r.uid), before.map((r) => r.uid), 'Rows are kept');
        });

        it('Unkeyed: should keep rows by position and update their data in place', async () => {
            const before = await rows('unkeyed');
            await setItems({ ids: [0, 1, 9, 8, 7, 6, 5, 4, 3, 2] });
            const after = await rows('unkeyed');
            assert.deepEqual(after.map((r) => r.id), [9, 8, 7], 'Rows show the items now at those positions');
            assert.deepEqual(after.map((r) => r.uid), before.map((r) => r.uid), 'Rows are kept');
            assert.deepEqual(after.map((r) => r.index), [2, 3, 4], 'Indexes stay the same');
        });

        it('Should remove rows past a new, shorter end', async () => {
            await setItems({ ids: range(0, 4) });
            assert.deepEqual(await ids('keyed'), [2, 3]);
            assert.deepEqual(await ids('unkeyed'), [2, 3]);
            await setItems({ ids: range(0, 2) });
            assert.deepEqual(await ids('keyed'), [], 'No stale rows');
            assert.deepEqual(await ids('unkeyed'), [], 'No stale rows');
        });

        it('Should render the fallback only when the list is empty', async () => {
            const hasFallback = () => gf.executeScript((sel) => !!document.querySelector(sel), `.${selectors.fallback}`);
            await setProps({ start: 20 });
            assert.equal(await hasFallback(), false, 'An empty slice of a non-empty list has no fallback');
            await setItems({ ids: [] });
            assert.equal(await hasFallback(), true, 'An empty list shows the fallback');
            await setItems({ ids: [1] });
            assert.equal(await hasFallback(), false, 'The fallback is removed when items arrive');
        });
    });
});
