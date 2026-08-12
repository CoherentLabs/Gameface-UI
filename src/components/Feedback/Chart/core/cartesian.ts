import { ChartMargin } from '../types';
import { NormalisedData } from './useChartData';
import { niceDomain } from './scales';

/** One value's extent along the value axis, in data units. */
export interface StackSpan {
    seriesIndex: number;
    categoryIndex: number;
    from: number;
    to: number;
}

/**
 * Computes the value extents for every mark.
 *
 * Grouped: every bar runs from the zero baseline to its value, so a negative
 * value simply runs the other way.
 *
 * Stacked: positives accumulate upward from zero and negatives downward, so a
 * stack containing both does not cancel itself out into a misleading total.
 * This is what d3's `stackOffsetDiverging` does.
 */
export const computeSpans = (
    data: NormalisedData,
    values: Float64Array,
    visibleSeries: number[],
    stacked: boolean,
): StackSpan[] => {
    const categoryCount = data.categories.length;
    const spans: StackSpan[] = [];

    if (!stacked) {
        for (const seriesIndex of visibleSeries) {
            const offset = seriesIndex * categoryCount;

            for (let c = 0; c < categoryCount; c++) {
                spans.push({ seriesIndex, categoryIndex: c, from: 0, to: values[offset + c] ?? 0 });
            }
        }

        return spans;
    }

    const positiveTop = new Float64Array(categoryCount);
    const negativeBottom = new Float64Array(categoryCount);

    for (const seriesIndex of visibleSeries) {
        const offset = seriesIndex * categoryCount;

        for (let c = 0; c < categoryCount; c++) {
            const value = values[offset + c] ?? 0;

            if (value < 0) {
                const from = negativeBottom[c];
                negativeBottom[c] = from + value;
                spans.push({ seriesIndex, categoryIndex: c, from, to: negativeBottom[c] });
            } else {
                const from = positiveTop[c];
                positiveTop[c] = from + value;
                spans.push({ seriesIndex, categoryIndex: c, from, to: positiveTop[c] });
            }
        }
    }

    return spans;
};

/**
 * The value domain, always including zero.
 *
 * Bars are read against a baseline; a domain that floated away from zero would
 * make a small difference look like a large one.
 */
export const computeDomain = (
    spans: StackSpan[],
    override: [number, number] | undefined,
    nice: boolean,
): [number, number] => {
    if (override) return override;

    let min = 0;
    let max = 0;

    for (const span of spans) {
        if (span.to < min) min = span.to;
        if (span.to > max) max = span.to;
        if (span.from < min) min = span.from;
        if (span.from > max) max = span.from;
    }

    // An all-zero data set still needs a domain with width.
    if (min === 0 && max === 0) return [0, 1];

    return nice ? niceDomain(min, max) : [min, max];
};

export interface MarginInput {
    hasValueAxis: boolean;
    hasCategoryAxis: boolean;
    horizontal: boolean;
    valueAxisWidth: number;
    axisHeight: number;
}

/**
 * Space reserved for the axis labels, which are HTML sitting outside the plot.
 *
 * The value axis needs room for its widest label; the category axis needs one
 * line of text. Orientation swaps which side each lands on.
 */
export const computeMargin = (input: MarginInput): ChartMargin => {
    const { hasValueAxis, hasCategoryAxis, horizontal, valueAxisWidth, axisHeight } = input;

    const left = horizontal
        ? (hasCategoryAxis ? valueAxisWidth : 0)
        : (hasValueAxis ? valueAxisWidth : 0);

    const bottom = horizontal
        ? (hasValueAxis ? axisHeight : 0)
        : (hasCategoryAxis ? axisHeight : 0);

    // A label centred on the last tick overhangs the plot; keep half of it.
    return { top: 8, right: 8, bottom, left };
};
