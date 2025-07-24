import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Flex.module.scss'
import { ComponentBaseProps } from "../../types/ComponentProps";

interface FlexProps extends ComponentBaseProps {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    'justify-content'?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    'align-items'?: 'start' | 'end' | 'center' | 'stretch';
    'align-content'?: 'start' | 'end' | 'center' | 'stretch';
}

const getFlexProperties = (props: FlexProps) => {
    let flexClasses = [styles.Flex];

    if (props.direction) flexClasses.push(styles[`flex-${props.direction}`]);
    if (props.wrap) flexClasses.push(styles[`flex-${props.wrap}`]);
    if (props['justify-content']) flexClasses.push(styles[`flex-justify-${props['justify-content']}`]);
    if (props['align-items']) flexClasses.push(styles[`flex-align-${props['align-items']}`]);
    if (props['align-content']) flexClasses.push(styles[`flex-content-${props['align-content']}`]);

    return flexClasses
}

const Flex: ParentComponent<FlexProps> = (props) => {
    return <LayoutBase {...props} componentClasses={getFlexProperties(props).join(' ')} />
}

export default Flex