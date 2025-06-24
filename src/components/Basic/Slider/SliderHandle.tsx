import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { createMemo, JSX, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { SliderContext } from './Slider';

interface SliderHandleProps {
    style?: JSX.CSSProperties,
    class?: string,
}

interface SliderHandleComponentProps extends TokenComponentProps {
    handleMouseDown: (e: MouseEvent) => void 
}

export const Handle = createTokenComponent<SliderHandleProps>();

export const SliderHandle = (props: SliderHandleComponentProps) => {
    const sliderContext = useContext(SliderContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.Handle];

        if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class as string);

        return classes.join(' ');
    });

    const handleStyle = createMemo(() => {
        const position = {left: `${sliderContext!.percent()}%`}
        return {...HandleToken()?.style, ...position}
    })

    return (
        <div class={handleClasses()} style={handleStyle()} onMouseDown={props.handleMouseDown}></div>
    )
}