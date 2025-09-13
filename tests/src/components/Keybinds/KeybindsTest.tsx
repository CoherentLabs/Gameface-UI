import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, Match, onCleanup, onMount, Switch } from "solid-js";
import selectors from "../../../shared/keybinds-selectors.json";
import Keybinds, { KeybindsRef } from "@components/Basic/Keybinds/Keybinds";
import KeyBind from "@components/Basic/Keybinds/Keybind";
import { ALTERNATE_KEYS, TEST_KEYS } from "./testMappings";
import Flex from "@components/Layout/Flex/Flex";

const KeybindsTest = () => {
    let keybindsRef!: KeybindsRef;
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
        { label: "Change listening text", action: () => { setListeningText('Please type') } },
        { label: "Change placeholder text", action: () => { setPlaceholder('Unassigned') } },
        { label: "Use charecters", action: () => { setUseChars(true) } },
        { label: "Change styles", action: () => { setTest('blue') } },
    ];

    const reset = () => {
        setTest('red');
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

            <div style={{ background: hasConflict() ? 'red' : 'unset' }}>
                {[lastChanged().action, lastChanged().key].filter(Boolean).join(' ')}
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
                        {(entry) => <KeyBind 
                            action={entry.action} 
                            value={entry.key}
                            class={`${selectors.keybindsContainer} ${reactiveClass()}`}
                            style={reactiveStyle()} />}
                    </For>
                </Keybinds>
            </Flex>

            {/* With defaults */}
            <Flex direction="row" wrap="wrap" class={selectors.keybindsContainer}>
                <Keybinds onChange={(action, key) => setLastChanged({action, key: key as string})} defaults={ALTERNATE_KEYS} conflictPolicy="replace-existing">
                    <For each={Object.keys(ALTERNATE_KEYS)}>
                        {(action) => <KeyBind action={action} />}
                    </For>
                </Keybinds>
            </Flex>
        </Tab>
    )
}

export default KeybindsTest;