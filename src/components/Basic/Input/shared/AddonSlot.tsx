import { Accessor, ParentProps } from "solid-js";
import { TokenBase } from "@components/utils/tokenComponents";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";

interface AddonSlotProps {
    token: Accessor<ParentProps<TokenBase> | null | undefined>;
    className?: string;
}

const AddonSlot = (props: AddonSlotProps) => {
    if (!props.token()) return null;

    return (
        <div class={`${props.className ?? ""} ${props.token()?.class ?? ""}`} style={props.token()?.style} use:forwardAttrs={props.token()}>
            {props.token()?.children}
        </div>
    );
};

export default AddonSlot;