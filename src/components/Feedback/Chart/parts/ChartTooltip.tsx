import { Component, createEffect, createSignal, JSX, on, Show } from 'solid-js';
import styles from '../Chart.module.scss';
import { ChartPointEvent } from '../types';
import { TooltipTokenProps } from '../slots';
import { getSafePosition } from '@components/utils/getSafePosition';
import { waitForFrames } from '@components/utils/waitForFrames';

type Side = 'top' | 'bottom' | 'left' | 'right';

const DEFAULT_OFFSET = 12;

interface ChartTooltipProps {
    token: TooltipTokenProps;
    event: ChartPointEvent;
}

/**
 * The existing `createTooltip` factory wraps a fixed child element; a chart
 * tooltip instead follows a moving pointer with content that changes per
 * point, so it is its own element positioned inside the plot container.
 */
const ChartTooltip: Component<ChartTooltipProps> = (props) => {
    const preferred = () => (props.token.position && props.token.position !== 'auto' ? props.token.position : 'top');
    const [side, setSide] = createSignal<Side>(preferred());
    let element!: HTMLDivElement;

    // Re-run per hovered point rather than per pointer move: flipping is about
    // which edge of the viewport is near, not about sub-pixel movement.
    createEffect(on(() => `${props.event.seriesIndex}:${props.event.pointIndex}`, () => {
        setSide(preferred());
        if (props.token.position && props.token.position !== 'auto') return;

        waitForFrames(() => {
            if (!element) return;

            const safe = getSafePosition(element.getBoundingClientRect());
            if (safe) setSide(safe as Side);
        });
    }));

    const positionStyles = (): JSX.CSSProperties => {
        const { x, y } = props.event.position;
        const offset = props.token.offset ?? DEFAULT_OFFSET;

        switch (side()) {
            case 'bottom':
                return { left: `${x}px`, top: `${y + offset}px`, transform: 'translate(-50%, 0)' };
            case 'left':
                return { left: `${x - offset}px`, top: `${y}px`, transform: 'translate(-100%, -50%)' };
            case 'right':
                return { left: `${x + offset}px`, top: `${y}px`, transform: 'translate(0, -50%)' };
            default:
                return { left: `${x}px`, top: `${y - offset}px`, transform: 'translate(-50%, -100%)' };
        }
    };

    const classes = () => {
        const list = [styles.tooltip];
        if (props.token.class) list.push(props.token.class);

        return list.join(' ');
    };

    return (
        <div ref={element} class={classes()} style={{ ...positionStyles(), ...props.token.style }}>
            <Show when={props.token.content} fallback={
                <>
                    <span class={styles['tooltip-label']}>{props.event.point.label ?? props.event.point.type}</span>
                    <span class={styles['tooltip-value']}>{props.event.point.value}</span>
                </>
            }>
                {props.token.content!(props.event)}
            </Show>
        </div>
    );
};

export default ChartTooltip;
