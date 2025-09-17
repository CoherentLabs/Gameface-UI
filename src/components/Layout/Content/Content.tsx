import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import { LayoutSectionProps } from "@components/types/LayoutBase";
import styles from './Content.module.scss';

const Content: ParentComponent<LayoutSectionProps> = (props) => {
    return <LayoutBase 
        {...props} 
        componentClasses={styles.content} 
        componentStyles={{'flex-basis': props.basis ? `${props.basis}%` : ""}} />
}

export default Content;