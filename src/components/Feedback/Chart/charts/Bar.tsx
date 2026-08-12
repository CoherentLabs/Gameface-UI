import { createMemo, Index, ParentComponent, Show } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { BaseChartProps, ChartHit, LegendEntry } from '../types';
import { Grid, Labels, Legend, Tooltip, XAxis, YAxis } from '../slots';
import { useChartData } from '../core/useChartData';
import { useChartTween } from '../core/useChartTween';
import { useChartSize } from '../core/useChartSize';
import { resolveHoverMode, useChartHover } from '../core/useChartHover';
import { createBarResolver, CartesianBar } from '../core/resolvers/cartesian';
import { computeDomain, computeMargin, computeSpans } from '../core/cartesian';
import { bandCentre, createBandScale, createLinearScale } from '../core/scales';
import { createPointEvent } from '../core/events';
import { DEFAULT_PALETTE, resolveColor } from '../core/palette';
import { formatChartNumber } from '../core/radius';
import ChartRoot from '../parts/ChartRoot';
import ChartLabels, { ChartLabelAnchor } from '../parts/ChartLabels';
import { AxisTick, ChartAxisLabels, ChartGridLines } from '../parts/ChartAxes';

export interface BarFillTokenProps extends TokenBase {
    /** Bar thickness as pixels or a share of its band, e.g. `'60%'`. */
    width?: number | string;
    /** Gap between bars within a group, in pixels. */
    gap?: number;
    /** Gap between category groups, as a share of the band. Defaults to 0.2. */
    groupGap?: number;
    /** Rounds the data end only, in pixels. Defaults to 4. */
    cornerRadius?: number;
}

export const Fill = createTokenComponent<BarFillTokenProps>();

export interface BarProps extends BaseChartProps {
    layout?: 'grouped' | 'stacked';
    orientation?: 'vertical' | 'horizontal';
    /** Overrides the computed value domain. */
    domain?: [number, number];
    /** Rounds the computed domain out to readable tick values. Defaults to true. */
    nice?: boolean;
}

/** Room for axis labels, which are HTML sitting outside the plot. */
const VALUE_AXIS_WIDTH = 40;
const AXIS_HEIGHT = 20;
const DEFAULT_CORNER_RADIUS = 4;
const DEFAULT_GROUP_GAP = 0.2;
/** Surface-coloured separation between stacked segments and adjacent bars. */
const MARK_GAP = 2;

/**
 * Builds a bar as a `<path>` rather than a `<rect>`.
 *
 * Gameface documents attribute animation on primitives (`rect@width`) as less
 * reliable than on a path, and a path also lets only the *data end* be rounded
 * — the baseline end must stay square or bars appear to float.
 */
const barPath = (x: number, y: number, width: number, height: number, radius: number, side: 'top' | 'bottom' | 'left' | 'right') => {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    if (r <= 0) return `M${x},${y}h${width}v${height}h${-width}Z`;

    switch (side) {
        case 'top':
            return `M${x},${y + height}v${-(height - r)}a${r},${r} 0 0 1 ${r},${-r}h${width - r * 2}a${r},${r} 0 0 1 ${r},${r}v${height - r}Z`;
        case 'bottom':
            return `M${x},${y}v${height - r}a${r},${r} 0 0 0 ${r},${r}h${width - r * 2}a${r},${r} 0 0 0 ${r},${-r}v${-(height - r)}Z`;
        case 'right':
            return `M${x},${y}h${width - r}a${r},${r} 0 0 1 ${r},${r}v${height - r * 2}a${r},${r} 0 0 1 ${-r},${r}h${-(width - r)}Z`;
        default:
            return `M${x + width},${y}h${-(width - r)}a${r},${r} 0 0 0 ${-r},${r}v${height - r * 2}a${r},${r} 0 0 0 ${r},${r}h${width - r}Z`;
    }
};

