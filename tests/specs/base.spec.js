const assert = require('assert');

describe('Base', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.base-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should change state on click', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.click')
        await el.click();

        assert.equal(await assertEl.text(), 'click', 'Element\'s text should change');
    })

    it('Should change state on double click', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.double-click')
        await el.doubleClick();

        assert.equal(await assertEl.text(), 'double click', 'Element\'s text should change');
    })

    it('Should change state on focus', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.focus')
        await el.focus();

        assert.equal(await assertEl.text(), 'focus', 'Element\'s text should change');
    })

    it('Should change state on blur', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.focus')
        await el.focus();
        await gf.click('body');

        assert.equal(await assertEl.text(), 'blur', 'Element\'s text should change');
    })

    it('Should change state on mouse down', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.mouse')
        await el.mousePress();

        assert.equal(await assertEl.text(), 'mouse down', 'Element\'s text should change');
    })

    it('Should change state on mouse up', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.mouse')
        await el.mouseRelease();

        assert.equal(await assertEl.text(), 'mouse up', 'Element\'s text should change');
    })

    it('Should change state on mouse enter', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.mouse')
        await el.hover();

        assert.equal(await assertEl.text(), 'mouse enter', 'Element\'s text should change');
    })

    it('Should change state on key down', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.key')
        await el.keyDown('a');

        assert.equal(await assertEl.text(), 'key down', 'Element\'s text should change');
    })

    it('Should change state on key down', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.key')
        await el.keyDown('a');
        await el.keyUp('a');

        assert.equal(await assertEl.text(), 'key up', 'Element\'s text should change');
    })

    it('Should change state on key down', async () => {
        const assertEl = await gf.get('.assertion-element')
        const el = await gf.get('.key-press')
        await el.keyPress('a');

        assert.equal(await assertEl.text(), 'key press', 'Element\'s text should change');
    })

    it('Should apply and change attribute reactively', async () => {
        const el = await gf.get('.attributes');

        const hasAttribute = await el.hasAttribute('tabindex');
        assert.ok(hasAttribute, 'Element should have "tabindex" attribute initially');

        const attribute = await el.getAttribute('tabindex');
        assert.equal(attribute, -1, 'Initial value should be -1');

        await gf.click('.scenario-1');
        const newAttribute = await el.getAttribute('tabindex');
        assert.equal(newAttribute, 0, 'Element\'s attribute should change');
    })

    it('Should change attribute via code', async () => {
        const el = await gf.get('.attributes');
        await el.setAttribute('data-test', 'true');

        const styles = await el.styles();
        assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles should update after attribute has changed');
    })

    it(`should update styles & classes reactively`, async () => {
        const el = await gf.get('.reactivity');
        await gf.click('.scenario-0');

        const styles = await el.styles();
        const classes = await el.classes();

        assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
        assert.ok(classes.includes('reactive'), 'class "reactive" applied');
    });
});