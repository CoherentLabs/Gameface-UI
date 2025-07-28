interface AddonSlotProps {
    token: () => any;
    className?: string;
}

const AddonSlot = (props: AddonSlotProps) => {
    if (!props.token()) return null;

    return (
        <div class={`${props.className ?? ""} ${props.token().class ?? ""}`} style={props.token().style}>
            {props.token().children}
        </div>
    );
};

export default AddonSlot;