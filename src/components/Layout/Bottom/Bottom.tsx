import { ParentComponent } from "solid-js";
import styles from './Bottom.module.scss';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Bottom: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.bottom} />
}

export default Bottom;