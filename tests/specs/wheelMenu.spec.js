const assert = require('assert');
const events = require('../shared/wheelMenu/wheel-menu-events.json');
const selectors = require('../shared/wheelMenu/wheel-menu-selectors.json');
const items = require('../shared/wheelMenu/wheel-item-ids.json');
const { navigateToPage, clickEventButton } = require('../shared/utils');

describe('Wheel Menu', function () {
    this.beforeAll(async () => {
        await navigateToPage('.wheel-menu-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render itself and it\'s children correctly', async () => {
        const wheelMenu = await gf.get(`.${selectors.wheelMenu}`);
        const wheelInner = await wheelMenu.find(`.${selectors.wheelInner}`);
        const indicator = await wheelMenu.find(`.${selectors.wheelIndicator}`);
        const icon = await wheelMenu.find(`.${selectors.wheelIcon}`);
        const selector = await wheelMenu.find(`.${selectors.wheelSelector}`);
        const wheelItems = await wheelMenu.findAll(`.${selectors.wheelItem}`);

        assert.ok(wheelMenu, 'Wheel Menu should be in the DOM');
        assert.ok(wheelInner, 'Wheel Inner should be in the DOM');
        assert.ok(indicator, 'Wheel Indicator should be in the DOM');
        assert.ok(icon, 'Wheel Icon should be in the DOM');
        assert.ok(selector, 'Wheel Selector should be in the DOM');
        assert.ok(wheelItems && wheelItems.length === items.length, `${items.length} Wheel Items should be in the DOM`);
    })

    it('Should close and open the menu', async () => {
        const wheelMenu = await gf.get(`.${selectors.wheelMenu}`);

        await clickEventButton(events["close-menu"]);
        assert.equal(await wheelMenu.isVisible(), false, 'Wheel Menu should not be visible');

        await clickEventButton(events["open-menu"]);
        assert.equal(await wheelMenu.isVisible(), true, 'Wheel Menu should be visible again');
    });

    it('Selected item should not change after closing and opening the menu', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await clickEventButton(events["select-item"]);

        await clickEventButton(events["close-menu"]);
        await clickEventButton(events["open-menu"]);

        assert.equal(await assertionEl.text(), items[1], 'Second item should still be selected');  
    });

    it('Should change gap between items', async () => {
        const styles = await gf.getStyles(`.${selectors.wheelSelector}`);
        await clickEventButton(events["change-gap"]);
        const newStyles = await gf.getStyles(`.${selectors.wheelSelector}`);

        assert.notEqual(styles['clip-path'], newStyles['clip-path'], 'Clip path should change when gap changes');
    });
    
    it('Should react to items changing with onItemChanged callback', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await clickEventButton(events["change-items"]);
        assert.equal(await assertionEl.text(), 'item-changed', 'Item changed callback should be called on items change');
    });

    it('Should change properties after items\' lenght changes', async () => {
        const wheelItems = await gf.getAll(`.${selectors.wheelItem}`);
        const styles = await gf.getStyles(`.${selectors.wheelSelector}`);

        await clickEventButton(events["change-items"]);
        const newStyles = await gf.getStyles(`.${selectors.wheelSelector}`);
        const newWheelItems = await gf.getAll(`.${selectors.wheelItem}`);
        
        assert.notEqual(wheelItems.length, newWheelItems.length, 'Number of items should change');
        assert.notEqual(styles['clip-path'], newStyles['clip-path'], 'Clip path should change when when items change');
    });

    it('Should correctly rotate the indicator', async () => {
        const innerWheel = await gf.get(`.${selectors.wheelInner}`);
        const children = await innerWheel.children();
        const indicatorWrapper = children[children.length - 1]; // The element that is rotated

        await clickEventButton(events["change-items"]); // Change items to 4 to have a clear 90 degree rotation
        await clickEventButton(events["select-item"]); // Select second item to have a clear 90 degree rotation
        
        const styles = await indicatorWrapper.styles();
        assert.equal(styles.transform, 'rotateZ(90deg)', 'Indicator should be rotated 90 degrees');
    });

    it('Should replace icon with a custom one', async () => {
        const innerWheel = await gf.get(`.${selectors.wheelInner}`)
        await clickEventButton(events["set-custom-icon"]);
        const newIcon = await innerWheel.find(`.${selectors.customIcon}`);
        
        assert.ok(newIcon, 'Custom icon should be in the DOM')
    });

    it('Should change item\'s offset', async () => {
        const wheelItem = await gf.get(`.${selectors.wheelItem}`)
        const children = await wheelItem.children();
        await clickEventButton(events["change-item-offset"]);
        
        const itemContentWrapper = children[children.length - 1]; // offset is applied to this element
        const styles = await itemContentWrapper.styles();
        assert.equal(styles['padding-top'], '2vmax', 'The new offset should be 2vmax')
    });

    describe("Selected item", () => {
        const cases = ['by mouse', 'by index', 'by vector'];

        for (let i = 0; i < cases.length; i++) {
            it(`Should change - ${cases[i]}`, async () => {
                const wheelItems = await gf.getAll(`.${selectors.wheelItem}`);
                const assertionEl = await gf.get(`.${selectors.assertionElement}`);

                switch (cases[i]) {
                    case 'by mouse':
                        // move mouse to first item
                        await gf.moveMouse(1000, 100);
                        break;
                    case 'by index':
                        await clickEventButton(events["select-item"]);
                        break;
                    case 'by vector':
                        await clickEventButton(events["select-by-vector"]);
                        break;
                }

                const selectedItemStyles = await wheelItems[1].styles();
                const selectedItemClasses = await wheelItems[1].classes();

                assert.equal(await assertionEl.text(), items[1], 'Second item should be selected');        
                assert.ok(selectedItemClasses.includes(selectors.wheelItemSelected), 'Item should have selected class');
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
                        await gf.moveMouse(1000, 100);
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
            { selector: `.${selectors.wheelMenu}`, desc: 'root' },
            { selector: `.${selectors.wheelItem}`, desc: 'item' },
            { selector: `.${selectors.wheelIndicator}`, desc: 'indicator' },
            { selector: `.${selectors.wheelIcon}`, desc: 'icon' },
            { selector: `.${selectors.wheelInner}`, desc: 'inner-wheel' },
            { selector: `.${selectors.wheelSelector}`, desc: 'selector' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await clickEventButton(events["change-styles"]);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();
                if (selector === `.${selectors.wheelItem}`) {
                    assert.equal(styles['background-color'], 'rgba(0, 0, 0, 0.1)', 'styles update');
                } else {
                    assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
                }
                assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
            });
        }
    });
});
