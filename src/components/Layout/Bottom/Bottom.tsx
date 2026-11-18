import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import { LayoutSectionProps } from "@components/types/LayoutBase";
import styles from './Bottom.module.scss';

const Bottom: ParentComponent<LayoutSectionProps> = (props) => {
    return <LayoutBase 
        {...props} 
        class={[styles.bottom, props.class]} 
        style={{ 'flex-basis': props.basis ? `${props.basis}%` : "", ...props.style }} />
}

export default Bottom;