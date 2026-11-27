import { defineFlow, useFlow } from '@components/Utility/Flow/Flow';

const flow = defineFlow({
    navigation: { areas: { panelarea: { name: 'panel' } } },
});

/** A component with its own navigation area. Its elements are focusable in the markup, as some GFUI components are. */
const FlowPanel = () => {
    const f = useFlow(flow);
    return (
        <div attr:data-gf-id="panelroot" class="flow-panel" ref={f.root}>
            <div attr:data-gf-id="panelarea" class="flow-row flow-area">
                <div attr:data-gf-id="panelp1" class="flow-btn flow-p1" tabindex="0">P1 (panel)</div>
                <div attr:data-gf-id="panelp2" class="flow-btn flow-p2" tabindex="0">P2 (panel)</div>
            </div>
        </div>
    );
};

export default FlowPanel;
