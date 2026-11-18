import { ParentComponent } from "solid-js";
import { JSX } from "@solidjs/web";
import styles from './ToggleButton.module.scss';
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
    const ControlToken = useToken(Control, () => props.parentChildren);
    const LabelLeftToken = useToken(LabelLeft, () => props.parentChildren);
    const LabelRightToken = useToken(LabelRight, () => props.parentChildren);

    const controlClasses = () => [
        styles.control,
        LabelLeftToken() && styles['label-left-enabled'],
        LabelRightToken() && styles['label-right-enabled'],
        ControlToken()?.class,
    ];

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
