import { ParentComponent } from "solid-js";
import styles from './Bottom.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

const Bottom: ParentComponent<LayoutBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Block} />
}

export default Bottom;