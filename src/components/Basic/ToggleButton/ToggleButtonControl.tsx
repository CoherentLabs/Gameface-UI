import { createMemo, JSX, ParentComponent } from "solid-js";
import styles from './ToggleButton.module.css';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { ToggleButtonIndicator } from "./ToggleButtonIndicator";
import { ToggleButtonHandle } from "./ToggleButtonHandle";
import { LabelLeft, LabelRight } from "./ToggleButton";

interface ControlTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Control = createTokenComponent<ControlTokenProps>();

export const ToggleButtonControl: ParentComponent<TokenComponentProps> = (props) => {
    const ControlToken = useToken(Control, props.parentChildren);
    const LabelLeftToken = useToken(LabelLeft, props.parentChildren);
    const LabelRightToken = useToken(LabelRight, props.parentChildren);

    const controlClasses = createMemo(() => {
        const classes = [styles.Control];

        if (LabelLeftToken()) classes.push(styles.LabelLeftEnabled);
        if (LabelRightToken()) classes.push(styles.LabelRightEnabled);
        if (ControlToken()?.class) classes.push(ControlToken()?.class ?? '');

        return classes.join(' ');
    });

    return (
        <div
            class={controlClasses()}
            style={ControlToken()?.style || {}}>
            {ControlToken()?.children}
            <ToggleButtonIndicator parentChildren={ControlToken()?.children} />
            <ToggleButtonHandle parentChildren={ControlToken()?.children} />
        </div>
    )
}
