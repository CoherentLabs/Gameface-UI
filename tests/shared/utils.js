async function navigateToPage(link) {
    await gf.navigate(`http://localhost:3000/components-e2e/`);
    await gf.retryIfFails(async () => await gf.click(link), 5);
}

module.exports = {
    navigateToPage
}