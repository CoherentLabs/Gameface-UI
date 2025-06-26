import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './SliderGrid.module.css';
import { createMemo, For, JSX, Show } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import SliderPol from './SliderPol';

interface SliderGridProps {
    style?: JSX.CSSProperties,
    class?: string,
    pols?: number,
    'pols-without-text'?: number,
    'pol-style'?: JSX.CSSProperties,
    'pol-class'?: string
    'pol-value-style'?: JSX.CSSProperties,
    'pol-value-class'?: string
}

interface SliderGridComponentProps extends TokenComponentProps {
    min: number,
    max: number,
}

function fitsOneDecimal(v: number) {
  return v === parseFloat(v.toFixed(1));
}

export const Grid = createTokenComponent<SliderGridProps>();

export const SliderGrid = (props: SliderGridComponentProps) => {
    const GridToken = useToken(Grid, props.parentChildren);

    const polsCount = GridToken()?.pols || 5;

    const createPolsArray = () => {
        let minValue = props.min, maxValue = props.max;

        return Array.from({ length: polsCount }, (_, index) => {
            if (index === 0) return minValue;

            if (index === polsCount - 1) return maxValue;

            const step = (props.max - props.min) / (polsCount - 1);
            let nextValue = step * index;
            
            if (!fitsOneDecimal(nextValue)) {
                nextValue = parseFloat(nextValue.toFixed(1));
            }

            return (props.min + nextValue);
        });
    }

    const polsArr = createPolsArray();

    const gridClasses = createMemo(() => {
        const classes = [styles.Grid];

        if (GridToken?.()?.class) classes.push(GridToken?.()?.class as string);

        return classes.join(' ');
    });

    return (
        <Show when={GridToken()}>
            <div class={gridClasses()} style={GridToken?.()?.style}>
                <For each={polsArr}>
                    {(pol, index) => (
                        <>
                            <SliderPol 
                                size='normal' 
                                pol-class={GridToken()?.['pol-class']} 
                                pol-style={GridToken()?.['pol-style']} 
                                value={pol}/>
                            <Show when={GridToken()?.['pols-without-text'] && index() < polsCount - 1}>
                                <For each={Array.from({ length: GridToken()?.['pols-without-text'] || 5 })}>
                                    {() => (
                                        <SliderPol 
                                            size='small' 
                                            pol-class={GridToken()?.['pol-class']} 
                                            pol-style={GridToken()?.['pol-style']}
                                            pol-value-class={GridToken()?.['pol-value-class']} 
                                            pol-value-style={GridToken()?.['pol-value-style']} />
                                    )}
                                </For>
                            </Show>
                        </>
                    )}
                </For>
            </div>
        </Show>
    )
}