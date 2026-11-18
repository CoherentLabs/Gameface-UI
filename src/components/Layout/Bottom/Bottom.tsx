import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import { LayoutSectionProps } from "@components/types/LayoutBase";
import styles from './Bottom.module.scss';

const Bottom: ParentComponent<LayoutSectionProps> = (props) => {
    return <LayoutBase 
        {...props} 
        class={[styles.bottom, props.class]} 
        componentStyles={{'flex-basis': props.basis ? `${props.basis}%` : ""}} />
}

export default Bottom;