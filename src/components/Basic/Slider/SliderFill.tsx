import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { createMemo, JSX, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { SliderContext } from './Slider';

interface SliderFillProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Fill = createTokenComponent<SliderFillProps>();

export const SliderFill = (props: TokenComponentProps) => {
    const sliderContext = useContext(SliderContext);
    const FillToken = useToken(Fill, props.parentChildren);

    const fillClasses = createMemo(() => {
        const classes = [styles.Fill];

        if (FillToken?.()?.class) classes.push(FillToken?.()?.class as string);

        return classes.join(' ');
    });

    const fillStyle = createMemo(() => {
        const position = {width: `${sliderContext!.percent()}%`}
        return {...FillToken()?.style, ...position}
    })

    return (
        <div class={fillClasses()} style={fillStyle()}></div>
    )
}