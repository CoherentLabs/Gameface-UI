import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './XYSlider.module.scss';
import { createMemo, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';
import { XYSliderContext } from './XYSlider';

export const Handle = createTokenComponent();

export const XYSliderHandle = (props: TokenComponentProps) => {
    const sliderContext = useContext(XYSliderContext);
    const HandleToken = useToken(Handle, props.parentChildren);

    const handleClasses = createMemo(() => {
        const classes = [styles.handle];

        if (HandleToken?.()?.class) classes.push(HandleToken?.()?.class as string);
        if (sliderContext?.hasTransition()) classes.push(styles.transition)

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
        <div class={handleClasses()} style={handleStyle()} use:forwardAttrs={HandleToken()}></div>
    )
}