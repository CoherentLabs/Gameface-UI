import { ParentComponent } from "solid-js";
import styles from './Top.module.css';
import ComponentBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

const Top: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Top}/>
}

export default Top;