const BarChart: ParentComponent<BarProps> = (props) => {
    const legendToken = useToken(Legend, props.children);
    const tooltipToken = useToken(Tooltip, props.children);
    const labelsToken = useToken(Labels, props.children);
    const fillToken = useToken(Fill, props.children);
    const xAxisToken = useToken(XAxis, props.children);
    const yAxisToken = useToken(YAxis, props.children);
    const gridToken = useToken(Grid, props.children);

    const [size, observePlot] = useChartSize();
    const model = useChartData(() => props.data, props.onSeriesToggle);
    const frame = useChartTween(model.normalised, () => props.animation);

    let plotElement: HTMLDivElement | undefined;

    const palette = () => props.palette ?? DEFAULT_PALETTE;
    const horizontal = () => props.orientation === 'horizontal';
    const stacked = () => props.layout === 'stacked';

    /** The value axis is Y when vertical and X when horizontal. */
    const valueAxisToken = () => (horizontal() ? xAxisToken() : yAxisToken());
    const categoryAxisToken = () => (horizontal() ? yAxisToken() : xAxisToken());

    const geometry = createMemo(() => {
        const { width, height } = size();
        if (width <= 0 || height <= 0) return null;

        const { data, values } = frame();
        const categories = data.categories;
        const visible = model.visibleIndices();
        if (categories.length === 0) return null;

        const spans = computeSpans(data, values, visible, stacked());
        const domain = computeDomain(spans, props.domain, props.nice !== false);

        const margin = computeMargin({
            hasValueAxis: !!valueAxisToken() && !valueAxisToken()!.hide,
            hasCategoryAxis: !!categoryAxisToken() && !categoryAxisToken()!.hide,
            horizontal: horizontal(),
            valueAxisWidth: VALUE_AXIS_WIDTH,
            axisHeight: AXIS_HEIGHT,
        });

        const plotWidth = Math.max(0, width - margin.left - margin.right);
        const plotHeight = Math.max(0, height - margin.top - margin.bottom);
        if (plotWidth <= 0 || plotHeight <= 0) return null;

        const token = fillToken();
        const groupGap = token?.groupGap ?? DEFAULT_GROUP_GAP;

        // The category band runs across the plot; the value scale runs along
        // the other axis, inverted for vertical bars so larger values sit higher.
        const categoryScale = createBandScale(
            categories.length,
            horizontal() ? [0, plotHeight] : [0, plotWidth],
            { paddingInner: groupGap, paddingOuter: groupGap / 2 },
        );

        const valueScale = createLinearScale(
            domain,
            horizontal() ? [0, plotWidth] : [plotHeight, 0],
        );

        const baseline = valueScale(0);
        const seriesCount = stacked() ? 1 : Math.max(1, visible.length);
        const innerScale = createBandScale(seriesCount, [0, categoryScale.bandwidth]);

        const requestedWidth = token?.width;
        const thickness = (() => {
            const natural = innerScale.bandwidth - (stacked() ? 0 : (token?.gap ?? 0));
            if (requestedWidth === undefined) return Math.max(1, natural);
            if (typeof requestedWidth === 'number') return Math.max(1, requestedWidth);

            const share = parseFloat(requestedWidth);
            if (!Number.isFinite(share)) return Math.max(1, natural);

            return Math.max(1, requestedWidth.trim().endsWith('%')
                ? (innerScale.bandwidth * share) / 100
                : share);
        })();

        const cornerRadius = token?.cornerRadius ?? DEFAULT_CORNER_RADIUS;

        // Which segment caps each end of a stack, precomputed: doing this
        // inside the loop below would be quadratic on every animation frame.
        const topOfStack = new Float64Array(categories.length);
        const bottomOfStack = new Float64Array(categories.length);
        for (const span of spans) {
            if (span.to > topOfStack[span.categoryIndex]) topOfStack[span.categoryIndex] = span.to;
            if (span.to < bottomOfStack[span.categoryIndex]) bottomOfStack[span.categoryIndex] = span.to;
        }

        const bars = spans.map((span) => {
            const slot = stacked() ? 0 : visible.indexOf(span.seriesIndex);
            const bandStart = categoryScale(span.categoryIndex);
            const inner = innerScale(slot) + (innerScale.bandwidth - thickness) / 2;
            const along = bandStart + inner;

            const fromPx = valueScale(span.from);
            const toPx = valueScale(span.to);
            const low = Math.min(fromPx, toPx);
            const extent = Math.abs(toPx - fromPx);

            // A 2px surface gap keeps stacked segments separable where two
            // similar hues meet. Never eat more than half the segment.
            const trim = stacked() && span.from !== 0 ? Math.min(MARK_GAP, extent / 2) : 0;
            const growsPositive = span.to >= span.from;

            const rect = horizontal()
                ? {
                    x: low + (growsPositive ? trim : 0),
                    y: along,
                    width: Math.max(0, extent - trim),
                    height: thickness,
                }
                : {
                    x: along,
                    y: low + (growsPositive ? 0 : trim),
                    width: thickness,
                    height: Math.max(0, extent - trim),
                };

            // Only the end away from the baseline is rounded, and in a stack
            // only the outermost segment has an end to round.
            const isOuter = !stacked()
                || span.to === (growsPositive ? topOfStack[span.categoryIndex] : bottomOfStack[span.categoryIndex]);

            const side = horizontal()
                ? (growsPositive ? 'right' : 'left')
                : (growsPositive ? 'top' : 'bottom');

            return {
                ...rect,
                seriesIndex: span.seriesIndex,
                categoryIndex: span.categoryIndex,
                value: span.to - span.from,
                d: barPath(rect.x, rect.y, rect.width, rect.height, isOuter ? cornerRadius : 0, side),
                color: resolveColor(
                    palette(),
                    span.seriesIndex,
                    data.series[span.seriesIndex],
                    data.series[span.seriesIndex]?.points?.find(p => p.type === categories[span.categoryIndex]),
                ),
            };
        });

        const valueTicks: AxisTick[] = valueScale
            .ticks(valueAxisToken()?.ticks ?? gridToken()?.ticks)
            .map(value => ({
                position: valueScale(value),
                label: valueAxisToken()?.format ? valueAxisToken()!.format!(value) : formatChartNumber(value),
            }));

        const categoryTicks: AxisTick[] = categories.map((category, index) => ({
            position: bandCentre(categoryScale, index),
            label: categoryAxisToken()?.format ? categoryAxisToken()!.format!(category) : category,
        }));

        return {
            margin, plotWidth, plotHeight, bars, categoryScale, valueScale,
            baseline, valueTicks, categoryTicks, categories, domain,
        };
    });

    const hoverMode = () => resolveHoverMode(props.interactive, 'svg');

    const resolver = createBarResolver(
        () => geometry()?.categoryScale ?? null,
        () => {
            const current = geometry();
            if (!current) return [];

            // The resolver works in plot-local pixels; the marks are drawn
            // inside a group translated by the margin.
            return current.bars.map<CartesianBar>(bar => ({
                seriesIndex: bar.seriesIndex,
                categoryIndex: bar.categoryIndex,
                x: bar.x + current.margin.left,
                y: bar.y + current.margin.top,
                width: bar.width,
                height: bar.height,
            }));
        },
        horizontal,
    );

    const hover = useChartHover({
        mode: hoverMode,
        // The band lookup needs the margin removed again.
        resolver: () => (x, y) => {
            const current = geometry();
            if (!current) return null;

            const local = horizontal()
                ? y - current.margin.top
                : x - current.margin.left;

            return current.categoryScale.indexAt(local) < 0 ? null : resolver(x, y);
        },
        plotElement: () => plotElement,
        size,
        toEvent: (hit: ChartHit) => createPointEvent(frame().data.series, frame().data.categories, hit),
        onHover: event => props.onPointHover?.(event),
        onClick: event => props.onPointClick?.(event),
    });

    /** A bar chart's legend lists series, unlike a pie's, which lists slices. */
    const entries = createMemo<LegendEntry[]>(() => {
        const { data } = frame();

        return data.series.map((series, seriesIndex) => ({
            label: series.label ?? `Series ${seriesIndex + 1}`,
            color: resolveColor(palette(), seriesIndex, series),
            seriesIndex,
            visible: model.isSeriesVisible(seriesIndex),
        }));
    });

    const labelAnchors = createMemo<ChartLabelAnchor[]>(() => {
        const token = labelsToken();
        const current = geometry();
        if (!token || !current || token.show === 'never') return [];

        const hovered = hover.hovered();
        const { data } = frame();

        return current.bars.reduce<ChartLabelAnchor[]>((acc, bar) => {
            if (token.show === 'hover' && !(hovered?.seriesIndex === bar.seriesIndex && hovered?.pointIndex === bar.categoryIndex)) {
                return acc;
            }

            const category = current.categories[bar.categoryIndex];
            const series = data.series[bar.seriesIndex];
            const point = series?.points?.find(candidate => candidate.type === category)
                ?? { type: category, value: bar.value };

            acc.push({
                key: `${bar.seriesIndex}:${category}`,
                x: current.margin.left + bar.x + bar.width / 2,
                y: current.margin.top + bar.y + bar.height / 2,
                text: token.format ? token.format(point, series) : formatChartNumber(bar.value),
                align: 'center',
                seriesIndex: bar.seriesIndex,
                pointIndex: bar.categoryIndex,
            });

            return acc;
        }, []);
    });

    const barClasses = (seriesIndex: number, categoryIndex: number) => {
        const list = [styles['bar-mark']];
        if (hover.isHovered(seriesIndex, categoryIndex)) list.push(styles['is-hovered']);
        if (fillToken()?.class) list.push(fillToken()!.class!);

        return list.join(' ');
    };

    return (
        <ChartRoot
            componentProps={props}
            componentClass={styles.bar}
            legend={legendToken()}
            tooltip={tooltipToken()}
            entries={entries()}
            onToggle={entry => model.toggleSeries(entry.seriesIndex)}
            hovered={hover.hovered()}
            plotRef={(element) => { plotElement = element; observePlot(element); }}
            overlayProps={hover.overlayProps()}
            showOverlay={hoverMode() === 'overlay'}
        >
            <svg
                class={styles.svg}
                width={size().width}
                height={size().height}
                style={{ 'pointer-events': hoverMode() === 'none' ? 'none' : undefined }}
            >
                <Show when={geometry()}>
                    <ChartGridLines
                        margin={geometry()!.margin}
                        plotWidth={geometry()!.plotWidth}
                        plotHeight={geometry()!.plotHeight}
                        valueTicks={geometry()!.valueTicks}
                        categoryTicks={geometry()!.categoryTicks}
                        horizontal={horizontal()}
                        valueAxis={valueAxisToken()}
                        categoryAxis={categoryAxisToken()}
                        grid={gridToken()}
                        baseline={geometry()!.baseline}
                    />

                    <g transform={`translate(${geometry()!.margin.left} ${geometry()!.margin.top})`}>
                        <Index each={geometry()!.bars}>{(bar) => {
                            const marks = hover.markProps(
                                () => bar().seriesIndex,
                                () => bar().categoryIndex,
                            );

                            return (
                                <path
                                    d={bar().d}
                                    fill={bar().color}
                                    class={barClasses(bar().seriesIndex, bar().categoryIndex)}
                                    style={fillToken()?.style}
                                    {...marks}
                                />
                            );
                        }}</Index>
                    </g>
                </Show>
            </svg>

            <Show when={geometry()}>
                <ChartAxisLabels
                    margin={geometry()!.margin}
                    plotWidth={geometry()!.plotWidth}
                    plotHeight={geometry()!.plotHeight}
                    valueTicks={geometry()!.valueTicks}
                    categoryTicks={geometry()!.categoryTicks}
                    horizontal={horizontal()}
                    valueAxis={valueAxisToken()}
                    categoryAxis={categoryAxisToken()}
                />
            </Show>

            <Show when={labelsToken()}>
                <ChartLabels token={labelsToken()!} anchors={labelAnchors()} />
            </Show>
        </ChartRoot>
    );
};

export default Object.assign(BarChart, { Fill });
