import { ParentComponent } from "solid-js";
import LayoutBaseProps from "../../types/LayoutBase";
import LayoutBase from "../LayoutBase";
import styles from './Block.module.css'

const Block: ParentComponent<LayoutBaseProps> = (props) => {
    return <LayoutBase {...props} componentClasses={styles.Block}/>
}

export default Block;