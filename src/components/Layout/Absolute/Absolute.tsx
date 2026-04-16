import { createMemo, ParentComponent } from "solid-js";
import styles from './Absolute.module.scss';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

interface AbsoluteProps extends ComponentBaseProps {
    top?: string,
    left?: string,
    right?: string,
    bottom?: string,
    center?: boolean | 'x' | 'y',
}

const Absolute: ParentComponent<AbsoluteProps> = (props) => {
    const positionStyle = createMemo(() => {
        return {
            top: props.top,
            left: props.left,
            right: props.right,
            bottom: props.bottom,
        }
    });

    const absoluteClasses = createMemo(() => {
        const base = [styles.absolute];

        const center = props.center;
        if (center) {
            base.push(
                typeof center === "boolean" 
                ? styles.center 
                : styles[`center-${center.toLocaleLowerCase()}`]
            )
        }

        return base.join(" ");
    })

    return <LayoutBase {...props} componentClasses={absoluteClasses} componentStyles={positionStyle} />
}

export default Absolute;