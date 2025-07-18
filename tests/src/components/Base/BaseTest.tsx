import Tab from "@components/Layout/Tab/Tab";
import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
import Block from "@components/Layout/Block/Block";
import './base.css';
import selectors from "../../../shared/base-selectors.json";

const BaseTest = () => {
    const [test, setTest] = createSignal('red');
    const [text, setText] = createSignal('');
    const [tabIndex, setTabIndex] = createSignal(-1);

    const scenarios = [
        { label: "Change color", action: () => setTest('blue')},
        { label: "Change tabindex", action: () => setTabIndex(0)},
    ];

    const reset = () => {
        setTest('red');
        setText('');
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='base'>
            <div class={selectors.assertionElement}>{text()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <button class={`${selectors.scenarioBtn} scenario-${i()}`} onClick={sc.action} >
                        {sc.label}
                    </button>
                )}
            </For>

            <Block 
                click={() => setText('click')}
                dblclick={() => setText('double click')}
                class={selectors.click}>
                Click
            </Block>

            <Block 
                dblclick={() => setText('double click')}
                class={selectors.doubleClick}>
                Double click
            </Block>

            <Block 
                focus={() => setText('focus')}
                blur={() => setText('blur')}
                attr:tabindex={0}
                class={selectors.focus}>
                Focus
            </Block>

            <Block 
                mousedown={() => setText('mouse down')}
                mouseup={() => setText('mouse up')}
                mouseenter={() => setText('mouse enter')}
                class={selectors.mouse}>
                Mouse
            </Block>
            
            <Block 
                attr:tabindex={0}
                keydown={() => setText('key down')}
                keyup={() => setText('key up')}
                keypress={() => setText('key press')}
                class={selectors.key}>
                Key
            </Block>

            <Block 
                attr:tabindex={0}
                keypress={() => setText('key press')}
                class={selectors.keyPress}>
                Key press
            </Block>

            <Block 
                style={reactiveStyle()} 
                class={`${selectors.reactivity} ${reactiveClass()}`}>
                Reactivity
            </Block>

            <Block 
                attr:tabindex={tabIndex()}
                attr:disabled
                class={selectors.attributes}>
                Attributes
            </Block>
        </Tab> 
    )
}

export default BaseTest;