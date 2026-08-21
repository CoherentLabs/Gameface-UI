import { area, curveLinear, curveMonotoneX, curveStep, curveStepAfter, curveStepBefore, line } from 'd3-shape';
import { createMemo, Index, ParentComponent, Show } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { BaseChartProps, ChartHit, LegendEntry } from '../types';
import { Grid, Labels, Legend, Tooltip, XAxis, YAxis } from '../slots';
import { useChartData } from '../core/useChartData';
import { useChartTween } from '../core/useChartTween';
import { useChartSize } from '../core/useChartSize';
import { resolveHoverMode, useChartHover } from '../core/useChartHover';
import { createNearestVertexResolver, SeriesVertex } from '../core/resolvers/cartesian';
import { computeDomain, computeMargin, computeSpans } from '../core/cartesian';
import { bandCentre, createBandScale, createLinearScale } from '../core/scales';
import { createPointEvent } from '../core/events';
import { DEFAULT_PALETTE, resolveColor } from '../core/palette';
import { formatChartNumber } from '../core/radius';
import { warnOnMarkBudget } from '../core/warnOnce';
import { measurePathLength } from '../core/pathLength';
import { useDrawOn } from '../core/useDrawOn';
import ChartRoot from '../parts/ChartRoot';
import ChartLabels, { ChartLabelAnchor } from '../parts/ChartLabels';
import { AxisTick, ChartAxisLabels, ChartGridLines } from '../parts/ChartAxes';

export type TokenComponent<T extends Record<string, any>> = ReturnType<typeof createTokenComponent<T>>;

export type CurveType = 'linear' | 'smooth' | 'step' | 'step-before' | 'step-after';

const CURVES = {
    'linear': curveLinear,
    'smooth': curveMonotoneX,
    'step': curveStep,
    'step-before': curveStepBefore,
    'step-after': curveStepAfter,
};

const resolveCurve = (curve?: CurveType) => CURVES[curve ?? 'linear'] ?? curveLinear;

export interface StrokeTokenProps extends TokenBase {
    width?: number;
    curve?: CurveType;
    /** SVG dash pattern, e.g. `'6 4'`. */
    dash?: string;
}

export interface AreaFillTokenProps extends TokenBase {
    /** 0 to 1. Defaults to 0.25 so overlapping areas stay readable. */
    opacity?: number;
    curve?: CurveType;
}

export interface PointTokenProps extends TokenBase {
    radius?: number;
    show?: 'always' | 'hover' | 'never';
}

export interface SeriesChartProps extends BaseChartProps {
    curve?: CurveType;
    /** Overrides the computed value domain. */
    domain?: [number, number];
    /** Rounds the computed domain out to readable tick values. Defaults to true. */
    nice?: boolean;
    /**
     * Draws straight through categories a series does not declare. When false,
     * an undeclared category breaks the line instead. Defaults to true.
     */
    connectNulls?: boolean;
    /** Area only: accumulate series instead of overlapping them. */
    stacked?: boolean;
}

interface SeriesChartConfig {
    componentClass: string;
    displayName: string;
    mode: 'line' | 'area';
    strokeTokenizer: TokenComponent<StrokeTokenProps>;
    pointTokenizer: TokenComponent<PointTokenProps>;
    fillTokenizer?: TokenComponent<AreaFillTokenProps>;
}

const VALUE_AXIS_WIDTH = 40;
const AXIS_HEIGHT = 20;
const DEFAULT_STROKE_WIDTH = 2;
/** 8px across — the smallest marker that stays comfortably clickable. */
const DEFAULT_POINT_RADIUS = 4;
const DEFAULT_AREA_OPACITY = 0.25;

/**
 * The shared line/area implementation.
 *
 * The two draw the same vertices; an area simply closes its path down to the
 * baseline and fills it. Stacking, axes, hit-testing and the legend are
 * identical, so they share one pipeline.
 */
