import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.scss';
import { createMemo, ParentComponent } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';

interface SliderFillComponentProps extends TokenComponentProps {
    percent: () => number
}

export const Fill = createTokenComponent();

export const SliderFill:ParentComponent<SliderFillComponentProps> = (props) => {
    const FillToken = useToken(Fill, props.parentChildren);

    const fillClasses = createMemo(() => {
        const classes = [styles.fill];

        if (FillToken?.()?.class) classes.push(FillToken?.()?.class as string);

        return classes.join(' ');
    });

    const fillStyle = createMemo(() => {
        const position = {width: `${props.percent()}%`}
        return {...FillToken()?.style, ...position}
    })

    return (
        <div class={fillClasses()} style={fillStyle()} use:forwardAttrs={FillToken()}></div>
    )
}