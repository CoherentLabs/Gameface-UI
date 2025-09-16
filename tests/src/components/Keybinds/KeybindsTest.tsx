import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, Match, onCleanup, onMount, Switch } from "solid-js";
import selectors from "../../../shared/keybinds/keybinds-selectors.json";
import Keybinds, { KeybindsRef } from "@components/Basic/Keybinds/Keybinds";
import Keybind from "@components/Basic/Keybinds/Keybind";
import TEST_KEYS from '../../../shared/keybinds/default-mappings.json';
import ALTERNATE_KEYS from "../../../shared/keybinds/alternate-mappings.json";
import Flex from "@components/Layout/Flex/Flex";

const KeybindsTest = () => {
    let keybindsRef!: KeybindsRef;
    let keybindsRefWithDefault!: KeybindsRef;
    const [test, setTest] = createSignal('red');
    const [lastChanged, setLastChanged] = createSignal({ action: "", key: "" });
    const [hasConflict, setHasConflict] = createSignal(false);
    const [policy, setPolicy] = createSignal<'block' | 'replace-existing' | 'allow-duplicates' | 'swap'>('block')
    const [listeningText, setListeningText] = createSignal<string | undefined>(undefined)
    const [placeholder, setPlaceholder] = createSignal('Unbound')
    const [useChars, setUseChars] = createSignal(false);

    const scenarios = [
        { label: "Change policy - replace-existing", action: () => { setPolicy('replace-existing') } },
        { label: "Change policy - allow-duplicates", action: () => { setPolicy('allow-duplicates') } },
        { label: "Change policy - swap", action: () => { setPolicy('swap') } },
        { label: "Rebind action", action: () => { keybindsRef.bind(TEST_KEYS[0].action, 'Q') } },
        { label: "Unbind key", action: () => { keybindsRef.unbindKey('W') } },
        { label: "Clear all bindings", action: () => { keybindsRef.clearAll() } },
        { label: "Reset defaults", action: () => { keybindsRef.reset() } },
        { label: "Apply alternative bindings", action: () => { keybindsRef.mapBindings(ALTERNATE_KEYS) } },
        { label: "Change listening text", action: () => { setListeningText(selectors["listening-text"]) } },
        { label: "Change placeholder text", action: () => { setPlaceholder(selectors["placeholder-text"]) } },
        { label: "Use charecters", action: () => { setUseChars(true) } },
        { label: "Change styles", action: () => { setTest('blue') } },
        { label: "Reset defaults - alternate", action: () => { keybindsRefWithDefault.reset() } },
    ];

    const reset = () => {
        setTest('red');
        setLastChanged({ action: "", key: "" });
        setHasConflict(false);
        setPolicy('block');
        setListeningText(undefined);
        setPlaceholder('Unbound');
        setUseChars(false);
        keybindsRef.reset();
    };

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
                {`${lastChanged().action} ${lastChanged().key}`}
            </div>

            <Flex direction="row" wrap="wrap" class={selectors.keybindsContainer}>
                <Keybinds
                    onChange={(action, key) => setLastChanged({action, key: key as string})}
                    onConflict={() => setHasConflict(true)}
                    ref={keybindsRef}
                    conflictPolicy={policy()}
                    listeningText={listeningText()}
                    placeholder={placeholder()}
                    useChars={useChars()}>
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
        </Tab>
    )
}

export default KeybindsTest;