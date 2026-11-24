import { createMemo, JSX } from 'solid-js';
import styles from '@components/Basic/Slider/Slider.module.scss';
import { createTokenComponent, TokenBase } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';

interface PolProps extends TokenBase {
    value?: number | string,
    'text-style'?: JSX.CSSProperties,
    'text-class'?: string
}

export const Pol = createTokenComponent<PolProps>();

const TextSliderPol = (props: PolProps) => {
    const polClasses = createMemo(() => {
        const classes = [styles['grid-pol-container']];

        if (props.class) classes.push(props.class);

        return classes.join(' ');
    })

    const polValueClasses = createMemo(() => {
        const classes = [styles['grid-pol-value']];

        if (props['text-class']) classes.push(props['text-class']);

        return classes.join(' ');
    })

    return (
        <div style={props.style} class={polClasses()} use:forwardAttrs={props}>
            <div class={styles['grid-pol']}></div>
            <div style={props['text-style']} class={polValueClasses()}>{props.value}</div>
        </div>
    )
}

export default TextSliderPol;