import { Accessor, createSignal, onCleanup } from 'solid-js';
import { ChartSize } from '../types';

/**
 * Measures the plot container and exposes its size as a signal.
 *
 * Measurement happens only inside the ResizeObserver callback and once on
 * mount — never during render — so geometry memos never force a reflow.
 *
 * `clientWidth`/`clientHeight` (the padding box) is deliberate: the SVG and the
 * overlay layers are absolutely positioned with `inset: 0`, which resolves
 * against the padding box too, so the two always agree.
 */
export const useChartSize = (): [Accessor<ChartSize>, (element: HTMLElement) => void] => {
    const [size, setSize] = createSignal<ChartSize>({ width: 0, height: 0 });
    let observer: ResizeObserver | undefined;

    const measure = (element: HTMLElement) => {
        const width = element.clientWidth;
        const height = element.clientHeight;

        setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }));
    };

    const observe = (element: HTMLElement) => {
        measure(element);

        observer = new ResizeObserver(() => measure(element));
        observer.observe(element);
    };

    onCleanup(() => observer?.disconnect());

    return [size, observe];
};
