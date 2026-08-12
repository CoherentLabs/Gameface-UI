import { Component, For } from 'solid-js';
import styles from '../Chart.module.scss';
import { LabelsTokenProps } from '../slots';

export interface ChartLabelAnchor {
    key: string;
    /** Plot-local pixels. */
    x: number;
    y: number;
    text: string;
    /** Which side of the anchor the text sits on. */
    align: 'center' | 'start' | 'end';
    seriesIndex: number;
    pointIndex: number;
}

interface ChartLabelsProps {
    token: LabelsTokenProps;
    anchors: ChartLabelAnchor[];
}

const TRANSFORMS: Record<ChartLabelAnchor['align'], string> = {
    center: 'translate(-50%, -50%)',
    start: 'translate(0, -50%)',
    end: 'translate(-100%, -50%)',
};

/**
 * Labels are HTML, never SVG `<text>` — Gameface supports only basic `<text>`
 * with no `<tspan>` and no additional text properties, so fonts, wrapping and
 * ellipsis would all be unavailable inside the SVG.
 */
const ChartLabels: Component<ChartLabelsProps> = (props) => (
    <div class={styles.labels}>
        <For each={props.anchors}>{(anchor) => (
            <div
                class={[styles.label, props.token.class].filter(Boolean).join(' ')}
                style={{
                    left: `${anchor.x}px`,
                    top: `${anchor.y}px`,
                    transform: TRANSFORMS[anchor.align],
                    ...props.token.style,
                }}
            >
                {anchor.text}
            </div>
        )}</For>
    </div>
);

export default ChartLabels;
