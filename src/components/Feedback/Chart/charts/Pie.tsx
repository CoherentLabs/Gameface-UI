import { arc, pie } from 'd3-shape';
import { createMemo, For, ParentComponent, Show } from 'solid-js';
import { createTokenComponent, TokenBase, useToken } from '@components/utils/tokenComponents';
import styles from '../Chart.module.scss';
import { BaseChartProps, ChartHit, LegendEntry } from '../types';
import { Labels, Legend, Tooltip } from '../slots';
import { useChartData } from '../core/useChartData';
import { useChartTween } from '../core/useChartTween';
import { useChartSize } from '../core/useChartSize';
import { resolveHoverMode, useChartHover } from '../core/useChartHover';
import { createRadialResolver, RadialSlice } from '../core/resolvers/radial';
import { createPointEvent } from '../core/events';
import { DEFAULT_PALETTE, resolveColor } from '../core/palette';
import ChartRoot from '../parts/ChartRoot';
import ChartLabels, { ChartLabelAnchor } from '../parts/ChartLabels';

export interface PieSliceTokenProps extends TokenBase {
    /** Degrees of padding between slices. */
    padAngle?: number;
    cornerRadius?: number;
    /** Pixels the hovered slice pops out along its centroid. */
    hoverOffset?: number;
}

export const Slice = createTokenComponent<PieSliceTokenProps>();

export interface PieProps extends BaseChartProps {
    /** Degrees, clockwise from 12 o'clock. Defaults to 0. */
    startAngle?: number;
    /** Defaults to 360, a full circle. */
    endAngle?: number;
}

const DEG = Math.PI / 180;
const OUTSIDE_LABEL_GAP = 10;
/** Room kept for labels drawn outside the circle. */
const OUTSIDE_LABEL_RESERVE = 52;

let multiSeriesWarned = false;
let negativeWarned = false;

