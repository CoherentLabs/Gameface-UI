import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.scss';
import { createMemo, JSX } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

interface SliderHandleProps {
    style?: JSX.CSSProperties,
    class?: string,
    classActive?: string,
    styleActive?: JSX.CSSProperties
}

interface SliderHandleComponentProps extends TokenComponentProps {
    handleMouseDown: (e: MouseEvent) => void
    percent: () => number
    active?: () => boolean
}

export const Handle = createTokenComponent<SliderHandleProps>();

export const SliderHandle = (props: SliderHandleComponentProps) => {
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.handle];

        if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class as string);
        if (props.active?.()) {
             classes.push(HandleToken?.()?.classActive ||styles['handle-active']);
        }

        return classes.join(' ');
    });

    const handleStyle = createMemo(() => {
        const position = { left: `${props.percent()}%` }
        return { ...HandleToken()?.style, ...position, ...(props.active?.() && HandleToken()?.styleActive) }
    })

    return (
        <div class={handleClasses()} style={handleStyle()} onMouseDown={props.handleMouseDown}></div>
    )
}