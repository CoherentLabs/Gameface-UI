import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './XYSlider.module.css';
import { createMemo, JSX, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { XYSliderContext } from './XYSlider';

interface XYSliderHandleProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Handle = createTokenComponent<XYSliderHandleProps>();

export const XYSliderHandle = (props: TokenComponentProps) => {
    const sliderContext = useContext(XYSliderContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.Handle];

        if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class as string);

        return classes.join(' ');
    });

    const handleStyle = createMemo(() => {
        const position = {
            left: `${sliderContext?.position().x}%`,
            top: `${sliderContext?.position().y}%`
        }
        return { ...HandleToken()?.style, ...position }
    })

    return (
        <div class={handleClasses()} style={handleStyle()}></div>
    )
}