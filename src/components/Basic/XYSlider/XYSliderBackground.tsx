import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './XYSlider.module.css';
import { createMemo, JSX, Show } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
interface XYSliderBackgroundProps {
    style?: JSX.CSSProperties,
    class?: string,
}

export const Background = createTokenComponent<XYSliderBackgroundProps>();

export const XYSliderBackground = (props: TokenComponentProps) => {
    const BackgroundToken = useToken(Background, props.parentChildren);

    const backgroundClasses = createMemo(() => {
        const classes = [styles.Background];

        if (BackgroundToken?.()?.class) classes.push(BackgroundToken?.()?.class as string);

        return classes.join(' ');
    });

    return (
        <div class={backgroundClasses()} style={BackgroundToken()?.style}>
            <Show when={BackgroundToken()}>
                {BackgroundToken()?.children}
            </Show>
        </div>
    )
}