import { JSX, ParentComponent } from "solid-js";
import styles from './Checkbox.module.css';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { CheckboxIndicator } from "./CheckboxIndicator";

interface ControlTokenProps {
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
            class={`${styles.Control} ${props.before ? styles.Before : ''} ${ControlToken()?.class || ''}`}
            style={ControlToken()?.style || {}}>
            {ControlToken()?.children}
            <CheckboxIndicator parentChildren={ControlToken()?.children}></CheckboxIndicator>
        </div>
    )
}
