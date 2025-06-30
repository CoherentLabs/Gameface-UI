const assert = require('assert');

['absolute', 'relative'].forEach((type) => {
  describe(type.charAt(0).toUpperCase() + type.slice(1), function () {
    const linkSelector = `.${type}-link`;
    const compSelector = `.${type}`;

    this.beforeAll(async () => {
      await gf.navigate(`http://localhost:3000/components-e2e/`);
      await gf.click(linkSelector);
    });

    this.afterEach(async () => {
      await gf.trigger('reset');
    });

    it('Should change position based on signal', async () => {
      const el = await gf.get(compSelector);
      const orig = await el.getPositionOnScreen();

      await gf.click('.scenario-0');
      await gf.retryIfFails(async () => {
        const moved = await el.getPositionOnScreen();
        assert.notEqual(orig.x, moved.x, 'X should change');
        assert.notEqual(orig.y, moved.y, 'Y should change');
      });
    });

    it('Should update styles & classes reactively on props change', async () => {
      const el = await gf.get(compSelector);
      await el.click();

      const styles = await el.styles();
      const classes = await el.classes();

      assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'background-color should update');
      assert.ok(classes.includes('reactive'), 'reactive class applied');
    });
  });
});