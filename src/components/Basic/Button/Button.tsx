import { ParentComponent, mergeProps } from "solid-js";
import { ComponentProps } from "../../types/ComponentProps";
import useBaseComponent from "../../BaseComponent/BaseComponent";
import styles from './Button.module.css';

export interface ButtonProps extends ComponentProps {
    disabled?: boolean
    textFit?: boolean
    size?: 'large' | 'middle' | 'small'
}

const buttonSizes = new Set(['large', 'middle', 'small']);

const getButtonClasses = (props: ButtonProps) => {
    const buttonClasses = [styles.Button];

    if (props.textFit) buttonClasses.push(styles[`Button-text-fit`]);
    if (props.disabled) buttonClasses.push(styles[`Button-disabled`]);
    if (buttonSizes.has(props.size as string)) buttonClasses.push(styles[`Button-${props.size}`]);

    return buttonClasses;
}

const Button: ParentComponent<ButtonProps> = (props) => {
    const mergedProps = mergeProps({ textFit: true }, props);
    props.componentClasses = getButtonClasses(mergedProps).join(' ');

    const {className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return <button disabled={props.disabled} 
                    ref={props.ref as HTMLButtonElement}
                    class={className()}
                    style={inlineStyles()}
                    use:forwardEvents={props}
                    use:forwardAttrs={props}>
                {props.children}
            </button>
}

export default Button;