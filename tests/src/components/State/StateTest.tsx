import { createSignal, flush, For, onSettled } from "solid-js";
import State, { Match, StateComponentRef, states } from "@components/Basic/State/State";
import selectors from "../../../shared/state-selectors.json";
import createOnChangeLog from "../onChangeLog";

const StateTest = () => {
    let stateRef!: StateComponentRef;
    const log = createOnChangeLog('state');
    const beforeLog = createOnChangeLog('state-before');
    const [current, setCurrent] = createSignal('');

    const scenarios = [
        { label: "Change to two", action: () => log.sync(() => stateRef.changeState('two')) },
        { label: "Change to two, then three", action: () => log.sync(() => { stateRef.changeState('two'); stateRef.changeState('three'); }) },
        { label: "Change to the current state", action: () => log.sync(() => stateRef.changeState('one')) },
        { label: "Toggle with a function", action: () => log.sync(() => stateRef.changeState((prev) => prev === 'one' ? 'two' : 'one')) },
        { label: "Change via states[name]", action: () => log.sync(() => states['state-test'].changeState('two')) },
        { label: "Change to an unknown state", action: () => log.sync(() => stateRef.changeState('unknown')) },
    ];

    const reset = () => {
        stateRef?.changeState('one');
        flush();
        log.clear();
        beforeLog.clear();
    };

    onSettled(() => {
        document.addEventListener('reset', reset);
        return () => document.removeEventListener('reset', reset);
    });

    return (
        <>
            <div class={selectors.assertionElement}>{current()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action}>
                        {sc.label}
                    </button>
                )}
            </For>

            <State
                ref={stateRef}
                name="state-test"
                default="one"
                class={selectors.state}
                onBeforeStateChange={(currentState, nextState) => beforeLog.record(currentState, nextState)}
                onStateChanged={(currentState, prevState) => { log.record(currentState, prevState); setCurrent(currentState ?? ''); }}>
                <Match name="one"><div class={selectors.stateOne}>State one</div></Match>
                <Match name="two"><div class={selectors.stateTwo}>State two</div></Match>
                <Match name="three"><div class={selectors.stateThree}>State three</div></Match>
                <Match name=""><div class={selectors.stateFallback}>Fallback</div></Match>
            </State>
        </>
    );
};

export default StateTest;
