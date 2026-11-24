import { Accessor, Component, createSignal } from 'solid-js';
import styles from './Segment.module.scss';
import { TokenComponentProps } from '@components/types/ComponentProps';
import { SegmentIndicatorData } from './Segment';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';

interface SegmentIndicatorProps extends TokenComponentProps {
    data: Accessor<SegmentIndicatorData>
}

export const Indicator = createTokenComponent();

const SegmentIndicator: Component<SegmentIndicatorProps> = (props) => {
    const IndicatorSlot = useToken(Indicator, props.parentChildren);

    const inlineStyles = () => ({
        transform: `translate(${props.data().left}px)`, width: `${props.data().width}px`,
        ...IndicatorSlot()?.style
    });

    return (
        <div 
            style={inlineStyles()}
            use:forwardAttrs={IndicatorSlot()}
            class={`${styles.indicator} ${IndicatorSlot()?.class ?? ''} ${props.data().showTransition ? styles['show-transition'] : ''}`}>
        </div>
    )
}

export default SegmentIndicator;