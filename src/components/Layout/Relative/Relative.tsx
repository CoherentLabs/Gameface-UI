import { ParentComponent } from "solid-js";
import styles from './Relative.module.css';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

interface RelativeProps extends ComponentBaseProps {
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