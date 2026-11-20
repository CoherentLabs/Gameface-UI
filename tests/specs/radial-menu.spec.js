const assert = require('assert');
const events = require('../shared/radialMenu/radial-menu-events.json');
const selectors = require('../shared/radialMenu/radial-menu-selectors.json');
const items = require('../shared/radialMenu/radial-menu-item-ids.json');
const { navigateToPage, clickEventButton, elementChildren, onChangeSyncCalls, expectOnChangeCalls } = require('../shared/utils');

describe('Radial Menu', function () {
    this.beforeAll(async () => {
        await navigateToPage('.radial-menu-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    // First test: nothing has run yet, so the log only has what happened while mounting.
    it('Should not call onChange on mount', async () => {
        await expectOnChangeCalls('radial-menu', [], 'The initial selection is not reported');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const radialMenu = await gf.get(`.${selectors.radialMenu}`);
        const menuContent = await radialMenu.find(`.${selectors.menuContent}`);
        const indicator = await radialMenu.find(`.${selectors.menuIndicator}`);
        const icon = await radialMenu.find(`.${selectors.menuIcon}`);
        const selector = await radialMenu.find(`.${selectors.menuSelector}`);
        const menuItems = await radialMenu.findAll(`.${selectors.menuItem}`);

        assert.ok(radialMenu, 'Radial Menu should be in the DOM');
        assert.ok(menuContent, 'Menu content should be in the DOM');
        assert.ok(indicator, 'Menu Indicator should be in the DOM');
        assert.ok(icon, 'Menu Icon should be in the DOM');
        assert.ok(selector, 'Menu Selector should be in the DOM');
        assert.ok(menuItems && menuItems.length === items.length, `${items.length} Menu Items should be in the DOM`);
    })

    it('Should close and open the menu', async () => {
        const radialMenu = await gf.get(`.${selectors.radialMenu}`);

        await clickEventButton(events["close-menu"]);
        assert.equal(await radialMenu.isVisible(), false, 'Radial Menu should not be visible');

        await clickEventButton(events["open-menu"]);
        assert.equal(await radialMenu.isVisible(), true, 'Radial Menu should be visible again');
    });

    it('Selected item should not change after closing and opening the menu', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await clickEventButton(events["select-item"]);

        await clickEventButton(events["close-menu"]);
        await clickEventButton(events["open-menu"]);

        assert.equal(await assertionEl.text(), items[1], 'Second item should still be selected');  
    });

    it('Should change gap between items', async () => {
        const styles = await gf.getStyles(`.${selectors.menuSelector}`);
        await clickEventButton(events["change-gap"]);
        const newStyles = await gf.getStyles(`.${selectors.menuSelector}`);

        assert.notEqual(styles['clip-path'], newStyles['clip-path'], 'Clip path should change when gap changes');
    });
    
    it('Should react to items changing with onItemChanged callback', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await clickEventButton(events["change-items"]);
        assert.equal(await assertionEl.text(), 'item-changed', 'Item changed callback should be called on items change');
    });

    it('Should change properties after items\' lenght changes', async () => {
        const menuItems = await gf.getAll(`.${selectors.menuItem}`);
        const styles = await gf.getStyles(`.${selectors.menuSelector}`);

        await clickEventButton(events["change-items"]);
        const newStyles = await gf.getStyles(`.${selectors.menuSelector}`);
        const newMenuItems = await gf.getAll(`.${selectors.menuItem}`);
        
        assert.notEqual(menuItems.length, newMenuItems.length, 'Number of items should change');
        assert.notEqual(styles['clip-path'], newStyles['clip-path'], 'Clip path should change when when items change');
    });

    it('Should correctly rotate the indicator', async () => {
        const menuContent = await gf.get(`.${selectors.menuContent}`);
        const children = await elementChildren(menuContent);
        const indicatorWrapper = children[children.length - 1]; // The element that is rotated

        await clickEventButton(events["change-items"]); // Change items to 4 to have a clear 90 degree rotation
        await clickEventButton(events["select-item"]); // Select second item to have a clear 90 degree rotation
        
        const styles = await indicatorWrapper.styles();
        assert.equal(styles.transform, 'rotateZ(90deg)', 'Indicator should be rotated 90 degrees');
    });

    it('Should replace icon with a custom one', async () => {
        const menuContent = await gf.get(`.${selectors.menuContent}`);
        await clickEventButton(events["set-custom-icon"]);
        const newIcon = await menuContent.find(`.${selectors.customIcon}`);
        
        assert.ok(newIcon, 'Custom icon should be in the DOM')
    });

    it('Should change item\'s offset', async () => {
        const menuItem = await gf.get(`.${selectors.menuItem}`)
        const children = await elementChildren(menuItem);
        await clickEventButton(events["change-item-offset"]);
        
        const itemContentWrapper = children[children.length - 1]; // offset is applied to this element
        const styles = await itemContentWrapper.styles();
        assert.equal(styles['padding-top'], '2vmax', 'The new offset should be 2vmax')
    });

    describe("Selected item", () => {
        const cases = ['by mouse', 'by index', 'by vector'];

        for (let i = 0; i < cases.length; i++) {
            it(`Should change - ${cases[i]}`, async () => {
                const menuItems = await gf.getAll(`.${selectors.menuItem}`);
                const assertionEl = await gf.get(`.${selectors.assertionElement}`);

                switch (cases[i]) {
                    case 'by mouse':
                        // move mouse to first item
                        await gf.mouseMove(1000, 100);
                        break;
                    case 'by index':
                        await clickEventButton(events["select-item"]);
                        break;
                    case 'by vector':
                        await clickEventButton(events["select-by-vector"]);
                        break;
                }

                const selectedItemStyles = await menuItems[1].styles();
                const selectedItemClasses = await menuItems[1].classes();

                assert.equal(await assertionEl.text(), items[1], 'Second item should be selected');        
                assert.ok(selectedItemClasses.includes(selectors.menuItemSelected), 'Item should have selected class');
                assert.equal(selectedItemStyles['background-color'], 'rgba(0, 0, 0, 0.1)', 'Item should have selected styles applied');      
            });
        }
    })

    describe("Item selection should be disabled when menu is closed", () => {
        const cases = ['by mouse', 'by index', 'by vector'];

        for (let i = 0; i < cases.length; i++) {
            it(`Should not be able to change item if the menu is closed - ${cases[i]}`, async () => {
                await clickEventButton(events["close-menu"]);
                const assertionEl = await gf.get(`.${selectors.assertionElement}`);

                switch (cases[i]) {
                    case 'by mouse':
                        // move mouse to first item
                        await gf.mouseMove(1000, 100);
                        break;
                    case 'by index':
                        await clickEventButton(events["select-item"]);
                        break;
                    case 'by vector':
                        await clickEventButton(events["select-by-vector"]);
                        break;
                }

                assert.equal(await assertionEl.text(), items[0], 'First item should still be selected');        
            });
        }
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.radialMenu}`, desc: 'root' },
            { selector: `.${selectors.menuItem}`, desc: 'item' },
            { selector: `.${selectors.menuIndicator}`, desc: 'indicator' },
            { selector: `.${selectors.menuIcon}`, desc: 'icon' },
            { selector: `.${selectors.menuContent}`, desc: 'content' },
            { selector: `.${selectors.menuSelector}`, desc: 'selector' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await clickEventButton(events["change-styles"]);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                if (selector === `.${selectors.menuItem}`) {
                    assert.equal(styles['background-color'], 'rgba(0, 0, 0, 0.1)', 'styles update');
                } else {
                    assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                }
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});

describe('RadialMenu onChange calls', function () {
    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should call onChange synchronously from the ref (by index)', async () => {
        await clickEventButton(events["select-item"]);
        assert.deepEqual(await onChangeSyncCalls('radial-menu'), [items[1]], 'onChange fired before selectByIndex returned');
        await expectOnChangeCalls('radial-menu', [items[1]], 'No late duplicate');
    })

    it('Should call onChange synchronously from the ref (by vector)', async () => {
        await clickEventButton(events["select-by-vector"]);
        assert.deepEqual(await onChangeSyncCalls('radial-menu'), [items[1]], 'onChange fired before selectByVector returned');
        await expectOnChangeCalls('radial-menu', [items[1]], 'No late duplicate');
    })

    it('Should not call onChange when selecting the selected item', async () => {
        await gf.trigger('radialMenuSelectSame');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('radial-menu'), [], 'selectByIndex with the current index');
        })
        await expectOnChangeCalls('radial-menu', [], 'No call at all');
    })

    it('Should call onChange once when the same item is selected twice', async () => {
        await gf.trigger('radialMenuSelectTwice');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('radial-menu'), [items[2]], 'selectByIndex(2) twice');
        })
        await expectOnChangeCalls('radial-menu', [items[2]], 'One call');
    })

    it('Should not call onChange for an index out of range', async () => {
        await gf.trigger('radialMenuSelectOutOfRange');
        await gf.retryIfFails(async () => {
            assert.deepEqual(await onChangeSyncCalls('radial-menu'), [], 'The action ran and reported nothing');
        })
        await expectOnChangeCalls('radial-menu', [], 'selectByIndex(99) is ignored');
    })

    it('Should call onChange once while the mouse moves over the same item', async () => {
        // reset's selectByIndex ignores the mouse for 100 ms
        await new Promise((resolve) => setTimeout(resolve, 150));
        await gf.mouseMove(1000, 100);
        await gf.mouseMove(1005, 100);
        await gf.mouseMove(1000, 105);
        await expectOnChangeCalls('radial-menu', [items[1]], 'Moves inside one item report it once');
    })

    it('Should not call onChange when the menu is closed', async () => {
        await clickEventButton(events["close-menu"]);
        await clickEventButton(events["select-item"]);
        await clickEventButton(events["select-by-vector"]);
        await expectOnChangeCalls('radial-menu', [], 'A closed menu ignores selection');
    })

    it('Should not call onChange when the items change', async () => {
        await clickEventButton(events["change-items"]);
        await expectOnChangeCalls('radial-menu', [], 'onItemChanged is called instead');
    })
});
