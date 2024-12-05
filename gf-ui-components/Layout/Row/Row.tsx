import { ParentComponent } from "solid-js";
import styles from './Row.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

const Row: ParentComponent<LayoutBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Row}/>
}

export default Row;