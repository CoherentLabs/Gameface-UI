import { ParentComponent } from "solid-js";
import styles from './Content.module.scss';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Content: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.content} />
}

export default Content;