import { ParentComponent } from "solid-js";
import styles from './Content.module.css';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Content: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Content} />
}

export default Content;