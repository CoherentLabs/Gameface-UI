import { ParentComponent, createMemo, mergeProps } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import styles from './Button.module.scss';
import baseComponent from "@components/BaseComponent/BaseComponent";

export interface ButtonProps extends ComponentProps {
    disabled?: boolean
    textFit?: boolean
    size?: 'large' | 'middle' | 'small'
}

const buttonSizes = new Set(['large', 'middle', 'small']);

const getButtonClasses = (props: ButtonProps) => {
    const buttonClasses = [styles.button];

    if (props.textFit) buttonClasses.push(styles[`button-text-fit`]);
    if (props.disabled) buttonClasses.push(styles[`button-disabled`]);
    if (!props.size) buttonClasses.push(styles[`button-middle`]); // Default size is middle
    if (buttonSizes.has(props.size as string)) buttonClasses.push(styles[`button-${props.size}`]);

    return buttonClasses;
}

const Button: ParentComponent<ButtonProps> = (props) => {
    const mergedProps = mergeProps({ textFit: true }, props);
    props.componentClasses = createMemo(() => getButtonClasses(mergedProps).join(' '))

    return <button
        ref={props.ref as HTMLButtonElement}
        use:baseComponent={props}
    >
        {props.children}
    </button>
}

export default Button;