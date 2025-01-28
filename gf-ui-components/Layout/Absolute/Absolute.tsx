import { ParentComponent } from "solid-js";
import styles from './Absolute.module.css';
import ComponentBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

interface AbsoluteProps extends ComponentBaseProps {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const Absolute: ParentComponent<AbsoluteProps> = (props) => {
    const positionStyle = {
        top: props.top,
        left: props.left,
        right: props.right,
        bottom: props.bottom,
    };

    return <LayoutBase {...props} componentClasses={styles.Absolute} componentStyles={positionStyle} />
}

export default Absolute;