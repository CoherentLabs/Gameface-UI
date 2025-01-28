import { ParentComponent } from "solid-js";
import ComponentBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";
import styles from './Block.module.css'

const Block: ParentComponent<ComponentBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Block}/>
}

export default Block;