export const createSeriesChart = (config: SeriesChartConfig): ParentComponent<SeriesChartProps> => (props) => {
    const legendToken = useToken(Legend, props.children);
    const tooltipToken = useToken(Tooltip, props.children);
    const labelsToken = useToken(Labels, props.children);
    const strokeToken = useToken(config.strokeTokenizer, props.children);
    const pointToken = useToken(config.pointTokenizer, props.children);
    const fillToken = config.fillTokenizer
        ? useToken(config.fillTokenizer, props.children)
        : () => null;
    const xAxisToken = useToken(XAxis, props.children);
    const yAxisToken = useToken(YAxis, props.children);
    const gridToken = useToken(Grid, props.children);

    const [size, observePlot] = useChartSize();
    const model = useChartData(() => props.data, props.onSeriesToggle);
    const frame = useChartTween(model.normalised, () => props.animation);

    let plotElement: HTMLDivElement | undefined;

    const palette = () => props.palette ?? DEFAULT_PALETTE;
    const isArea = () => config.mode === 'area';
    const stacked = () => isArea() && props.stacked === true;
    const curve = () => resolveCurve(strokeToken()?.curve ?? fillToken()?.curve ?? props.curve);

    const geometry = createMemo(() => {
        const { width, height } = size();
        if (width <= 0 || height <= 0) return null;

        const { data, values } = frame();
        const categories = data.categories;
        const visible = model.visibleIn(data);
        if (categories.length === 0) return null;

        const spans = computeSpans(data, values, visible, stacked());
        const domain = computeDomain(spans, props.domain, props.nice !== false);

        const margin = computeMargin({
            hasValueAxis: !!yAxisToken() && !yAxisToken()!.hide,
            hasCategoryAxis: !!xAxisToken() && !xAxisToken()!.hide,
            horizontal: false,
            valueAxisWidth: VALUE_AXIS_WIDTH,
            axisHeight: AXIS_HEIGHT,
        });

        const plotWidth = Math.max(0, width - margin.left - margin.right);
        const plotHeight = Math.max(0, height - margin.top - margin.bottom);
        if (plotWidth <= 0 || plotHeight <= 0) return null;

        // Vertices sit at band centres so a line lands over the middle of the
        // equivalent bar rather than on the boundary between two categories.
        const xScale = createBandScale(categories.length, [0, plotWidth]);
        const yScale = createLinearScale(domain, [plotHeight, 0]);
        const baseline = yScale(0);
        const connect = props.connectNulls !== false;

        const byCategory = new Map<string, { from: number; to: number }>();
        for (const span of spans) {
            byCategory.set(`${span.seriesIndex}:${span.categoryIndex}`, span);
        }

        const series = visible.map((seriesIndex) => {
            const offset = seriesIndex * categories.length;

            const vertices = categories.map((_, categoryIndex) => {
                const span = byCategory.get(`${seriesIndex}:${categoryIndex}`) ?? { from: 0, to: 0 };

                return {
                    categoryIndex,
                    x: bandCentre(xScale, categoryIndex),
                    y: yScale(span.to),
                    y0: yScale(stacked() ? span.from : 0),
                    value: span.to - span.from,
                    defined: connect || data.present[offset + categoryIndex] === 1,
                };
            });

            const lineGenerator = line<typeof vertices[number]>()
                .x(vertex => vertex.x)
                .y(vertex => vertex.y)
                .defined(vertex => vertex.defined)
                .curve(curve());

            const areaGenerator = area<typeof vertices[number]>()
                .x(vertex => vertex.x)
                .y0(vertex => vertex.y0)
                .y1(vertex => vertex.y)
                .defined(vertex => vertex.defined)
                .curve(curve());

            return {
                seriesIndex,
                vertices,
                stroke: lineGenerator(vertices) ?? '',
                fill: isArea() ? (areaGenerator(vertices) ?? '') : '',
                color: resolveColor(palette(), seriesIndex, data.series[seriesIndex]),
            };
        });

        const valueTicks: AxisTick[] = yScale
            .ticks(yAxisToken()?.ticks ?? gridToken()?.ticks)
            .map(value => ({
                position: yScale(value),
                label: yAxisToken()?.format ? yAxisToken()!.format!(value) : formatChartNumber(value),
            }));

        const categoryTicks: AxisTick[] = categories.map((category, index) => ({
            position: bandCentre(xScale, index),
            label: xAxisToken()?.format ? xAxisToken()!.format!(category) : category,
        }));

        // A stroke and an optional fill per series, plus a marker per vertex.
        warnOnMarkBudget(config.displayName, series.length * (2 + categories.length));

        return {
            margin, plotWidth, plotHeight, series, baseline,
            valueTicks, categoryTicks, categories, xScale, yScale,
        };
    });

    // Nearest-x, not per-element: a 2px stroke cannot be hovered reliably.
    const hoverMode = () => resolveHoverMode(props.interactive, 'overlay');

    const resolver = createNearestVertexResolver(
        () => {
            const current = geometry();
            if (!current) return [];

            return current.series.flatMap(series => series.vertices
                .filter(vertex => vertex.defined)
                .map<SeriesVertex>(vertex => ({
                    seriesIndex: series.seriesIndex,
                    categoryIndex: vertex.categoryIndex,
                    x: vertex.x + current.margin.left,
                    y: vertex.y + current.margin.top,
                })));
        },
        () => {
            const current = geometry();
            if (!current) return null;

            return {
                left: current.margin.left,
                right: current.margin.left + current.plotWidth,
                top: current.margin.top,
                bottom: current.margin.top + current.plotHeight,
            };
        },
    );

    const hover = useChartHover({
        mode: hoverMode,
        resolver: () => resolver,
        plotElement: () => plotElement,
        size,
        toEvent: (hit: ChartHit) => createPointEvent(frame().data.series, frame().data.categories, hit),
        onHover: event => props.onPointHover?.(event),
        onClick: event => props.onPointClick?.(event),
    });

    const entries = createMemo<LegendEntry[]>(() => {
        const { data } = frame();

        return data.series.map((series, seriesIndex) => ({
            label: series.label ?? `Series ${seriesIndex + 1}`,
            color: resolveColor(palette(), seriesIndex, series),
            seriesIndex,
            visible: model.isSeriesVisible(seriesIndex, data),
        }));
    });

    const showPoint = (seriesIndex: number, categoryIndex: number) => {
        const show = pointToken()?.show ?? 'hover';
        if (show === 'never') return false;
        if (show === 'always') return true;

        return hover.isHovered(seriesIndex, categoryIndex);
    };

    const labelAnchors = createMemo<ChartLabelAnchor[]>(() => {
        const token = labelsToken();
        const current = geometry();
        if (!token || !current || token.show === 'never') return [];

        const hovered = hover.hovered();
        const { data } = frame();

        return current.series.flatMap(series => series.vertices.reduce<ChartLabelAnchor[]>((acc, vertex) => {
            if (!vertex.defined) return acc;
            if (token.show === 'hover' && !(hovered?.seriesIndex === series.seriesIndex && hovered?.pointIndex === vertex.categoryIndex)) {
                return acc;
            }

            const category = current.categories[vertex.categoryIndex];
            const source = data.series[series.seriesIndex];
            const point = source?.points?.find(candidate => candidate.type === category)
                ?? { type: category, value: vertex.value };

            acc.push({
                key: `${series.seriesIndex}:${category}`,
                x: current.margin.left + vertex.x,
                // Sit above the vertex so the label never covers its own point.
                y: current.margin.top + vertex.y - 12,
                text: token.format ? token.format(point, source) : formatChartNumber(vertex.value),
                align: 'center',
                seriesIndex: series.seriesIndex,
                pointIndex: vertex.categoryIndex,
            });

            return acc;
        }, []));
    });

    const strokeWidth = () => strokeToken()?.width ?? DEFAULT_STROKE_WIDTH;

    // The reveal runs once, when the chart first has geometry to draw.
    const reveal = useDrawOn(() => !!geometry(), () => props.animation);

    /**
     * Dash attributes that hide the not-yet-revealed part of a line.
     *
     * Set as SVG attributes rather than CSS: the CSS properties require
     * explicit px units in Gameface, the attributes do not. Once the reveal
     * finishes they are dropped entirely, so a dash pattern the consumer asked
     * for is never fought over.
     */
    const revealProps = (path: string) => {
        if (reveal() >= 1) return { 'stroke-dasharray': strokeToken()?.dash };

        const length = measurePathLength(path);

        return {
            'stroke-dasharray': `${length}`,
            'stroke-dashoffset': `${length * (1 - reveal())}`,
        };
    };

    return (
        <ChartRoot
            componentProps={props}
            componentClass={config.componentClass}
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
                        horizontal={false}
                        valueAxis={yAxisToken()}
                        categoryAxis={xAxisToken()}
                        grid={gridToken()}
                        baseline={geometry()!.baseline}
                    />

                    <g transform={`translate(${geometry()!.margin.left} ${geometry()!.margin.top})`}>
                        <Index each={geometry()!.series}>{(series) => (
                            <>
                                <Show when={isArea()}>
                                    <path
                                        d={series().fill}
                                        fill={series().color}
                                        opacity={fillToken()?.opacity ?? DEFAULT_AREA_OPACITY}
                                        class={[styles['area-fill'], fillToken()?.class].filter(Boolean).join(' ')}
                                        style={fillToken()?.style}
                                    />
                                </Show>

                                <path
                                    d={series().stroke}
                                    fill="none"
                                    stroke={series().color}
                                    stroke-width={strokeWidth()}
                                    class={[styles['series-stroke'], strokeToken()?.class].filter(Boolean).join(' ')}
                                    style={strokeToken()?.style}
                                    {...revealProps(series().stroke)}
                                />

                                <Index each={series().vertices}>{(vertex) => (
                                    <Show when={vertex().defined && showPoint(series().seriesIndex, vertex().categoryIndex)}>
                                        <circle
                                            cx={vertex().x}
                                            cy={vertex().y}
                                            r={pointToken()?.radius ?? DEFAULT_POINT_RADIUS}
                                            fill={series().color}
                                            class={[styles['series-point'], pointToken()?.class].filter(Boolean).join(' ')}
                                            style={pointToken()?.style}
                                        />
                                    </Show>
                                )}</Index>
                            </>
                        )}</Index>
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
                    horizontal={false}
                    valueAxis={yAxisToken()}
                    categoryAxis={xAxisToken()}
                />
            </Show>

            <Show when={labelsToken()}>
                <ChartLabels token={labelsToken()!} anchors={labelAnchors()} />
            </Show>
        </ChartRoot>
    );
};
