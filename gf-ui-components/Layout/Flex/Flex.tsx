import { ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Flex.module.css'
import ComponentBaseProps from "../../types/LayoutBase";

interface FlexProps extends ComponentBaseProps {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    'justify-content'?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    'align-items'?: 'start' | 'end' | 'center' | 'stretch';
    'align-content'?: 'start' | 'end' | 'center' | 'stretch';
}

const getFlexProperties = (props: FlexProps) => {
    let flexClasses = [styles.Flex];

    if(props.direction) flexClasses.push(styles[`Flex-${props.direction}`]);
    if(props.wrap) flexClasses.push(styles[`Flex-${props.wrap}`]);
    if(props['justify-content']) flexClasses.push(styles[`Flex-justify-${props['justify-content']}`]);
    if(props['align-items']) flexClasses.push(styles[`Flex-align-${props['align-items']}`]);
    if(props['align-content']) flexClasses.push(styles[`Flex-content-${props['align-content']}`]);

    return flexClasses
}

const Flex: ParentComponent<FlexProps> = (props) => {
    return <LayoutBase {...props} componentClasses={getFlexProperties(props).join(' ')} />
}

export default Flex