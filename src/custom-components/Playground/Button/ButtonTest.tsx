import Tab from "@components/Layout/Tab/Tab";
import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import Button from "@components/Basic/Button/Button";
import './button.css';

const ButtonTest = () => {
    const [test, setTest] = createSignal('red')
    const [disabled, setDisabled] = createSignal(false);
    const [size, setSize] = createSignal<'small' | 'middle' | 'large'>('small');

    const scenarios = [
        { label: "Disable", action: () => setDisabled(true) },
        { label: "Change size", action: () => setSize('large') },
    ];

    const reset = () => {
        setDisabled(false);
        setTest('red');
        setSize('small');
    };

    const isReactive = createMemo(() => test() === 'blue');
    const reactiveClass = createMemo(() => isReactive() ? 'reactive' : '');
    const reactiveStyle = createMemo(() => isReactive() ? { 'background-color': 'blue' } : {});

    onMount(() => document.addEventListener('reset', reset))
    onCleanup(() => document.removeEventListener('reset', reset)) 

    return (
        <Tab location='button'>
            <div class="assertion-element">{test()}</div>

            <For each={scenarios}>
                {(sc, i) => (
                    <Button textFit={false} size="middle" class={`scenario-btn scenario-${i()}`} click={sc.action} >
                        {sc.label}
                    </Button>
                )}
            </For>

            <Button 
                disabled={disabled()}
                style={reactiveStyle()} 
                click={() => setTest('blue')}
                size={size()}
                class={`button ${reactiveClass()}`}>
                    Button
            </Button>
        </Tab> 
    )
}

export default ButtonTest;