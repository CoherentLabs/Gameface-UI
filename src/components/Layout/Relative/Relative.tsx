import { createMemo, ParentComponent } from "solid-js";
import styles from './Relative.module.scss';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

interface RelativeProps extends ComponentBaseProps {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
}

const Relative: ParentComponent<RelativeProps> = (props) => {
    const positionStyle = createMemo(() => {
        return {
            top: props.top,
            left: props.left,
            right: props.right,
            bottom: props.bottom,
        }
    });

    return <LayoutBase {...props} componentClasses={styles.relative} componentStyles={positionStyle} />
}

export default Relative;