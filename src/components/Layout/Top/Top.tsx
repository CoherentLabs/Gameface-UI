import { ParentComponent } from "solid-js";
import styles from './Top.module.scss';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Top: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.top} />
}

export default Top;