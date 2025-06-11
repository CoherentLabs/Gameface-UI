import { ComponentProps, TokenComponentProps } from '@components/types/ComponentProps';
import styles from './Slider.module.css';
import { For, JSX, Show } from 'solid-js';
import { createTokenComponent, useToken } from '@components/utils/tokenComponents';

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

export const Grid = createTokenComponent<SliderGridProps>();

export const SliderGrid = (props: SliderGridComponentProps) => {
    const GridToken = useToken(Grid, props.parentChildren);

    const polsCount =  GridToken()?.pols || 5;
    const polsArr = Array.from({ length: polsCount }, (_, index) => {
        if (index === 0) return props.min;

        if (index === polsCount - 1) return props.max

        const step = (props.max - props.min) / (polsCount - 1);
        return props.min + step * index;
    });

    return (
        <Show when={GridToken()}>
            <div class={styles.Grid}>
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