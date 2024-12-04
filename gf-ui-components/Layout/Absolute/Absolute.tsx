import { createEffect, createSignal, mergeProps, ParentComponent } from "solid-js";
import styles from './Absolute.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface AbsoluteProps extends LayoutBaseProps {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const Absolute: ParentComponent<AbsoluteProps> = (passedProps) => {
    const props = mergeProps(passedProps)

    const positionStyle = {
        top: props.top,
        left: props.left,
        right: props.right,
        bottom: props.bottom,
    };

    return <LayoutBase {...props} componentClasses={styles.Absolute} componentStyles={positionStyle} />
}

export default Absolute;