import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import { LayoutSectionProps } from "@components/types/LayoutBase";
import styles from './Top.module.scss';

const Top: ParentComponent<LayoutSectionProps> = (props) => {
    return <LayoutBase 
        {...props} 
        componentClasses={styles.bottom} 
        componentStyles={{'flex-basis': props.basis ? `${props.basis}%` : ""}} />
}

export default Top;