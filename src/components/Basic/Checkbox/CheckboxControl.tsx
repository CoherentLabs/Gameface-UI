import { JSX, ParentComponent } from "solid-js";
import styles from './Checkbox.module.scss';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";
import { CheckboxIndicator } from "./CheckboxIndicator";

interface ControlTokenProps extends TokenBase {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Control = createTokenComponent<ControlTokenProps>();

interface CheckboxControlProps extends TokenComponentProps {
    before: boolean | undefined
}

export const CheckboxControl: ParentComponent<CheckboxControlProps> = (props) => {
    const ControlToken = useToken(Control, props.parentChildren);

    return (
        <div
            class={`${styles.control} ${props.before ? styles.before : ''} ${ControlToken()?.class || ''}`}
            style={ControlToken()?.style || {}}
            use:forwardAttrs={ControlToken()}>
            {ControlToken()?.children}
            <CheckboxIndicator parentChildren={ControlToken()?.children}></CheckboxIndicator>
        </div>
    )
}
