import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { createMemo, JSX } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

interface SliderHandleProps {
    style?: JSX.CSSProperties,
    class?: string,
}

interface SliderHandleComponentProps extends TokenComponentProps {
    handleMouseDown: (e: MouseEvent) => void
    percent: () => number
}

export const Handle = createTokenComponent<SliderHandleProps>();

export const SliderHandle = (props: SliderHandleComponentProps) => {
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.Handle];

        if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class as string);

        return classes.join(' ');
    });

    const handleStyle = createMemo(() => {
        const position = { left: `${props.percent()}%` }
        return { ...HandleToken()?.style, ...position }
    })

    return (
        <div class={handleClasses()} style={handleStyle()} onMouseDown={props.handleMouseDown}></div>
    )
}