const PieChart: ParentComponent<PieProps> = (props) => {
    const legendToken = useToken(Legend, props.children);
    const tooltipToken = useToken(Tooltip, props.children);
    const labelsToken = useToken(Labels, props.children);
    const sliceToken = useToken(Slice, props.children);

    const [size, observePlot] = useChartSize();
    const model = useChartData(() => props.data, props.onSeriesToggle);
    const frame = useChartTween(model.normalised, () => props.animation);

    let plotElement: HTMLDivElement | undefined;

    const palette = () => props.palette ?? DEFAULT_PALETTE;
    const placement = () => labelsToken()?.placement ?? 'inside';

    /** A pie shows one series; extra series would need concentric rings. */
    const seriesIndex = createMemo(() => {
        const index = model.visibleIndices()[0];

        if (import.meta.env.DEV && props.data?.length > 1 && !multiSeriesWarned) {
            multiSeriesWarned = true;
            console.warn('[Chart.Pie] Only the first series is rendered. Give each slice its own point, or use one chart per series.');
        }

        return index;
    });

    const geometry = createMemo(() => {
        const { width, height } = size();
        const index = seriesIndex();
        if (width <= 0 || height <= 0 || index === undefined) return null;

        const { data, values } = frame();
        const categories = data.categories;
        const offset = index * categories.length;

        const visible: { pointIndex: number; value: number }[] = [];
        for (let c = 0; c < categories.length; c++) {
            if (!model.isPointVisible(index, c)) continue;

            const value = values[offset + c] ?? 0;
            if (import.meta.env.DEV && value < 0 && !negativeWarned) {
                negativeWarned = true;
                console.warn('[Chart.Pie] Negative values have no meaning in a pie and are treated as 0.');
            }

            // A zero-value slice would emit a degenerate, invisible path that
            // still costs an element. It reappears as soon as it tweens above 0.
            if (value <= 0) continue;

            visible.push({ pointIndex: c, value });
        }

        const total = visible.reduce((sum, slice) => sum + slice.value, 0);
        if (total <= 0) return null;

        const token = sliceToken();
        const outsideReserve = placement() === 'outside' ? OUTSIDE_LABEL_RESERVE : 0;
        const outerRadius = Math.min(width, height) / 2 - outsideReserve;
        if (outerRadius <= 0) return null;

        const centre = { x: width / 2, y: height / 2 };

        const layout = pie<{ pointIndex: number; value: number }>()
            .sort(null)
            .value(slice => slice.value)
            .startAngle((props.startAngle ?? 0) * DEG)
            .endAngle((props.endAngle ?? 360) * DEG)
            .padAngle((token?.padAngle ?? 0) * DEG);

        const generator = arc<{ startAngle: number; endAngle: number; padAngle: number }>()
            .innerRadius(0)
            .outerRadius(outerRadius)
            .cornerRadius(token?.cornerRadius ?? 0);

        const arcs = layout(visible).map((entry) => {
            const midAngle = (entry.startAngle + entry.endAngle) / 2;

            return {
                pointIndex: entry.data.pointIndex,
                value: entry.data.value,
                startAngle: entry.startAngle,
                endAngle: entry.endAngle,
                midAngle,
                d: generator(entry) ?? '',
                centroid: generator.centroid(entry) as [number, number],
                color: resolveColor(
                    palette(),
                    entry.data.pointIndex,
                    data.series[index],
                    data.series[index]?.points?.find(point => point.type === categories[entry.data.pointIndex]),
                ),
            };
        });

        return { centre, outerRadius, arcs, seriesIndex: index, categories, total };
    });

    const hoverMode = () => resolveHoverMode(props.interactive, 'svg');

    const resolver = createRadialResolver(
        () => geometry()?.centre ?? { x: 0, y: 0 },
        () => (geometry()?.arcs ?? []).map<RadialSlice>(entry => ({
            seriesIndex: geometry()!.seriesIndex,
            pointIndex: entry.pointIndex,
            startAngle: entry.startAngle,
            endAngle: entry.endAngle,
            innerRadius: 0,
            outerRadius: geometry()!.outerRadius,
        })),
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

    /** A pie has one series, so the legend lists slices rather than series. */
    const entries = createMemo<LegendEntry[]>(() => {
        const index = seriesIndex();
        const { data } = frame();
        if (index === undefined) return [];

        const series = data.series[index];

        return data.categories.map((category, pointIndex) => {
            const point = series?.points?.find(candidate => candidate.type === category);

            return {
                label: point?.label ?? category,
                color: resolveColor(palette(), pointIndex, series, point),
                seriesIndex: index,
                pointIndex,
                visible: model.isPointVisible(index, pointIndex),
            };
        });
    });

    const labelAnchors = createMemo<ChartLabelAnchor[]>(() => {
        const token = labelsToken();
        const current = geometry();
        if (!token || !current || token.show === 'never' || placement() === 'hole') return [];

        const hovered = hover.hovered();
        const { data } = frame();
        const series = data.series[current.seriesIndex];

        return current.arcs.reduce<ChartLabelAnchor[]>((acc, entry) => {
            if (token.show === 'hover' && hovered?.pointIndex !== entry.pointIndex) return acc;

            const category = current.categories[entry.pointIndex];
            const point = series?.points?.find(candidate => candidate.type === category)
                ?? { type: category, value: entry.value };

            const outside = placement() === 'outside';
            const radius = outside ? current.outerRadius + OUTSIDE_LABEL_GAP : 0;
            const x = outside ? current.centre.x + Math.sin(entry.midAngle) * radius : current.centre.x + entry.centroid[0];
            const y = outside ? current.centre.y - Math.cos(entry.midAngle) * radius : current.centre.y + entry.centroid[1];

            acc.push({
                key: category,
                x,
                y,
                text: token.format ? token.format(point, series) : (point.label ?? category),
                align: outside ? (Math.sin(entry.midAngle) >= 0 ? 'start' : 'end') : 'center',
                seriesIndex: current.seriesIndex,
                pointIndex: entry.pointIndex,
            });

            return acc;
        }, []);
    });

    const sliceTransform = (pointIndex: number, midAngle: number) => {
        const offset = sliceToken()?.hoverOffset ?? 0;
        if (!offset || !hover.isHovered(geometry()!.seriesIndex, pointIndex)) return undefined;

        return `translate(${Math.sin(midAngle) * offset} ${-Math.cos(midAngle) * offset})`;
    };

    const sliceClasses = (pointIndex: number) => {
        const list = [styles.slice];
        if (hover.isHovered(geometry()?.seriesIndex ?? -1, pointIndex)) list.push(styles['is-hovered']);
        if (sliceToken()?.class) list.push(sliceToken()!.class!);

        return list.join(' ');
    };

    return (
        <ChartRoot
            componentProps={props}
            componentClass={styles.pie}
            legend={legendToken()}
            tooltip={tooltipToken()}
            entries={entries()}
            onToggle={entry => (entry.pointIndex === undefined
                ? model.toggleSeries(entry.seriesIndex)
                : model.togglePoint(entry.seriesIndex, entry.pointIndex))}
            hovered={hover.hovered()}
            plotRef={(element) => { plotElement = element; observePlot(element); }}
            overlayProps={hover.overlayProps()}
            showOverlay={hoverMode() === 'overlay'}
        >
            <svg
                class={styles.svg}
                width={size().width}
                height={size().height}
                // Never swallow input meant for the game when not interactive.
                style={{ 'pointer-events': hoverMode() === 'none' ? 'none' : undefined }}
            >
                <Show when={geometry()}>
                    <g transform={`translate(${geometry()!.centre.x} ${geometry()!.centre.y})`}>
                        <For each={geometry()!.arcs}>{(entry) => (
                            <path
                                d={entry.d}
                                fill={entry.color}
                                class={sliceClasses(entry.pointIndex)}
                                style={sliceToken()?.style}
                                transform={sliceTransform(entry.pointIndex, entry.midAngle)}
                                {...hover.markProps(geometry()!.seriesIndex, entry.pointIndex)}
                            />
                        )}</For>
                    </g>
                </Show>
            </svg>

            <Show when={labelsToken()}>
                <ChartLabels token={labelsToken()!} anchors={labelAnchors()} />
            </Show>
        </ChartRoot>
    );
};

export default Object.assign(PieChart, { Slice });
