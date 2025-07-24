import { createMemo, JSX, Show } from 'solid-js';
import styles from './Slider.module.scss';

interface PolProps {
    size: 'small' | 'normal',
    value?: number | string,
    'pol-style'?: JSX.CSSProperties,
    'pol-class'?: string
    'pol-value-style'?: JSX.CSSProperties,
    'pol-value-class'?: string
}

const SliderPol = (props: PolProps) => {
    const polClasses = createMemo(() => {
        const classes = [styles['grid-pol-container']];

        if (props.size === 'small') classes.push(styles['grid-pol-small'])
        if (props['pol-class']) classes.push(props['pol-class']);

        return classes.join(' ');
    })

    const polValueClasses = createMemo(() => {
        const classes = [styles['grid-pol-value']];

        if (props['pol-value-class']) classes.push(props['pol-value-class']);

        return classes.join(' ');
    })

    return (
        <div style={props['pol-style']} class={polClasses()}>
            <div class={styles['grid-pol']}></div>
            <Show when={props.size === 'normal'}>
                <div style={props['pol-value-style']} class={polValueClasses()}>{props.value}</div>
            </Show>
        </div>
    )
}

export default SliderPol;