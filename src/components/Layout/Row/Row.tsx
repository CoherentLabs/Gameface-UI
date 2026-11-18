import { ParentComponent } from "solid-js";
import styles from './Row.module.scss';
import { ComponentBaseProps } from "../../types/ComponentProps";
import LayoutBase from "../LayoutBase";

const Row: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} class={[styles.row, props.class]} />
}

export default Row;