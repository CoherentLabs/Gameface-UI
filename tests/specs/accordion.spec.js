const assert = require('assert');
const selectors = require('../shared/accordion-selectors.json');
const { navigateToPage } = require('../shared/utils');

describe('ToggleButton', function () {
    this.beforeAll(async () => {
        await navigateToPage('.accordion-link');
    });

    this.afterEach(async () => {
        await gf.trigger('reset');
    });

    it('Should render itself correctly', async () => {
        const accordion = await gf.get(`.${selectors.base}`);
        const panels = await accordion.findAll(`.${selectors.accordionPanel}`);
        const heading = await panels[0].find(`.${selectors.accordionHeading}`);
        const icon = await heading.find(`.${selectors.accordionIcon}`);
        const body = await panels[0].find(`.${selectors.accordionBody}`);

        assert.ok(accordion, 'Accordion should be in the DOM');
        assert.equal(panels.length, 3, '\"on\" Accordion should have 3 panels');
        assert.ok(heading, 'Accordion heading should be in the DOM');
        assert.ok(body, 'Accordion icon should be in the DOM');
        assert.ok(icon, 'Accordion body should be in the DOM');
    });

    it('Should expand and collapse accordion panel', async () => {
        const accordion = await gf.get(`.${selectors.base}`);
        const panels = await accordion.findAll(`.${selectors.accordionPanel}`);
        const body0 = await (await panels[0].children()).last();

        await panels[0].click();
        await gf.retryIfFails(async () => {
            assert.equal(await body0.isVisible(), true, 'Accordion panel should have expanded');
        })

        await panels[0].click();
        await gf.retryIfFails(async () => {
            assert.equal(await body0.isVisible(), false, 'Accordion panel should have collapsed');
        })
    });

    it('Should expand only one panel', async () => {
        const accordion = await gf.get(`.${selectors.base}`);
        const panels = await accordion.findAll(`.${selectors.accordionPanel}`);
        const body0 = await (await panels[0].children()).last();
        const body1 = await (await panels[1].children()).last();

        await panels[0].click();
        await panels[1].click();
        await gf.retryIfFails(async () => {
            assert.equal(await body1.isVisible(), true, 'Second accordion panel should have expanded');
            assert.equal(await body0.isVisible(), false, 'First accordion panel should have collapsed');
        })
    });

    it('Should expand multiple panels', async () => {
        const accordion = await gf.get(`.${selectors.base}`);
        const panels = await accordion.findAll(`.${selectors.accordionPanel}`);
        const body0 = await (await panels[0].children()).last();
        const body1 = await (await panels[1].children()).last();

        await gf.click(`.${selectors.scenarioBtn}.scenario-0`)
        await panels[0].click();
        await panels[1].click();
        await gf.retryIfFails(async () => {
            assert.equal(await body0.isVisible(), true, 'First accordion panel should have expanded');
            assert.equal(await body1.isVisible(), true, 'Second accordion panel should have expanded');
        })
    });

    it('Should retrieve expanded panel via onChange prop', async () => {
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await gf.click(`.${selectors.accordionPanel}`);
        assert.equal(await assertionEl.text(), 'test1', 'Assertion element\'s text should be set to the title of the first panel');
    })

    it('Should apply expanded styles', async () => {
        const panel = await gf.get(`.${selectors.accordionPanel}`);
        await panel.click();
        const panelClasses = await panel.classes();

        assert.ok(panelClasses.includes(selectors['panelExpanded']), 'Checked class should be applied');
    });

    it('Should toggle a panel programmatically', async () => {
        const panel = await gf.get(`.${selectors.accordionPanel}`);
        const body = await (await panel.children()).last();

        await gf.click(`.${selectors.scenarioBtn}.scenario-4`)
        await gf.retryIfFails(async () => {
            assert.equal(await body.isVisible(), true, 'First accordion panel should have expanded');
        })

        await gf.click(`.${selectors.scenarioBtn}.scenario-6`)
        await gf.retryIfFails(async () => {
            assert.equal(await body.isVisible(), false, 'First accordion panel should have collapsed');
        })
    });

    it('Should toggle all panels programmatically', async () => {
        const panels = await gf.getAll(`.${selectors.accordionPanel}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`)

        await gf.click(`.${selectors.scenarioBtn}.scenario-5`)
        for (const panel of panels) {
            const body = await (await panel.children()).last();

            await gf.retryIfFails(async () => {
                assert.equal(await body.isVisible(), true, 'Accordion panel should have expanded');
            })
        }

        await gf.click(`.${selectors.scenarioBtn}.scenario-7`)
        for (const panel of panels) {
            const body = await (await panel.children()).last();

            await gf.retryIfFails(async () => {
                assert.equal(await body.isVisible(), false, 'Accordion panel should have collapsed');
            });
        }
    });

    it('Should disable accordion', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        const panel = await gf.get(`.${selectors.accordionPanel}`);
        const body = await (await panel.children()).last();
        await panel.click();

        const accordionClasses = await gf.getClasses(`.${selectors.base}`);
        assert.ok(accordionClasses.includes(`${selectors.accordionDisabled}`), 'Accordion has disabled class');
        await gf.retryIfFails(async () => {
            assert.equal(await body.isVisible(), false, 'Accordion panel should remain collapsed');
        });
    });

    it('Should disable accordion panel', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const panel = await gf.get(`.${selectors.accordionPanel}`);
        const body = await (await panel.children()).last();
        await panel.click();

        const panelClasses = await panel.classes();
        assert.ok(panelClasses.includes(`${selectors.panelDisabled}`), 'Accordion panel has disabled class');
        await gf.retryIfFails(async () => {
            assert.equal(await body.isVisible(), false, 'Accordion panel should remain collapsed');
        });
    });

    it('Render custom icon', async () => {
        const icon = await gf.get(`.${selectors.accordionIcon}`);
        assert.equal(await (await icon.children()).first().node.nodeName, "SVG", 'Default icon should be of type SVG');

        await gf.click(`.${selectors.scenarioBtn}.scenario-8`)
        assert.equal(await icon.text(), "Custom icon", 'New icon should have text - Custom Icon');
    })

    describe('reactivity', () => {
        const scenarios = [
            { selector: `.${selectors.base}`, desc: 'root' },
            { selector: `.${selectors.accordionPanel}`, desc: 'panel' },
            { selector: `.${selectors.accordionHeading}`, desc: 'heading' },
            { selector: `.${selectors.accordionIcon}`, desc: 'icon' },
            { selector: `.${selectors.accordionBody}`, desc: 'body' },
        ];

        for (const { selector, desc } of scenarios) {
            it(`should update styles & classes reactively on props change — ${desc}`, async () => {
                await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
                const el = await gf.get(selector);
                const styles = await el.styles();
                const classes = await el.classes();

                assert.ok(classes.includes('reactive'), 'class "reactive" applied');
                assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
            });
        };
    });
});