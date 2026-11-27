import { defineFlow, useFlow } from '@components/Utility/Flow/Flow';
import { Show } from 'solid-js';

const flow = defineFlow({
    states: [{ name: 'Card', initial: 'Closed', states: [{ name: 'Closed' }, { name: 'Open' }] }],
    navigation: { elements: { cardbuy0: { focusable: true } } },
});

/** A component with its own flow: its "Open" state shows a focusable Buy that sits in no area of its own. */
const FlowCard = () => {
    const f = useFlow(flow);
    return (
        <div attr:data-gf-id="cardroot" class="flow-row flow-card" ref={f.root}>
            <div class="flow-label">Card: {f.state('Card').current()}</div>
            <Show when={f.state('Card').is('Open')}>
                <div attr:data-gf-id="cardbuy0" class="flow-btn flow-card-buy">Buy (card, Open only)</div>
            </Show>
        </div>
    );
};

export default FlowCard;
