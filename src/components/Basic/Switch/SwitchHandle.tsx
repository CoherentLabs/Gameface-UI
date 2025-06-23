import { createMemo, JSX, ParentComponent, useContext } from "solid-js";
import styles from './Switch.module.css';

import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useToken } from "@components/utils/tokenComponents";
import { SwitchContext } from "./Switch";

interface HandleTokenProps {
    style?: JSX.CSSProperties,
    class?: string,
    'class-checked'?: string
    'style-checked'?: JSX.CSSProperties
}

export const Handle = createTokenComponent<HandleTokenProps>();

export const SwitchHandle: ParentComponent<TokenComponentProps> = (props) => {
    const switchContext = useContext(SwitchContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.Handle];

        if (HandleToken()?.class) classes.push(HandleToken()?.class ?? '');

        if (switchContext?.checked()) {
            if (HandleToken()?.['class-checked']) classes.push(`${HandleToken()?.['class-checked']}`);
            else classes.push(styles.HandleChecked);
        }

        return classes.join(' ');
    });

    const handleStyles = createMemo(() => {
        const styles: JSX.CSSProperties = {};
        Object.assign(styles, HandleToken()?.style || {});

        if (switchContext?.checked() && HandleToken()?.['style-checked']) {
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
