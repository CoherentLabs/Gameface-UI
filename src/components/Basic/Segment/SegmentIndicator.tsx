import { Accessor, Component, createSignal, JSX } from 'solid-js';
import styles from './Segment.module.css';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { SegmentIndicatorData } from './Segment';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

interface SegmentIndicatorProps extends TokenComponentProps {
    data: Accessor<SegmentIndicatorData>
}

interface SegmentIndicatorSlotProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Indicator = createTokenComponent<SegmentIndicatorSlotProps>();

const SegmentIndicator: Component<SegmentIndicatorProps> = (props) => {
    const IndicatorSlot = useToken(Indicator, props.parentChildren);
    const [opacity, setOpacity] = createSignal(0);

    const inlineStyles = () => ({
        transform: `translate(${props.data().left}px)`, width: `${props.data().width}px`, opacity: opacity(),
        ...IndicatorSlot()?.style
    });

    return (
        <div 
            onTransitionStart={() => setOpacity(1)} 
            onTransitionEnd={() => setOpacity(0)} 
            style={inlineStyles()} 
            class={`${styles.Indicator} ${IndicatorSlot()?.class ?? ''} ${props.data().showTransition ? styles['show-transition'] : ''}`}>
        </div>
    )
}

export default SegmentIndicator;