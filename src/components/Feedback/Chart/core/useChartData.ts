import { Accessor, createMemo, createSignal } from 'solid-js';
import { ChartSeries } from '../types';

export interface NormalisedData {
    /** Union of every `point.type`, in first-seen order across the original series order. */
    categories: string[];
    /** Row-major, `matrix[seriesIndex * categories.length + categoryIndex]`. Missing points are 0. */
    matrix: Float64Array;
    /** Stable per-series identity used to match values across data changes. */
    seriesKeys: string[];
    series: ChartSeries[];
}

const seriesKey = (series: ChartSeries, index: number) => series.id ?? String(index);

/**
 * Normalises `data` into a dense category grid.
 *
 * Categories are the union of ALL series, not just the visible ones, so
 * toggling a series in the legend never makes the axis jump.
 */
export const normalise = (data: ChartSeries[]): NormalisedData => {
    const series = data ?? [];
    const categories: string[] = [];
    const categoryIndex = new Map<string, number>();

    for (const entry of series) {
        for (const point of entry.points ?? []) {
            if (categoryIndex.has(point.type)) continue;

            categoryIndex.set(point.type, categories.length);
            categories.push(point.type);
        }
    }

    const matrix = new Float64Array(series.length * categories.length);

    for (let s = 0; s < series.length; s++) {
        const offset = s * categories.length;

        for (const point of series[s].points ?? []) {
            const value = point.value;
            matrix[offset + categoryIndex.get(point.type)!] = Number.isFinite(value) ? value : 0;
        }
    }

    return { categories, matrix, seriesKeys: series.map(seriesKey), series };
};

export interface ChartDataModel {
    normalised: Accessor<NormalisedData>;
    isSeriesVisible: (seriesIndex: number) => boolean;
    isPointVisible: (seriesIndex: number, pointIndex: number) => boolean;
    toggleSeries: (seriesIndex: number) => void;
    togglePoint: (seriesIndex: number, pointIndex: number) => void;
    /** Indices into the original `data` array, so colours stay bound to the series and not to its rank. */
    visibleIndices: Accessor<number[]>;
}

/**
 * Owns the data grid and what is currently hidden.
 *
 * Visibility is keyed by identity (`series.id` and the category name), never by
 * index, so hiding something survives the data being reordered.
 */
export const useChartData = (
    data: Accessor<ChartSeries[]>,
    onSeriesToggle?: (seriesIndex: number, visible: boolean) => void,
): ChartDataModel => {
    const normalised = createMemo(() => normalise(data()));
    const [hidden, setHidden] = createSignal<Set<string>>(new Set());

    const keyOf = (seriesIndex: number, pointIndex?: number) => {
        const { seriesKeys, categories } = normalised();
        const series = seriesKeys[seriesIndex];
        if (series === undefined) return undefined;

        return pointIndex === undefined ? series : `${series} ${categories[pointIndex]}`;
    };

    const toggle = (key: string | undefined) => {
        if (key === undefined) return undefined;

        const next = new Set(hidden());
        const wasVisible = !next.has(key);

        if (wasVisible) next.add(key);
        else next.delete(key);

        setHidden(next);
        return !wasVisible;
    };

    const isSeriesVisible = (seriesIndex: number) => !hidden().has(keyOf(seriesIndex)!);

    const isPointVisible = (seriesIndex: number, pointIndex: number) =>
        isSeriesVisible(seriesIndex) && !hidden().has(keyOf(seriesIndex, pointIndex)!);

    const toggleSeries = (seriesIndex: number) => {
        const visible = toggle(keyOf(seriesIndex));
        if (visible !== undefined) onSeriesToggle?.(seriesIndex, visible);
    };

    const togglePoint = (seriesIndex: number, pointIndex: number) => {
        toggle(keyOf(seriesIndex, pointIndex));
    };

    const visibleIndices = createMemo(() => {
        const keys = normalised().seriesKeys;
        const hiddenKeys = hidden();

        return keys.reduce<number[]>((acc, key, index) => {
            if (!hiddenKeys.has(key)) acc.push(index);
            return acc;
        }, []);
    });

    return { normalised, isSeriesVisible, isPointVisible, toggleSeries, togglePoint, visibleIndices };
};
