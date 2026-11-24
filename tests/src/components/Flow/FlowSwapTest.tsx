import { onCleanup, onMount, Show } from 'solid-js';
import Navigation from '@components/Utility/Navigation/Navigation';
import { defineFlow, useFlow } from '@components/Utility/Flow/Flow';
import './FlowTest.css';

/** A screen whose root element is replaced when its state changes. */
const flow = defineFlow({
    states: [{ name: 'Layout', initial: 'A', states: [{ name: 'A' }, { name: 'B' }] }],
    navigation: {
        elements: {
            swapa1: { focusable: true },
            swapa2: { focusable: true },
            swapb1: { focusable: true },
            swapb2: { focusable: true },
        },
    },
});

const FlowSwapTest = () => {
    const f = useFlow(flow);
    const layout = f.state('Layout');
    const reset = () => layout.set('A');

    onMount(() => document.addEventListener('reset', reset));
    onCleanup(() => document.removeEventListener('reset', reset));

    return (
        <Navigation ref={f.nav}>
            <button class="flow-swap-toggle" onClick={() => layout.set(layout.is('A') ? 'B' : 'A')}>Swap root</button>
            <Show
                when={layout.is('A')}
                fallback={
                    <div attr:data-gf-id="swapb" class="flow-root flow-swap-b" ref={f.root}>
                        <div class="flow-row">
                            <div attr:data-gf-id="swapb1" class="flow-btn flow-swap-b1">B1</div>
                            <div attr:data-gf-id="swapb2" class="flow-btn flow-swap-b2">B2</div>
                        </div>
                    </div>
                }
            >
                <div attr:data-gf-id="swapa" class="flow-root flow-swap-a" ref={f.root}>
                    <div class="flow-row">
                        <div attr:data-gf-id="swapa1" class="flow-btn flow-swap-a1">A1</div>
                        <div attr:data-gf-id="swapa2" class="flow-btn flow-swap-a2">A2</div>
                    </div>
                </div>
            </Show>
        </Navigation>
    );
};

export default FlowSwapTest;
