import { createMemo, JSX } from 'solid-js';
import styles from '@components/Basic/Slider/Slider.module.scss';
import { createTokenComponent } from '@components/utils/tokenComponents';

interface PolProps {
    value?: number | string,
    style?: JSX.CSSProperties,
    class?: string
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
        <div style={props.style} class={polClasses()}>
            <div class={styles['grid-pol']}></div>
            <div style={props['text-style']} class={polValueClasses()}>{props.value}</div>
        </div>
    )
}

export default TextSliderPol;