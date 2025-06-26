import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from '@components/Basic/Slider/SliderGrid.module.css';
import { createMemo, For, JSX, Show, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { TextSliderContext } from './TextSlider';
import SliderPol from '@components/Basic/Slider/SliderPol';

interface TextSliderGridProps {
    style?: JSX.CSSProperties,
    class?: string,
    'pol-style'?: JSX.CSSProperties,
    'pol-class'?: string
    'pol-value-style'?: JSX.CSSProperties,
    'pol-value-class'?: string
}

export const Grid = createTokenComponent<TextSliderGridProps>();

export const TextSliderGrid = (props: TokenComponentProps) => {
    const sliderContext = useContext(TextSliderContext)
    const GridToken = useToken(Grid, props.parentChildren);

    const gridClasses = createMemo(() => {
        const classes = [styles.Grid];

        if (GridToken?.()?.class) classes.push(GridToken?.()?.class as string);

        return classes.join(' ');
    });

    return (
        <Show when={GridToken()}>
            <div class={gridClasses()} style={GridToken?.()?.style}>
                <For each={sliderContext?.values()}>
                    {(pol) => (
                        <SliderPol
                            size='normal'
                            pol-class={GridToken()?.['pol-class']}
                            pol-style={GridToken()?.['pol-style']}
                            pol-value-class={GridToken()?.['pol-value-class']}
                            pol-value-style={GridToken()?.['pol-value-style']}
                            value={pol} />
                    )}
                </For>
            </div>
        </Show>
    )
}