import { createMemo, onMount, ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Flex.module.scss'
import { ComponentBaseProps } from "../../types/ComponentProps";
import { warnIfUnsupported } from "@components/utils/supportsGamefaceFeature";

interface FlexProps extends ComponentBaseProps {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    'justify-content'?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    'align-items'?: 'start' | 'end' | 'center' | 'stretch';
    'align-content'?: 'start' | 'end' | 'center' | 'stretch';
    gap?: string;
    'row-gap'?: string;
    'column-gap'?: string;
}

const Flex: ParentComponent<FlexProps> = (props) => {
    onMount(() => warnIfUnsupported(props, 'gap'));

    const classes = createMemo(() => {
        const flexClasses = [styles.flex];
        if (props.direction) flexClasses.push(styles[`flex-${props.direction}`]);
        if (props.wrap) flexClasses.push(styles[`flex-${props.wrap}`]);
        if (props['justify-content']) flexClasses.push(styles[`flex-justify-${props['justify-content']}`]);
        if (props['align-items']) flexClasses.push(styles[`flex-align-${props['align-items']}`]);
        if (props['align-content']) flexClasses.push(styles[`flex-content-${props['align-content']}`]);
        return flexClasses.join(' ');
    });

    const gapStyles = createMemo(() => ({
        gap: props.gap,
        'row-gap': props['row-gap'],
        'column-gap': props['column-gap'],
    }));

    return (
        <LayoutBase 
            {...props} 
            componentClasses={classes()}
            componentStyles={gapStyles()} 
        />
    );
}

export default Flex