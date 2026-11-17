import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './XYSlider.module.scss';
import { createMemo, JSX, Show } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';
interface XYSliderBackgroundProps extends TokenBase {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Background = createTokenComponent<XYSliderBackgroundProps>();

export const XYSliderBackground = (props: TokenComponentProps) => {
    const BackgroundToken = useToken(Background, props.parentChildren);

    const backgroundClasses = createMemo(() => {
        const classes = [styles.background];

        if (BackgroundToken?.()?.class) classes.push(BackgroundToken?.()?.class as string);

        return classes.join(' ');
    });

    return (
        <div class={backgroundClasses()} style={BackgroundToken()?.style} use:forwardAttrs={BackgroundToken()}>
            <Show when={BackgroundToken()}>
                {BackgroundToken()?.children}
            </Show>
        </div>
    )
}