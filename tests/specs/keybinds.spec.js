const assert = require('assert');
const selectors = require('../shared/keybinds/keybinds-selectors.json');
const DEFAULT_MAPPINGS = require('../shared/keybinds/default-mappings.json');
const ALTERNATE_MAPPINGS = require('../shared/keybinds/alternate-mappings.json');
const GAMEPAD_GLYPHS = require ("../shared/keybinds/glyph-mappings.json");
const OVERRIDES = require('../shared/keybinds/overrides.json');
const { navigateToPage } = require('../shared/utils');

describe('Keybinds', function () {
    this.beforeAll(async () => {
        await navigateToPage('.keybinds-link');
    })

    this.afterEach(async () => {
        await gf.trigger('reset');
    })

    it('Should render all keybind components correctly', async () => {
        const container = await gf.get(`.${selectors.keybindsContainer}`);
        const keybinds = await container.findAll(`.${selectors.keybind}`);

        assert.ok(keybinds, 'Keybinds should be in the DOM');
        assert.equal(keybinds.length, 10, '10 Keybinds should be in the DOM');
        for (let i = 0; i < DEFAULT_MAPPINGS.length; i++) {
            const keyContent = await keybinds[i].text();
            assert.strictEqual(keyContent, DEFAULT_MAPPINGS[i].key, `Keybind ${i} mismatch`);
        }
    })

    it('Should rebind untaken key', async () => {
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await keybinds[0].click();
        await gf.keyPress('Z');
        assert.equal(await keybinds[0].text(), 'Z', 'Keybind has the correct value');
    });

    it('Should rebind untaken key with mouse button', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await keybinds[0].click();
        await keybinds[0].click();
        assert.equal(await keybinds[0].text(), 'LMB', 'Keybind has the correct value');
    });

    it('Should rebind untaken key with mouse wheel', async () => {
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await keybinds[0].click();
        await gf.mouseWheel(0, 40);

        assert.equal(await keybinds[0].text(), 'Wheel Down', 'Keybind has the correct value');
    });

    it('Should not be able to rebind taken key', async () => {
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await keybinds[0].click();
        await gf.keyPress(DEFAULT_MAPPINGS[1].key);  // S
        assert.equal(await keybinds[0].text(), DEFAULT_MAPPINGS[0].key, 'Keybind should remain the same');
    });

    it('Should replace existing key', async () => {
        // change conflict policy 
        await gf.click(`.${selectors.scenarioBtn}.scenario-0`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        // rebind
        const newKey = DEFAULT_MAPPINGS[1].key; // S
        await keybinds[0].click();
        await gf.keyPress(newKey);

        assert.equal(await keybinds[0].text(), newKey, `Keybind should change to ${newKey}`);
        assert.equal(await keybinds[1].text(), 'Unbound', 'Keybind should be unbound');
    });

    it('Should bind an already bound key', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        const newKey = DEFAULT_MAPPINGS[0].key; // W
        await keybinds[1].click();
        await gf.keyPress(newKey);

        assert.equal(await keybinds[0].text(), newKey, `Keybind should change to ${newKey}`);
        assert.equal(await keybinds[1].text(), newKey, `Keybind should change to ${newKey}`);
    });

    it('Should swap two keys', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-2`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        const newKey = DEFAULT_MAPPINGS[1].key; // S
        const oldKey = DEFAULT_MAPPINGS[0].key // W
        await keybinds[0].click();
        await gf.keyPress(newKey);

        assert.equal(await keybinds[0].text(), newKey, `Keybind should change to ${newKey}`);
        assert.equal(await keybinds[1].text(), oldKey, `Keybind should change to ${oldKey}`);
    });

    it('Should rebind a key programmatically', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-3`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);

        assert.equal(await keybinds[0].text(), 'Z', `Keybind should change to Z`);
    });

    it('Should unbind a key programmatically', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);

        assert.equal(await keybinds[0].text(), 'Unbound', `Keybind should be unbound`);
    });

    it('Should reset all keys', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);

        for (let i = 0; i < DEFAULT_MAPPINGS.length; i++) {
            assert.equal(await keybinds[i].text(), 'Unbound', 'Keybind should be unbound');
        }
    });

    it('Should reset to defaults', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-5`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await gf.click(`.${selectors.scenarioBtn}.scenario-6`);

        for (let i = 0; i < DEFAULT_MAPPINGS.length; i++) {
            const keyContent = await keybinds[i].text();
            assert.strictEqual(keyContent, DEFAULT_MAPPINGS[i].key, `Keybind ${i} mismatch`);
        }
    });

    it('Should apply alternative bindings', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-7`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);

        for (let i = 0; i < DEFAULT_MAPPINGS.length; i++) {
            const keyContent = await keybinds[i].text();
            const alternate = ALTERNATE_MAPPINGS[DEFAULT_MAPPINGS[i].action] ?? "Unbound"
            assert.strictEqual(keyContent, alternate, `Keybind ${i} mismatch`);
        }
    });

    it('Should change key listening text', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-8`);
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await keybinds[0].click();

        assert.equal(await keybinds[0].text(), selectors['listening-text'], 'Listening text should have changed');
    });

    it('Should change placeholder text', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-9`); // change placeholder text
        await gf.click(`.${selectors.scenarioBtn}.scenario-4`); // unbind key
        const keybinds = await gf.getAll(`.${selectors.keybind}`);

        assert.equal(await keybinds[0].text(), selectors['placeholder-text'], 'Placeholder text should have changed');
    });

    it('Should bind a refactored keybind value', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`); // allow duplicated for easier assertion
        const keybinds = await gf.getAll(`.${selectors.keybind}`);

        const overridesArr = Object.values(OVERRIDES);
        for (let i = 0; i < overridesArr.length; i++) {
            await keybinds[i].click();

            if (overridesArr[i].includes('Mouse')) {
                await keybinds[i].mousePress('middle');
                await keybinds[i].mouseRelease();
            } else {
                await gf.keyPress(overridesArr[i].split(' ')[1]);
            }

            assert.equal(await keybinds[i].text(), overridesArr[i], 'Keybind value should match override');
        }
    });

    it('Should bind mouse value without triggering listen state on another keybind', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-1`); // allow duplicated for easier assertion
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        await keybinds[0].click();
        await keybinds[1].mousePress('right');
        await keybinds[1].mouseRelease();

        assert.equal(await keybinds[0].text(), 'RMB', 'Keybind value should be right mouse button');
        assert.equal(await keybinds[1].text(), DEFAULT_MAPPINGS[1].key, 'Keybind value should remain unchanged');
    });

    it('Should trigger onChange event after keybind change', async () => {
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        await keybinds[0].click();
        await gf.keyPress('Z');

        const prevKey = DEFAULT_MAPPINGS[0].key;
        const action = DEFAULT_MAPPINGS[0].action;
        assert.equal(await assertionEl.text(), `${prevKey} Z ${action}`, 'OnChange should reflect rebinding');
    });

    it('Should not trigger onChange event after keybind change attempt', async () => {
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);
        
        await keybinds[0].click();
        await gf.keyPress(DEFAULT_MAPPINGS[1].key);
        
        assert.equal((await assertionEl.text()).trim(), "", 'OnChange should not trigger');
    });

    it('Should trigger onConflict event after binding conflict occurs', async () => {
        const keybinds = await gf.getAll(`.${selectors.keybind}`);
        const assertionEl = await gf.get(`.${selectors.assertionElement}`);

        await keybinds[1].click();
        await gf.keyPress(DEFAULT_MAPPINGS[0].key);
        
        const styles = await assertionEl.styles();
        assert.equal(styles['background-color'], 'rgba(255, 0, 0, 1)', 'BG should change after conflict');
    });

    it('Should update styles & classes reactively on props change', async () => {
        await gf.click(`.${selectors.scenarioBtn}.scenario-10`);
        const el = await gf.get(`.${selectors.keybind}`);
        const styles = await el.styles();
        const classes = await el.classes();
        assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'styles update');
        assert.ok(classes.includes(selectors.reactive), 'class "reactive" applied');
    });

    describe('Keybinds with default object provided', function () {
        it('Should render correctly', async () => {
            const container = await gf.getAll(`.${selectors.keybindsContainer}`);
            const keybinds = await container[1].findAll(`.${selectors.keybind}`);

            assert.ok(keybinds, 'Keybinds should be in the DOM');
            assert.equal(keybinds.length, 10, '10 Keybinds should be in the DOM');
            for (let i = 0; i < DEFAULT_MAPPINGS.length; i++) {
                const actual = await keybinds[i].text();
                const expected = ALTERNATE_MAPPINGS[DEFAULT_MAPPINGS[i].action] ?? "";
                assert.strictEqual(actual, expected, `Keybind ${i} mismatch`);
            }
        });

        it('Should reset to defaults', async () => {
            const container = await gf.getAll(`.${selectors.keybindsContainer}`);
            const keybinds = await container[1].findAll(`.${selectors.keybind}`);

            const keybind1InitialText = await keybinds[0].text();
            const keybind2InitialText = await keybinds[1].text();

            await keybinds[0].click();
            await gf.keyPress('Z');

            await keybinds[1].click();
            await gf.keyPress('X');

            await gf.click(`.${selectors.scenarioBtn}.scenario-11`)
            assert.strictEqual(await keybinds[0].text(), keybind1InitialText, `Keybind should have its initial value`);
            assert.strictEqual(await keybinds[1].text(), keybind2InitialText, `Keybind should have its initial value`);
        });
    })

    describe('Keybinds - gamepad mode', function () {
        this.beforeAll(async () => {
            await gf.connectGamepad('gamepad')
            await gf.click(`.${selectors.scenarioBtn}.scenario-12`)
        })

        async function getIconSource (keybind) {
            const image = await keybind.find('img');
            return await image.getAttribute('src');
        }

        it('Should render default gamepad glyphs', async () => {
            const container = await gf.getAll(`.${selectors.keybindsContainer}`);
            const keybinds = await container[2].findAll(`.${selectors.keybind}`);

            let idx = 0;
            for (const keybind of keybinds) {
                const src = await getIconSource(keybind);

                assert.equal(src.includes(`/${GAMEPAD_GLYPHS[idx].glyph}`), true, 'Correct icon is displayed');
                idx++;
            }
        });

        it('Should rebind a gamepad input', async () => {
            const container = await gf.getAll(`.${selectors.keybindsContainer}`);
            const keybind = await container[2].find(`.${selectors.keybind}`);
            const gamepad = gf.getGamepad('gamepad')

            await gamepad.sequence([
                gf.GAMEPAD_BUTTONS.FACE_BUTTON_DOWN,
                gf.GAMEPAD_BUTTONS.FACE_BUTTON_RIGHT,
            ]);

            const src = await getIconSource(keybind);
            assert.equal(src.includes(`/b`), true, 'Correct icon is displayed');
        })

        it('Should prevent execution of any actions while listening for input', async () => {
            const assertionEl = await gf.get(`.${selectors.actionTest}`)
            const gamepad = gf.getGamepad('gamepad')

            await gamepad.sequence([
                gf.GAMEPAD_BUTTONS.FACE_BUTTON_DOWN,
                gf.GAMEPAD_BUTTONS.RIGHT_SHOULDER,
            ]);

            assert.equal(await assertionEl.text(), 'test', 'Element\'s text should remain unchanged after action is bound')
        })

        it('Should render custom glyphs', async () => {
            const container = await gf.getAll(`.${selectors.keybindsContainer}`);
            const keybinds = await container[3].findAll(`.${selectors.keybind}`);

            const NEW_GLYPHS_TEXT = ['up', 'down', 'left', 'right'];
            let idx = 0;

            for (const keybind of keybinds) {
                if (idx === NEW_GLYPHS_TEXT.length) break;

                const child = await keybind.find('div');
                assert.equal(await child.text(), NEW_GLYPHS_TEXT[idx], 'Glyph text content should match structure.');
                if (idx === NEW_GLYPHS_TEXT.length - 1) {
                    const styles = await child.styles();
                    assert.equal(styles['background-color'], 'rgba(0, 0, 255, 1)', 'Styles of glyphs changed');
                }
                idx++;
            }
        })
    })
});