import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { createMemo, JSX, Show, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { SliderContext } from './Slider';

interface SliderThumbProps {
    style?: JSX.CSSProperties,
    class?: string,
}

interface SliderThumbComponentProps extends TokenComponentProps {
    orientation?: 'horizontal' | 'vertical',
}

export const Thumb = createTokenComponent<SliderThumbProps>();

export const SliderThumb = (props: SliderThumbComponentProps) => {
    const sliderContext = useContext(SliderContext);
    const ThumbToken = useToken(Thumb, props.parentChildren);

    const thumbClasses = createMemo(() => {
        const classes = [styles.Thumb];

        if (ThumbToken?.()?.class) classes.push(ThumbToken?.()?.class as string);
        if (props.orientation === 'vertical') classes.push(styles.Vertical)

        return classes.join(' ');
    });

    const thumbStyle = createMemo(() => {
        const position = props.orientation === 'vertical' ? {top: `${100 - sliderContext!.percent()}%`} : {left: `${sliderContext!.percent()}%`}
        return {...ThumbToken()?.style, ...position}
    })

    return (
        <Show when={ThumbToken()}>
            <div class={thumbClasses()} style={thumbStyle()}>{sliderContext?.value()}</div>
        </Show>
    )
}