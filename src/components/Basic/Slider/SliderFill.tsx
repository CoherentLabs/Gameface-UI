import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { createMemo, JSX, ParentComponent } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

interface SliderFillProps {
    style?: JSX.CSSProperties,
    class?: string,
}

interface SliderFillComponentProps extends TokenComponentProps {
    percent: () => number
}

export const Fill = createTokenComponent<SliderFillProps>();

export const SliderFill:ParentComponent<SliderFillComponentProps> = (props) => {
    const FillToken = useToken(Fill, props.parentChildren);

    const fillClasses = createMemo(() => {
        const classes = [styles.Fill];

        if (FillToken?.()?.class) classes.push(FillToken?.()?.class as string);

        return classes.join(' ');
    });

    const fillStyle = createMemo(() => {
        const position = {width: `${props.percent()}%`}
        return {...FillToken()?.style, ...position}
    })

    return (
        <div class={fillClasses()} style={fillStyle()}></div>
    )
}