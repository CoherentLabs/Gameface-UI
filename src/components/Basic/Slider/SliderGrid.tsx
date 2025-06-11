import { TokenComponentProps } from '@components/types/ComponentProps';
import styles from './SliderGrid.module.css';
import { createMemo, For, JSX, Show, useContext } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';
import { SliderContext } from './Slider';

interface SliderGridProps {
    style?: JSX.CSSProperties,
    class?: string,
    pols?: number,
    'pols-without-text'?: number,
    'pol-style'?: JSX.CSSProperties,
    'pol-class'?: string
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
    const sliderContext = useContext(SliderContext)
    const GridToken = useToken(Grid, props.parentChildren);

    const polsCount = GridToken()?.pols || 5;

    const createPolsArray = () => {
        const isVertical = sliderContext?.isVertical();
        let minValue = props.min, maxValue = props.max;

        if (isVertical) {
            minValue = props.max;
            maxValue = props.min;
        }

        return Array.from({ length: polsCount }, (_, index) => {
            if (index === 0) return minValue;

            if (index === polsCount - 1) return maxValue;

            const step = (props.max - props.min) / (polsCount - 1);
            let nextValue = step * index;
            
            if (!fitsOneDecimal(nextValue)) {
                nextValue = parseFloat(nextValue.toFixed(1));
            }

            return isVertical ? (props.max - nextValue) : (props.min + nextValue);
        });
    }

    const polsArr = createPolsArray();

    const gridClasses = createMemo(() => {
        const classes = [styles.Grid];

        if (GridToken?.()?.class) classes.push(GridToken?.()?.class as string);
        if (sliderContext?.isVertical()) classes.push(styles.Vertical)

        return classes.join(' ');
    });

    return (
        <Show when={GridToken()}>
            <div class={gridClasses()} style={GridToken?.()?.style}>
                <For each={polsArr}>
                    {(pol, index) => (
                        <>
                            <div class={styles['Grid-Pol-Container']}>
                                <div class={styles['Grid-Pol']}></div>
                                <div class={styles['Grid-Pol-Text']}>{pol}</div>
                            </div>
                            <Show when={GridToken()?.['pols-without-text'] && index() < polsCount - 1}>
                                <For each={Array.from({ length: GridToken()?.['pols-without-text'] || 5 })}>
                                    {() => (
                                        <div class={styles['Grid-Pol-Container']}>
                                            <div class={styles['Grid-Pol-Small']}></div>
                                        </div>
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