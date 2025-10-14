async function navigateToPage(link) {
    await gf.navigate(`http://localhost:3000/components-e2e/`);
    await gf.sleep(1000);
    await gf.retryIfFails(async () => await gf.click(link), 5);
}

async function clickEventButton(eventName) {
    return await gf.click(`[data-event="${eventName}"]`);
}

module.exports = {
    navigateToPage,
    clickEventButton
}