// Opens a tab of the components-e2e view. Accepts the tab name ('accordion')
// or the old link selector ('.accordion-link') the specs pass. The view has no
// tab buttons; it switches on a 'change-tab' event and exposes the current tab
// as data-active-tab, which is checked so a switch sent before the view is
// ready gets retried instead of silently missed.
async function navigateToPage(link) {
    const tab = link.replace(/^\./, '').replace(/-link$/, '');
    await gf.navigate(`http://localhost:3000/components-e2e/`);
    await gf.retryIfFails(async () => {
        await gf.trigger('change-tab', tab);
        const active = await gf.executeScript(() => document.querySelector('[data-active-tab]')?.getAttribute('data-active-tab'));
        if (active !== tab) throw new Error(`Tab "${tab}" is not active (active: "${active}")`);
    }, 5);
}

async function clickEventButton(eventName) {
    return await gf.click(`[data-event="${eventName}"]`);
}

let childQueryCounter = 0;

// Element children of `el`, in order, without text and comment nodes.
// Use this instead of `el.children()`: Solid 2 leaves comment markers between
// dynamic children (e.g. [heading, <!---->, body, <!---->]), so positions from
// `children()` shift, and `children()` itself throws "Node is not an Element"
// on the comments. The children are tagged with a one-off attribute in the page
// and queried back, so the result keeps `first()` / `last()`.
async function elementChildren(el) {
    const attr = `data-e2e-child-${Date.now()}-${childQueryCounter++}`;
    const count = await gf.executeScript((parentId, attrName) => {
        const parent = document.querySelector(`[data-node-id="${parentId}"]`);
        if (!parent) return -1;
        const children = Array.from(parent.children);
        children.forEach((child) => child.setAttribute(attrName, ''));
        return children.length;
    }, String(el.nodeId), attr);

    if (count < 0) throw new Error(`elementChildren: element with node id ${el.nodeId} was not found`);
    if (count === 0) return [];

    return await el.findAll(`[${attr}]`);
}

// Child nodes of `el` as plain data ({ nodeType, nodeName, text }), in order,
// skipping comment nodes (Solid 2 markers) and whitespace-only text. For specs
// that check text-node children, which `elementChildren` leaves out.
async function childNodesInfo(el) {
    const info = await gf.executeScript((parentId) => {
        const parent = document.querySelector(`[data-node-id="${parentId}"]`);
        if (!parent) return null;
        return Array.from(parent.childNodes)
            .filter((node) => node.nodeType !== 8 && !(node.nodeType === 3 && !node.textContent.trim()))
            .map((node) => ({ nodeType: node.nodeType, nodeName: node.nodeName, text: (node.textContent || '').trim() }));
    }, String(el.nodeId));

    if (!info) throw new Error(`childNodesInfo: element with node id ${el.nodeId} was not found`);
    return info;
}

// onChange calls a test view recorded with createOnChangeLog (tests/src/components/onChangeLog.ts):
// every call since the last reset. A callback with several arguments is an array.
async function onChangeCalls(name) {
    const calls = await gf.executeScript((n) => {
        const log = window.__onChangeLogs && window.__onChangeLogs[n];
        return log ? log.calls.slice() : null;
    }, name);

    if (!calls) throw new Error(`onChangeCalls: no onChange log named "${name}" (createOnChangeLog in the test view)`);
    return calls;
}

// The calls made synchronously by the view's last `log.sync()` action (null when none ran).
// A late (effect-based) onChange is missing here even when onChangeCalls shows it later.
async function onChangeSyncCalls(name) {
    return await gf.executeScript((n) => {
        const log = window.__onChangeLogs && window.__onChangeLogs[n];
        return log && log.sync ? log.sync.slice() : null;
    }, name);
}

// Asserts that, once things settle, exactly `expected` calls were recorded since the last reset.
// Waits a little first, so a duplicate that arrives late (from an effect or a frame) is caught.
async function expectOnChangeCalls(name, expected, message) {
    const assert = require('assert');
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.deepEqual(await onChangeCalls(name), expected, message);
}

module.exports = {
    navigateToPage,
    clickEventButton,
    elementChildren,
    childNodesInfo,
    onChangeCalls,
    onChangeSyncCalls,
    expectOnChangeCalls,
}
