import { JSX, ParentComponent, Show } from 'solid-js';
import baseComponent from '@components/BaseComponent/BaseComponent';
import styles from '../Chart.module.scss';
import { BaseChartProps, ChartPointEvent, LegendEntry } from '../types';
import { LegendTokenProps, TooltipTokenProps } from '../slots';
import ChartLegend from './ChartLegend';
import ChartTooltip from './ChartTooltip';

interface ChartRootProps {
    /** The consumer's props, forwarded to the baseComponent directive. */
    componentProps: BaseChartProps;
    /** The chart type's own root class, merged with the shared chart class. */
    componentClass: string;
    legend?: LegendTokenProps | null;
    tooltip?: TooltipTokenProps | null;
    entries: LegendEntry[];
    onToggle: (entry: LegendEntry) => void;
    hovered: ChartPointEvent | null;
    /** Receives the plot container, which is the element that gets measured. */
    plotRef: (element: HTMLDivElement) => void;
    /** Empty unless the chart is in overlay hit-testing mode. */
    overlayProps: JSX.HTMLAttributes<HTMLDivElement>;
    showOverlay: boolean;
}

/**
 * Shared chart layout: an optional legend as a flex sibling of the plot.
 *
 * The legend is a sibling rather than a reserved margin so the plot container
 * is measured at its true size — no manual bookkeeping to keep the SVG and the
 * HTML overlays aligned.
 */
const ChartRoot: ParentComponent<ChartRootProps> = (props) => {
    const legendPosition = () => props.legend?.position ?? 'bottom';

    const rootClasses = () => {
        const list = [styles.chart, styles[`chart-${legendPosition()}`], props.componentClass];
        return list.filter(Boolean).join(' ');
    };

    props.componentProps.componentClasses = () => rootClasses();

    return (
        <div
            ref={props.componentProps.ref as HTMLDivElement}
            use:baseComponent={props.componentProps}
        >
            <Show when={props.legend}>
                <ChartLegend token={props.legend!} entries={props.entries} onToggle={props.onToggle} />
            </Show>

            <div class={styles.plot} ref={props.plotRef}>
                {props.children}

                <Show when={props.showOverlay}>
                    <div class={styles.overlay} {...props.overlayProps} />
                </Show>

                <Show when={props.tooltip && props.hovered}>
                    <ChartTooltip token={props.tooltip!} event={props.hovered!} />
                </Show>
            </div>
        </div>
    );
};

export default ChartRoot;
