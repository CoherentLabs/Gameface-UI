import { ParentProps, Component, ParentComponent, JSX  } from "solid-js";
import styles from './Relative.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface RelativeProps extends LayoutBaseProps {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const Relative: ParentComponent<RelativeProps> = (props) => {
    const positionStyle = {
        ...(props.top !== undefined ? { top: props.top } : {}),
        ...(props.left !== undefined ? { left: props.left } : {}),
        ...(props.right !== undefined ? { right: props.right } : {}),
        ...(props.bottom !== undefined ? { bottom: props.bottom } : {}),
    }

    return <LayoutBase {...props} componentClasses={styles.Relative} componentStyles={positionStyle} />
}

export default Relative;