import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './XYSlider.module.css';
import { Show } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

export const Background = createTokenComponent();

export const XYSliderBackground = (props: TokenComponentProps) => {
    const BackgroundToken = useToken(Background, props.parentChildren);

    return (
        <>
            <Show when={!BackgroundToken()}>
                <div class={styles.Background}></div>
            </Show>
            <Show when={BackgroundToken()}>
                {BackgroundToken()?.children}
            </Show>
        </>
    )
}