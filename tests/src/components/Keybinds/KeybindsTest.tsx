import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import selectors from "../../../shared/keybinds/keybinds-selectors.json";
import Keybinds, { KeybindsRef } from "@components/Basic/Keybinds/Keybinds";
import Keybind from "@components/Basic/Keybinds/Keybind";
import TEST_KEYS from '../../../shared/keybinds/default-mappings.json';
import ALTERNATE_KEYS from "../../../shared/keybinds/alternate-mappings.json";
import GAMEPAD_GLYPHS from "../../../shared/keybinds/glyph-mappings.json";
import OVERRIDES from "../../../shared/keybinds/overrides.json";
import Flex from "@components/Layout/Flex/Flex";
import Navigation, { NavigationRef } from "@components/Utility/Navigation/Navigation";

const KeybindsTest = () => {
    let keybindsRef!: KeybindsRef;
    let keybindsRefWithDefault!: KeybindsRef;
    let nav!: NavigationRef;
    const [test, setTest] = createSignal('red');
    const [lastChanged, setLastChanged] = createSignal({ prev: "", next: "", action: ""});
    const [hasConflict, setHasConflict] = createSignal(false);
    const [policy, setPolicy] = createSignal<'block' | 'replace-existing' | 'allow-duplicates' | 'swap'>('block')
    const [listeningText, setListeningText] = createSignal<string | undefined>(undefined)
    const [placeholder, setPlaceholder] = createSignal('Unbound')
    const [actionTest, setActionTest] = createSignal('test');

    const scenarios = [
        { label: "Change policy - replace-existing", action: () => { setPolicy('replace-existing') } },
        { label: "Change policy - allow-duplicates", action: () => { setPolicy('allow-duplicates') } },
        { label: "Change policy - swap", action: () => { setPolicy('swap') } },
        { label: "Rebind action", action: () => { keybindsRef.bind(TEST_KEYS[0].action, 'Z') } },
        { label: "Unbind key", action: () => { keybindsRef.unbindKey('W') } },
        { label: "Clear all bindings", action: () => { keybindsRef.clearAll() } },
        { label: "Reset defaults", action: () => { keybindsRef.reset() } },
        { label: "Apply alternative bindings", action: () => { keybindsRef.mapBindings(ALTERNATE_KEYS) } },
        { label: "Change listening text", action: () => { setListeningText(selectors["listening-text"]) } },
        { label: "Change placeholder text", action: () => { setPlaceholder(selectors["placeholder-text"]) } },
        { label: "Change styles", action: () => { setTest('blue') } },
        { label: "Reset defaults - alternate", action: () => { keybindsRefWithDefault.reset() } },
        { label: "Focus keybind nav area", action: () => { nav.focusFirst('keybinds') } },
    ];

    const reset = () => {
        setTest('red');
        setLastChanged({ prev: "", next: "", action: ""});
        setHasConflict(false);
        setPolicy('block');
        setListeningText(undefined);
        setPlaceholder('Unbound');
        keybindsRef?.reset();
    };

    const testComponent = () => <div>down</div>;

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset))

    return (
        <Tab location='keybinds'>
            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <div class={`${selectors.assertionElement}`} style={{ background: hasConflict() ? 'red' : 'unset' }}>
                {`${lastChanged().prev} ${lastChanged().next} ${lastChanged().action}`}
            </div>

            <Flex direction="row" wrap="wrap" class={selectors.keybindsContainer}>
                <Keybinds
                    onChange={(prev, next, action) => setLastChanged({ prev: prev as string, next: next as string, action })}
                    onConflict={() => setHasConflict(true)}
                    ref={keybindsRef}
                    conflictPolicy={policy()}
                    listeningText={listeningText()}
                    placeholder={placeholder()}
                    overrides={OVERRIDES}>
                    <For each={TEST_KEYS}>
                        {(entry) => <Keybind 
                            action={entry.action} 
                            value={entry.key}
                            class={`${selectors.keybind} ${reactiveClass()}`}
                            style={reactiveStyle()} />}
                    </For>
                </Keybinds>
            </Flex>

            {/* With defaults */}
            <Flex direction="row" wrap="wrap" class={selectors.keybindsContainer}>
                <Keybinds 
                    defaults={ALTERNATE_KEYS} 
                    ref={keybindsRefWithDefault}
                    conflictPolicy="replace-existing">
                    <For each={Object.keys(ALTERNATE_KEYS)}>
                        {(action) => <Keybind action={action} class={`${selectors.keybind}`} />}
                    </For>
                </Keybinds>
            </Flex>

            {/* Gamepad support */}
            <Navigation ref={nav} actions={{ 'test': {key: {binds: ['H']} ,button: {binds: ['right-shoulder'], type: 'press'}, callback: () => setActionTest('changed')} }}>
                <Flex direction="row" wrap="wrap" class={selectors.keybindsContainer}>
                        <Keybinds 
                            mode="gamepad"
                            conflictPolicy="replace-existing">
                            <Navigation.Area name="keybinds" focused>
                                <For each={GAMEPAD_GLYPHS}>
                                    {(entry) => <Keybind action={entry.action} value={entry.key} class={`${selectors.keybind}`} />}
                                </For>
                            </Navigation.Area>
                        </Keybinds>
                        <div class={`${selectors.actionTest}`}>{actionTest()}</div>
                </Flex>
                <Flex direction="row" wrap="wrap" class={selectors.keybindsContainer}>
                    <Keybinds 
                        mode="gamepad"
                        conflictPolicy="replace-existing"
                        glyphOverrides={{
                            "12": <div>up</div>,
                            '13': testComponent,
                            '14': () => <div>left</div>,
                            '15': () => <div style={{'background-color': 'blue'}}>right</div>
                        }}>
                            <For each={GAMEPAD_GLYPHS}>
                                {(entry) => <Keybind action={entry.action} value={entry.key} class={`${selectors.keybind}`} />}
                            </For>
                    </Keybinds>
                </Flex>
            </Navigation>
        </Tab>
    )
}

export default KeybindsTest;