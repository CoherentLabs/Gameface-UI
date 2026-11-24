import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.scss';
import { createMemo, ParentComponent, Show } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';

interface SliderThumbComponentProps extends TokenComponentProps {
    percent: () => number
    value: () => number | string
}

export const Thumb = createTokenComponent();

export const SliderThumb: ParentComponent<SliderThumbComponentProps> = (props) => {
    const ThumbToken = useToken(Thumb, props.parentChildren);

    const thumbClasses = createMemo(() => {
        const classes = [styles.thumb];

        if (ThumbToken?.()?.class) classes.push(ThumbToken?.()?.class as string);

        return classes.join(' ');
    });

    const thumbStyle = createMemo(() => {
        const position = { left: `${props.percent()}%` }
        return { ...ThumbToken()?.style, ...position }
    })

    return (
        <Show when={ThumbToken()}>
            <div class={thumbClasses()} style={thumbStyle()} use:forwardAttrs={ThumbToken()}>{props.value()}</div>
        </Show>
    )
}