import { Show } from "solid-js";

interface AddonSlotProps {
    token: () => any;
    class?: string;
}

// <Show> instead of an early return, so the slot also appears if the token
// is added later.
const AddonSlot = (props: AddonSlotProps) => {
    return (
        <Show when={props.token()}>
            <div class={[props.class, props.token()?.class]} style={props.token()?.style}>
                {props.token()?.children}
            </div>
        </Show>
    );
};

export default AddonSlot;
