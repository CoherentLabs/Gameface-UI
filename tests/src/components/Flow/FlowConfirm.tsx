import { defineFlow, useFlow, useOverlays } from '@components/Utility/Flow/Flow';

const flow = defineFlow({
    navigation: {
        screen: { firstFocus: 'confno00' },
        elements: { confyes0: { focusable: true }, confno00: { focusable: true } },
    },
});

const FlowConfirm = () => {
    const f = useFlow(flow);
    const overlays = useOverlays();

    return (
        <div attr:data-gf-id="confroot" class="flow-confirm" ref={f.root}>
            <div attr:data-gf-id="confyes0" class="flow-confirm-yes" onClick={() => overlays.close('yes')}>Yes</div>
            <div attr:data-gf-id="confno00" class="flow-confirm-no" onClick={() => overlays.close('no')}>No</div>
        </div>
    );
};

export default FlowConfirm;
