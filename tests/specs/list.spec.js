const assert = require('assert');
const selectors = require('../shared/list-selectors.json');

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
        assert.equal(listIcons.length, 9, "9 list icons should be rendered")
    });

    it(`Should indent nested list items `, async () => {
        const lists = await gf.getAll(`.${selectors.base}`);
        const listPositions = await Promise.all(
            lists.map(list => list.getPositionOnScreen())
        );

        const xs = listPositions.map(p => p.x);
        const uniqueXs = [...new Set(xs)];

        assert.equal(xs.length, uniqueXs.length, 'All lists have different x positions');
    });

    it(`Should have custom svg icon `, async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        const listIcon = await gf.get(`.${selectors.customIcon}`);

        assert.ok(listIcon, 'New icon renders')
        assert.equal(listIcon.node.nodeName, 'SVG', 'New icon is an SVG')
    });

    describe('bullet', () => {
        it(`renders ordered numbers`, async () => {
            const listIcons = await gf.getAll(`.${selectors.listIcon}`);
            await gf.click(`.${selectors.scenarioBtn}.scenario-0`); // change list type -> ordered

            for (const icon of listIcons) {
                assert.match(
                await icon.text(),
                /^[1-5]\.$/,
                "Icon's text should start with number 1-5 and end with a dot"
                );
            }
        });

        it(`is disc by default`, async () => {
            const listIcon = await gf.get(`.${selectors.listIcon}`);
            const styles = await listIcon.styles();

            assert.equal(styles['border-top-left-radius'], '50% 50%', 'Should be rounded');
            assert.equal(styles['background-color'], 'rgba(255, 255, 255, 1)', 'Should have background-color');
        });

        it(`is square`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
            const listIcon = await gf.get(`.${selectors.listIcon}`);
            const styles = await listIcon.styles();

            assert.equal(styles['border-top-left-radius'], '0px 0px', 'Type should be square');
        });

        it(`is circle`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
            const listIcon = await gf.get(`.${selectors.listIcon}`);
            const styles = await listIcon.styles();

            assert.equal(styles['border-top-left-radius'], '50% 50%', 'Should be rounded');
            assert.equal(styles['border-left-color'], 'rgba(255, 255, 255, 1)', 'Should have border color');
            assert.equal(styles['background-color'], 'rgba(0, 0, 0, 0)', 'No fill');
        });

        it(`is number`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
            const listIcon = await gf.get(`.${selectors.listIcon}`);
            const styles = await listIcon.styles();

            assert.match(await listIcon.text(), /^[1-5]\.$/, 'Icon text should be 1-5.');
            assert.equal(styles['border-left-color'], 'initial', 'No circle border color');
            assert.equal(styles['background-color'], 'rgba(0, 0, 0, 0)', 'No fill');
        });

        it(`is none`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
            const listIcon = await gf.get(`.${selectors.listIcon}`);

            assert.equal(await listIcon.isVisible(), false, 'Icon should be hidden');
        });

        it(`is custom image`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-6`);
            const listIcon = await gf.get(`.${selectors.listIcon}`);
            const styles = await listIcon.styles();

            assert.notEqual(styles['background-image'], 'none', 'Should have a background image');
        });

        it(`has custom bullet-class`, async () => {
            await gf.click(`.${selectors.scenarioBtn}.scenario-7`);
            const listIcon = await gf.get(`.${selectors.listIcon}`);
            const styles = await listIcon.styles();
            const classes = await listIcon.classes();

            assert.equal(styles['background-color'], 'rgba(255, 255, 0, 1)', 'styles update');
            assert.ok(classes.includes(selectors.bulletClass), 'bullet class applied');
        });
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