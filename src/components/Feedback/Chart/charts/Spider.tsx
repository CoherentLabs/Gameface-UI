import { createMemo, Index, ParentComponent, Show } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { BaseChartProps, ChartHit, LegendEntry } from '../types';
import { Labels, Legend, Tooltip } from '../slots';
import { useChartData } from '../core/useChartData';
import { useChartTween } from '../core/useChartTween';
import { useChartSize } from '../core/useChartSize';
import { resolveHoverMode, useChartHover } from '../core/useChartHover';
import { createSpiderResolver, SpiderVertex } from '../core/resolvers/radial';
import { createLinearScale, niceDomain } from '../core/scales';
import { createPointEvent } from '../core/events';
import { DEFAULT_PALETTE, resolveColor } from '../core/palette';
import { formatChartNumber } from '../core/radius';
import { warnOnce } from '../core/warnOnce';
import ChartRoot from '../parts/ChartRoot';
import ChartLabels, { ChartLabelAnchor } from '../parts/ChartLabels';

export interface SpiderShapeTokenProps extends TokenBase {
    /** 0 to 1. Defaults to 0.25 so overlapping shapes stay readable. */
    fillOpacity?: number;
    strokeWidth?: number;
    /** 0 hides the vertex markers. */
    pointRadius?: number;
}

export interface SpiderWebTokenProps extends TokenBase {
    /** Concentric rings drawn behind the data. Defaults to 4. */
    levels?: number;
    shape?: 'polygon' | 'circle';
}

export interface SpiderAxisTokenProps extends TokenBase {
    /** Draws the spoke from the centre to each category. Defaults to true. */
    line?: boolean;
    format?: (category: string) => string;
}

export const Shape = createTokenComponent<SpiderShapeTokenProps>();
export const Web = createTokenComponent<SpiderWebTokenProps>();
export const Axis = createTokenComponent<SpiderAxisTokenProps>();

export interface SpiderProps extends BaseChartProps {
    /** Degrees to rotate the first category away from 12 o'clock. */
    startAngle?: number;
    /**
     * Pins the outer ring to a fixed value instead of the data maximum.
     *
     * Usually what you want for a stat display: without it, a character whose
     * stats are all low still fills the web, because the scale shrinks to fit.
     */
    maxValue?: number;
}

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const DEFAULT_LEVELS = 4;
const DEFAULT_FILL_OPACITY = 0.25;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_POINT_RADIUS = 3;
const LABEL_GAP = 12;
/** Room kept for the category labels around the perimeter. */
const LABEL_RESERVE = 44;

/** Screen offset for an angle measured clockwise from 12 o'clock. */
const project = (angle: number, radius: number) => ({
    x: Math.sin(angle) * radius,
    y: -Math.cos(angle) * radius,
});

const polygonPath = (angles: number[], radius: number) => {
    if (angles.length === 0) return '';

    return `${angles
        .map((angle, index) => {
            const { x, y } = project(angle, radius);
            return `${index === 0 ? 'M' : 'L'}${x},${y}`;
        })
        .join('')}Z`;
};

