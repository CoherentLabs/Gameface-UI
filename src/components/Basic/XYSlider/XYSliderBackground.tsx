import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './XYSlider.module.scss';
import { createMemo, Show, ParentProps } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import { forwardAttrs } from '@components/BaseComponent/BaseComponent';
export const Background = createTokenComponent<ParentProps<TokenBase>>();

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