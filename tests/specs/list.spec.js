const assert = require('assert');
const selectors = require('../shared/list-selectors.json');
const { constrainedMemory } = require('process');

describe('List', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.click('.list-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it(`Should render correctly`, async () => {
        const lists = await gf.getAll(`.${selectors.base}`);
        const listItems = await gf.getAll(`.${selectors.listItem}`);
        const listIcons = await gf.getAll(`.${selectors.listIcon}`);

        assert.equal(lists.length, 3, "3 Lists should be rendered")
        assert.equal(listItems.length, 9, "9 list items should be rendered")
        assert.equal(listIcons.length, 7, "7 list icons should be rendered")
    });

    it(`Should indent nested list items `, async () => {
        const lists = await gf.getAll(`.${selectors.base}`);
        const listPositions = await Promise.all(
            lists.map(list => list.getPositionOnScreen())
        );

        const xs = listPositions.map(p => p.x);
        const uniqueXs = [...new Set(xs)];

        assert.deepEqual(xs, uniqueXs, 'All lists have different x positions');
    });

    it(`Should change and render an ordered list `, async () => {
        const listIcons = await gf.getAll(`.${selectors.listIcon}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);

        for (const icons of listIcons) {
            assert.match(await icons.text(), /^[1-5]\.$/, 'Icon\'s text should start with number 1-5 and end with a dot')
        }
    });

    it(`Should have custom svg icon `, async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        const listIcon = await gf.get(`.${selectors.customIcon}`);

        assert.ok(listIcon, 'New icon renders')
        assert.equal(listIcon.node.nodeName, 'SVG', 'New icon is an SVG')
    });
 
    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.base}`, desc: 'list' },
            { selector: `.${selectors.listItem}`, desc: 'list item' },
            { selector: `.${selectors.listIcon}`, desc: 'List icon' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.base}`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});