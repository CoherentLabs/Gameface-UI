import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import { LayoutSectionProps } from "@components/types/LayoutBase";
import styles from './Top.module.scss';

const Top: ParentComponent<LayoutSectionProps> = (props) => {
    return <LayoutBase 
        {...props} 
        class={[styles.top, props.class]} 
        style={{ 'flex-basis': props.basis ? `${props.basis}%` : "", ...props.style }} />
}

export default Top;