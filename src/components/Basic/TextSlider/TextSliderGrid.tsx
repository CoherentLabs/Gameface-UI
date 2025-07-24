import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from '@components/Basic/Slider/Slider.module.scss';
import { For, useContext } from 'solid-js';
import { useToken } from '@components/utils/tokenComponents';
import { TextSliderContext } from './TextSlider';
import TextSliderPol, { Pol } from '@components/Basic/TextSlider/TextSliderPol';

export const TextSliderGrid = (props: TokenComponentProps) => {
    const sliderContext = useContext(TextSliderContext)
    const PolToken = useToken(Pol, props.parentChildren);

    return (
        <div class={styles.grid}>
            <For each={sliderContext?.values()}>
                {(pol) => (
                    <TextSliderPol
                        class={PolToken()?.class}
                        style={PolToken()?.style}
                        text-class={PolToken()?.['text-class']}
                        text-style={PolToken()?.['text-style']}
                        value={pol} />
                )}
            </For>
        </div>
    )
}