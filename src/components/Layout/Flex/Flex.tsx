import { createMemo, onSettled, ParentComponent } from "solid-js";
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
    onSettled(() => { warnIfUnsupported(props, 'gap'); });

    const gapStyles = createMemo(() => ({
        gap: props.gap,
        'row-gap': props['row-gap'],
        'column-gap': props['column-gap'],
    }));

    return (
        <LayoutBase 
            {...props} 
            class={[
                styles.flex,
                props.direction && styles[`flex-${props.direction}`],
                props.wrap && styles[`flex-${props.wrap}`],
                props['justify-content'] && styles[`flex-justify-${props['justify-content']}`],
                props['align-items'] && styles[`flex-align-${props['align-items']}`],
                props['align-content'] && styles[`flex-content-${props['align-content']}`],
                props.class,
            ]}
            componentStyles={gapStyles()} 
        />
    );
}

export default Flex