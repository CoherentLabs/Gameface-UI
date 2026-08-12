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

    const classes = () => {
        const list = [styles.legend, styles[`legend-${props.token.position ?? 'bottom'}`]];
        if (props.token.class) list.push(props.token.class);

        return list.join(' ');
    };

    const entryClasses = (entry: LegendEntry) => {
        const list = [styles['legend-entry']];
        if (!entry.visible) list.push(styles['legend-entry-hidden']);

        return list.join(' ');
    };

    return (
        <div class={classes()} style={props.token.style}>
            <For each={props.entries}>{(entry) => (
                <div
                    class={entryClasses(entry)}
                    tabindex={isInteractive() ? 0 : undefined}
                    onClick={() => isInteractive() && props.onToggle(entry)}
                >
                    <Show when={props.token.content} fallback={
                        <>
                            <span class={styles['legend-marker']} style={{ 'background-color': entry.color }} />
                            <span class={styles['legend-label']}>{entry.label}</span>
                        </>
                    }>
                        {props.token.content!(entry)}
                    </Show>
                </div>
            )}</For>
        </div>
    );
};

export default ChartLegend;
