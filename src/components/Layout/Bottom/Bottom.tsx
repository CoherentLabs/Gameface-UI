import { ParentComponent } from "solid-js";
import styles from './Bottom.module.css';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Bottom: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Bottom} />
}

export default Bottom;