import { createMemo, JSX, ParentComponent, useContext, ParentProps } from "solid-js";
import styles from './ToggleButton.module.scss';

import { TokenComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, TokenBase, useToken } from "@components/utils/tokenComponents";
import { forwardAttrs } from "@components/BaseComponent/BaseComponent";
import { ToggleButtonContext } from "./ToggleButton";

interface HandleTokenProps extends ParentProps<TokenBase> {
    'class-checked'?: string
    'style-checked'?: JSX.CSSProperties
}

export const Handle = createTokenComponent<HandleTokenProps>();

export const ToggleButtonHandle: ParentComponent<TokenComponentProps> = (props) => {
    const toggleButtonContext = useContext(ToggleButtonContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.handle];

        if (HandleToken()?.class) classes.push(HandleToken()?.class ?? '');

        if (toggleButtonContext?.checked()) {
            classes.push(styles['handle-checked']);
            if (HandleToken()?.['class-checked']) classes.push(`${HandleToken()?.['class-checked']}`);
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
            style={handleStyles()}
            use:forwardAttrs={HandleToken()}>
            {HandleToken()?.children}
        </div>
    )
}
