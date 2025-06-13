import { createMemo, JSX, Show } from 'solid-js';
import styles from './SliderGrid.module.css';

interface PolProps {
    size: 'small' | 'normal',
    value?: number,
    'pol-style'?: JSX.CSSProperties,
    'pol-class'?: string
}

const SliderPol = (props: PolProps) => {
    const polClasses = createMemo(() => {
        const classes = [styles['Grid-Pol-Container']];

        if (props.size === 'small') classes.push(styles['Pol-Small'])
        if (props['pol-class']) classes.push(props['pol-class']);

        return classes.join(' ');
    }) 

    return (
        <div style={props['pol-style']} class={polClasses()} >
            <div class={styles['Grid-Pol']}></div>
            <Show when={props.size === 'normal'}>
                <div>{props.value}</div>
            </Show>
        </div>
    )
}

export default SliderPol;