import { ParentComponent } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import styles from './Button.module.scss';
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

export interface ButtonProps extends ComponentProps {
    disabled?: boolean
    textFit?: boolean
    size?: 'large' | 'middle' | 'small'
}

const buttonSizes = new Set(['large', 'middle', 'small']);

const Button: ParentComponent<ButtonProps> = (props) => {
    // `textFit` defaults to true; `size` defaults to middle.
    const sizeClass = () => {
        if (!props.size) return styles['button-middle'];
        return buttonSizes.has(props.size) ? styles[`button-${props.size}`] : undefined;
    };

    return <button
        class={[
            styles.button,
            (props.textFit ?? true) && styles['button-text-fit'],
            props.disabled && styles['button-disabled'],
            sizeClass(),
            props.class,
        ]}
        style={props.style}
        ref={[
            exposeRef(props),
            baseComponent(props),
            navigationActions({
                anchor: props.anchor,
                ...props.onAction,
            }),
        ]}>
        {props.children}
    </button>
}

export default Button;
