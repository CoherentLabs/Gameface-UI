import { ParentComponent } from "solid-js";
import styles from './Row.module.css';
import ComponentBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

const Row: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Row}/>
}

export default Row;