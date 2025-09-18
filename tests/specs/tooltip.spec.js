const assert = require('assert');
const selectors = require('../shared/tooltip-selectors.json');
const positions = [
    'top',
    'right',
    'bottom',
    'left'
];

describe('Tooltip', function () {
    this.beforeAll(async () => {
        await gf.navigate(`http://localhost:3000/components-e2e/`);
        await gf.sleep(1000);
        await gf.click('.tooltip-link');
    });

    it('Should render tooltip', async () => {
        const wrapper = await gf.get(`.${selectors.tooltipWrapper}`);
        const tip = await gf.contains('Tooltip message', `.${selectors.tooltipWrapper}`);

        assert.ok(wrapper, 'Tooltip wrapper should be in the DOM');
        assert.ok(tip, 'Tooltip message should be in the DOM');
    });

    it('Should render tooltip with custom content and test its visibility', async () => {
        await gf.trigger('create-tooltip', {
            customContent: 'Custom Tooltip Content',
        });
        const tip = await gf.get(`.${selectors.tooltipMessage}`);
        assert.ok(tip, 'Tooltip message should be in the DOM');
        assert.equal(await tip.isVisible(), false, 'Tooltip message should be hidden initially');
        await (await gf.get(`.${selectors.element}`)).hover();
        assert.equal(await tip.waitForVisibility(), true, 'Tooltip message should be visible after hover');
    });

    for (const position of positions) {
        it(`Should render tip at ${position}`, async () => {
            await gf.trigger('create-tooltip', {
                customContent: 'Custom Tooltip Content',
                position: position
            });
            const tip = await gf.get(`.${selectors.tooltipMessage}`);
            const element = await gf.get(`.${selectors.element}`);
            await element.hover();
            const elementSize = await element.getSize();
            const elementLocation = await element.getPositionOnScreen();
            const tipSize = await tip.getSize();
            const tipLocation = await tip.getPositionOnScreen();

            switch (position) {
                case 'top':
                    assert.ok(
                        tipLocation.y < elementLocation.y,
                        'Tooltip should be above the element'
                    );
                    break;
                case 'left':
                    assert.ok(
                        tipLocation.x + tipSize.width < elementLocation.x,
                        'Tooltip should be to the left of the element'
                    );
                    break;
                case 'right':
                    assert.ok(
                        tipLocation.x > elementLocation.x + elementSize.width,
                        'Tooltip should be to the right of the element'
                    );
                    break;
                case 'bottom':
                    assert.ok(
                        tipLocation.y > elementLocation.y,
                        'Tooltip should be below the element'
                    );
                    break;
            }
        });
    }

    for (const position of positions) {
        it(`Should render tip with auto position and element on the ${position}`, async () => {
            let wrapperStyle = {};
            switch (position) {
                case 'top':
                    wrapperStyle = { position: 'absolute', top: 0, width: '20vmax' };
                    break;
                case 'left':
                    wrapperStyle = { position: 'absolute', left: 0, width: '5vmax' };
                    break;
                case 'right':
                    wrapperStyle = { position: 'absolute', right: 0 };
                    break;
                case 'bottom':
                    wrapperStyle = { position: 'absolute', bottom: 0, width: '20vmax' };
                    break;
            }
            await gf.trigger('create-tooltip', {
                customContent: 'Custom Tooltip Content',
                position: 'auto',
                wrapperStyle: wrapperStyle
            });
            const tip = await gf.get(`.${selectors.tooltipMessage}`);
            const element = await gf.get(`.${selectors.element}`);
            await element.hover();
            const elementSize = await element.getSize();
            const elementLocation = await element.getPositionOnScreen();
            const tipSize = await tip.getSize();
            const tipLocation = await tip.getPositionOnScreen();

            switch (position) {
                case 'top':
                    assert.ok(
                        tipLocation.y > elementLocation.y,
                        'Tooltip should be below the element'
                    );
                    break;
                case 'left':
                    assert.ok(
                        tipLocation.x > elementLocation.x + elementSize.width,
                        'Tooltip should be to the right of the element'
                    );
                    break;
                case 'right':
                    assert.ok(
                        tipLocation.x + tipSize.width < elementLocation.x,
                        'Tooltip should be to the left of the element'
                    );
                    break;
                case 'bottom':
                    assert.ok(
                        tipLocation.y < elementLocation.y,
                        'Tooltip should be above the element'
                    );
                    break;
            }
        });
    }

    it('Should show/hide tooltip when element is clicked', async () => {
        await gf.trigger('create-tooltip', {
            customContent: 'Custom Tooltip Content',
            action: 'click'
        });
        const tip = await gf.get(`.${selectors.tooltipMessage}`);
        const element = await gf.get(`.${selectors.element}`);
        assert.ok(tip, 'Tooltip message should be in the DOM');
        assert.ok(await tip.waitForVisibility(false), 'Tooltip message should be hidden initially');
        await element.click();
        assert.ok(await tip.waitForVisibility(true), 'Tooltip message should be visible after click');
        await element.click();
        assert.ok(await tip.waitForVisibility(false), 'Tooltip message should be hidden after second click');
    });

    it('Should show/hide tooltip when element is focused', async () => {
        await gf.trigger('create-tooltip', {
            customContent: 'Custom Tooltip Content',
            action: 'focus'
        });
        const tip = await gf.get(`.${selectors.tooltipMessage}`);
        const element = await gf.get(`.${selectors.element}`);
        assert.ok(tip, 'Tooltip message should be in the DOM');
        assert.ok(await tip.waitForVisibility(false), 'Tooltip message should be hidden initially');
        await element.focus();
        assert.ok(await tip.waitForVisibility(true), 'Tooltip message should be visible after click');
        await tip.click();
        assert.ok(await tip.waitForVisibility(false), 'Tooltip message should be hidden after second click');
    });
});