import { ParentComponent } from "solid-js";
import styles from './Absolute.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface AbsoluteProps extends LayoutBaseProps {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const Absolute: ParentComponent<AbsoluteProps> = (props) => {
    const positionStyle = {
        ...(props.top !== undefined ? { top: props.top } : {}),
        ...(props.left !== undefined ? { left: props.left } : {}),
        ...(props.right !== undefined ? { right: props.right } : {}),
        ...(props.bottom !== undefined ? { bottom: props.bottom } : {}),
    }

    return <LayoutBase {...props} componentClasses={styles.Absolute} componentStyles={positionStyle} />
}

export default Absolute;