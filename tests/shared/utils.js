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

module.exports = {
    navigateToPage,
    clickEventButton
}
