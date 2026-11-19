import { Component, For, Show } from 'solid-js';
import styles from '../Chart.module.scss';
import { LegendEntry } from '../types';
import { LegendTokenProps } from '../slots';

interface ChartLegendProps {
    token: LegendTokenProps;
    entries: LegendEntry[];
    onToggle: (entry: LegendEntry) => void;
}

/**
 * Plain HTML, so it is fully styleable and can take part in gamepad navigation
 * — unlike the SVG marks, which stay pointer-only.
 */
const ChartLegend: Component<ChartLegendProps> = (props) => {
    const isInteractive = () => props.token.interactive !== false;

    const entryClasses = (entry: LegendEntry) => [styles['legend-entry'], !entry.visible && styles['legend-entry-hidden']];

    return (
        <div class={[styles.legend, styles[`legend-${props.token.position ?? 'bottom'}`], props.token.class]} style={props.token.style}>
            {/* keyed={false}, not the default For: the entry objects are rebuilt whenever the chart
                re-renders, including on every animation frame. */}
            <For each={props.entries} keyed={false}>{(entry) => (
                <div
                    class={entryClasses(entry())}
                    tabindex={isInteractive() ? 0 : undefined}
                    onClick={() => isInteractive() && props.onToggle(entry())}
                >
                    <Show when={props.token.content} fallback={
                        <>
                            <span class={styles['legend-marker']} style={{ 'background-color': entry().color }} />
                            <span class={styles['legend-label']}>{entry().label}</span>
                        </>
                    }>
                        {props.token.content!(entry())}
                    </Show>
                </div>
            )}</For>
        </div>
    );
};

export default ChartLegend;
