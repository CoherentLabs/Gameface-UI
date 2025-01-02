import { ParentComponent } from "solid-js";
import styles from './Content.module.css';
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";

const Content: ParentComponent<LayoutBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Content}/>
}

export default Content;