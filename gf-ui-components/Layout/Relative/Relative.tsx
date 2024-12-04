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
        top: props.top,
        left: props.left,
        right: props.right,
        bottom: props.bottom,
    }

    return <LayoutBase {...props} componentClasses={styles.Relative} componentStyles={positionStyle} />
}

export default Relative;