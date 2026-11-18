import { createMemo, ParentComponent, useContext } from "solid-js";
import { JSX } from "@solidjs/web";
import styles from './ToggleButton.module.scss';

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
    const HandleToken = useToken(Handle, () => props.parentChildren);

    const handleClasses = () => {
        const isChecked = toggleButtonContext?.checked();
        return [
            styles.handle,
            HandleToken()?.class,
            isChecked && styles['handle-checked'],
            isChecked && HandleToken()?.['class-checked'],
        ];
    };

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