const SpiderChart: ParentComponent<SpiderProps> = (props) => {
    const legendToken = useToken(Legend, props.children);
    const tooltipToken = useToken(Tooltip, props.children);
    const labelsToken = useToken(Labels, props.children);
    const shapeToken = useToken(Shape, props.children);
    const webToken = useToken(Web, props.children);
    const axisToken = useToken(Axis, props.children);

    const [size, observePlot] = useChartSize();
    const model = useChartData(() => props.data, props.onSeriesToggle);
    const frame = useChartTween(model.normalised, () => props.animation);

    let plotElement: HTMLDivElement | undefined;

    const palette = () => props.palette ?? DEFAULT_PALETTE;

    const geometry = createMemo(() => {
        const { width, height } = size();
        if (width <= 0 || height <= 0) return null;

        const { data, values } = frame();
        const categories = data.categories;
        const visible = model.visibleIndices();
        if (categories.length < 3) {
            if (categories.length > 0) {
                warnOnce('[Chart.Spider] A spider chart needs at least three categories to enclose an area.');
            }

            return null;
        }

        const outerRadius = Math.min(width, height) / 2 - (axisToken() ? LABEL_RESERVE : 0);
        if (outerRadius <= 0) return null;

        const centre = { x: width / 2, y: height / 2 };
        const start = (props.startAngle ?? 0) * DEG;
        const angles = categories.map((_, index) => start + (index * TAU) / categories.length);

        let dataMax = 0;
        for (const seriesIndex of visible) {
            const offset = seriesIndex * categories.length;

            for (let c = 0; c < categories.length; c++) {
                const value = values[offset + c] ?? 0;
                if (value < 0) warnOnce('[Chart.Spider] Negative values have no meaning here and are treated as 0.');
                if (value > dataMax) dataMax = value;
            }
        }

        // A fixed maxValue is taken literally; a derived one is rounded out so
        // the outer ring lands on a readable number.
        const max = props.maxValue ?? (dataMax > 0 ? niceDomain(0, dataMax)[1] : 1);
        const radial = createLinearScale([0, max], [0, outerRadius]);

        const series = visible.map((seriesIndex) => {
            const offset = seriesIndex * categories.length;

            const vertices = categories.map((_, categoryIndex) => {
                const raw = values[offset + categoryIndex] ?? 0;
                const radius = radial(Math.max(0, raw));
                const angle = angles[categoryIndex];

                return { categoryIndex, angle, radius, value: Math.max(0, raw), ...project(angle, radius) };
            });

            return {
                seriesIndex,
                vertices,
                d: `${vertices.map((vertex, index) => `${index === 0 ? 'M' : 'L'}${vertex.x},${vertex.y}`).join('')}Z`,
                color: resolveColor(palette(), seriesIndex, data.series[seriesIndex]),
            };
        });

        const levels = webToken()?.levels ?? DEFAULT_LEVELS;
        const rings = Array.from({ length: levels }, (_, index) => {
            const radius = (outerRadius * (index + 1)) / levels;
            return { radius, d: polygonPath(angles, radius) };
        });

        const spokes = angles.map(angle => ({ angle, ...project(angle, outerRadius) }));

        return { centre, outerRadius, angles, series, rings, spokes, categories, max };
    });

    // A series is one closed path spanning every category, so native hit
    // testing could only ever say "which series", never "which point".
    const hoverMode = () => resolveHoverMode(props.interactive, 'overlay');

    const resolver = createSpiderResolver(
        () => geometry()?.centre ?? { x: 0, y: 0 },
        () => {
            const current = geometry();
            if (!current) return [];

            return current.series.flatMap(series => series.vertices.map<SpiderVertex>(vertex => ({
                seriesIndex: series.seriesIndex,
                categoryIndex: vertex.categoryIndex,
                angle: vertex.angle,
                radius: vertex.radius,
            })));
        },
        () => geometry()?.outerRadius ?? 0,
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
            visible: model.isSeriesVisible(seriesIndex),
        }));
    });

    /** The Axis slot styles both its spokes and its category labels. */
    const axisLabelToken = createMemo(() => ({ class: axisToken()?.class }));

    /** Category names sit outside the web; the quadrant decides their alignment. */
    const axisLabels = createMemo<ChartLabelAnchor[]>(() => {
        const token = axisToken();
        const current = geometry();
        if (!token || !current) return [];

        return current.categories.map((category, index) => {
            const angle = current.angles[index];
            const offset = project(angle, current.outerRadius + LABEL_GAP);
            const horizontal = Math.sin(angle);

            return {
                key: category,
                x: current.centre.x + offset.x,
                y: current.centre.y + offset.y,
                text: token.format ? token.format(category) : category,
                // Near the top or bottom the label wants centring; to either
                // side it should grow away from the web.
                align: Math.abs(horizontal) < 0.2 ? 'center' : (horizontal > 0 ? 'start' : 'end'),
                seriesIndex: -1,
                pointIndex: index,
            } as ChartLabelAnchor;
        });
    });

    const valueLabels = createMemo<ChartLabelAnchor[]>(() => {
        const token = labelsToken();
        const current = geometry();
        if (!token || !current || token.show === 'never') return [];

        const hovered = hover.hovered();
        const { data } = frame();

        return current.series.flatMap(series => series.vertices.reduce<ChartLabelAnchor[]>((acc, vertex) => {
            if (token.show === 'hover' && !(hovered?.seriesIndex === series.seriesIndex && hovered?.pointIndex === vertex.categoryIndex)) {
                return acc;
            }

            const category = current.categories[vertex.categoryIndex];
            const source = data.series[series.seriesIndex];
            const point = source?.points?.find(candidate => candidate.type === category)
                ?? { type: category, value: vertex.value };

            acc.push({
                key: `${series.seriesIndex}:${category}`,
                x: current.centre.x + vertex.x,
                y: current.centre.y + vertex.y - 12,
                text: token.format ? token.format(point, source) : formatChartNumber(vertex.value),
                align: 'center',
                seriesIndex: series.seriesIndex,
                pointIndex: vertex.categoryIndex,
            });

            return acc;
        }, []));
    });

    const shapeClasses = (seriesIndex: number) => {
        const list = [styles['spider-shape']];
        if (hover.hovered()?.seriesIndex === seriesIndex) list.push(styles['is-hovered']);
        if (shapeToken()?.class) list.push(shapeToken()!.class!);

        return list.join(' ');
    };

    const pointRadius = () => shapeToken()?.pointRadius ?? DEFAULT_POINT_RADIUS;

    return (
        <ChartRoot
            componentProps={props}
            componentClass={styles.spider}
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
                    <g transform={`translate(${geometry()!.centre.x} ${geometry()!.centre.y})`}>
                        <Show when={webToken()}>
                            <Index each={geometry()!.rings}>{(ring) => (
                                <Show
                                    when={webToken()?.shape !== 'circle'}
                                    fallback={
                                        <circle
                                            cx={0}
                                            cy={0}
                                            r={ring().radius}
                                            class={[styles['spider-web'], webToken()?.class].filter(Boolean).join(' ')}
                                            style={webToken()?.style}
                                        />
                                    }
                                >
                                    <path
                                        d={ring().d}
                                        class={[styles['spider-web'], webToken()?.class].filter(Boolean).join(' ')}
                                        style={webToken()?.style}
                                    />
                                </Show>
                            )}</Index>
                        </Show>

                        <Show when={axisToken() && axisToken()!.line !== false}>
                            <Index each={geometry()!.spokes}>{(spoke) => (
                                <line
                                    x1={0}
                                    y1={0}
                                    x2={spoke().x}
                                    y2={spoke().y}
                                    class={[styles['spider-spoke'], axisToken()?.class].filter(Boolean).join(' ')}
                                    style={axisToken()?.style}
                                />
                            )}</Index>
                        </Show>

                        <Index each={geometry()!.series}>{(series) => (
                            <>
                                <path
                                    d={series().d}
                                    fill={series().color}
                                    stroke={series().color}
                                    stroke-width={shapeToken()?.strokeWidth ?? DEFAULT_STROKE_WIDTH}
                                    fill-opacity={shapeToken()?.fillOpacity ?? DEFAULT_FILL_OPACITY}
                                    class={shapeClasses(series().seriesIndex)}
                                    style={shapeToken()?.style}
                                />

                                <Show when={pointRadius() > 0}>
                                    <Index each={series().vertices}>{(vertex) => (
                                        <circle
                                            cx={vertex().x}
                                            cy={vertex().y}
                                            r={pointRadius()}
                                            fill={series().color}
                                            class={styles['series-point']}
                                        />
                                    )}</Index>
                                </Show>
                            </>
                        )}</Index>
                    </g>
                </Show>
            </svg>

            <Show when={axisToken()}>
                <ChartLabels token={axisLabelToken()} anchors={axisLabels()} />
            </Show>

            <Show when={labelsToken()}>
                <ChartLabels token={labelsToken()!} anchors={valueLabels()} />
            </Show>
        </ChartRoot>
    );
};

export default Object.assign(SpiderChart, { Shape, Web, Axis });
