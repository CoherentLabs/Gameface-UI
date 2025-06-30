import { createMemo, JSX, ParentComponent, useContext } from "solid-js";
import styles from './ToggleButton.module.css';

import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { ToggleButtonContext } from "./ToggleButton";

interface HandleTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
    'class-checked'?: string
    'style-checked'?: JSX.CSSProperties
}

export const Handle = createTokenComponent<HandleTokenProps>();

export const ToggleButtonHandle: ParentComponent<TokenComponentProps> = (props) => {
    const toggleButtonContext = useContext(ToggleButtonContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.Handle];

        if (HandleToken()?.class) classes.push(HandleToken()?.class ?? '');

        if (toggleButtonContext?.checked()) {
            if (HandleToken()?.['class-checked']) classes.push(`${HandleToken()?.['class-checked']}`);
            else classes.push(styles.HandleChecked);
        }

        return classes.join(' ');
    });

    const handleStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {};
        Object.assign(styles, HandleToken()?.style || {});

        if (toggleButtonContext?.checked() && HandleToken()?.['style-checked']) {
            Object.assign(styles, HandleToken()?.['style-checked']);
        }

        return styles;
    });

    return (
        <div
            class={handleClasses()}
            style={handleStyles()}>
            {HandleToken()?.children}
        </div>
    )
}
