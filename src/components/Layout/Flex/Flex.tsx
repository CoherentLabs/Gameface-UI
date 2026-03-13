import { createMemo, onMount, ParentComponent } from "solid-js";
import LayoutBase from "../LayoutBase";
import styles from './Flex.module.scss'
import { ComponentBaseProps } from "../../types/ComponentProps";
import { GAMEFACE_VERSION, verIsAtLeast } from "@components/utils/gamefaceVersion";

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

let warningShown = false;

const Flex: ParentComponent<FlexProps> = (props) => {
    onMount(() => {
        const hasGap = !!(props.gap || props["row-gap"] || props["column-gap"]);
        if (!warningShown && hasGap && !verIsAtLeast(2, 2)) {
            console.warn(
                `[Gameface UI] The "gap" property is unsupported in Gameface v${GAMEFACE_VERSION}. Upgrade to 2.2+`
            );
            warningShown = true;
        }
    });

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