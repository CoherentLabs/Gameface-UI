import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Component, createEffect, createMemo, createSignal, useContext } from "solid-js";
import { dynamic, type JSX } from "@solidjs/web";
import { TutorialContext } from "./Tutorial";
import Controls from "./Controls";
import Progress from "@components/Feedback/Progress/Progress";
import Flex from "@components/Layout/Flex/Flex";
import { getSafePosition } from "@components/utils/getSafePosition";
import styles from './Tutorial.module.scss';

export interface ToolTipData {
    title?: string; 
    content?: string | JSX.Element;
    position?: TooltipPosition
}

export type TooltipPosition = "bottom" | "top" | "right" | "left" | null;

type DefaultProps = {
  class?: string;
  style?: JSX.CSSProperties;
};

export interface ProvidedProps {
    title: string | undefined,
    content: string | JSX.Element | undefined
    step: Accessor<number>,
    Next: Component<ComponentProps>,
    Prev: Component<ComponentProps>,
    progress: Accessor<number>,
}

export type TooltipType<T extends Record<string, any> = {}> = Component<ProvidedProps & Partial<T> & DefaultProps>;

interface TutorialTooltipProps<T extends Record<string, any>> {
    userTooltip: TooltipType<T> | undefined,
    tooltipData: Accessor<ToolTipData>,
    progress: Accessor<number>,
}

const DefaultTooltip: TooltipType = (props) => {
    return (
        <div class={styles.tooltip} >
            <h2 class={styles['tooltip-heading']}>{props.title}</h2>
            <span class={styles['tooltip-content']}>{props.content}</span>
            <Progress.Bar class={styles['tooltip-progress']} progress={props.progress()} />
            <Flex>
                <props.Prev class={`${styles['tooltip-control']} ${styles['tooltip-control-first']}`}>Prev</props.Prev>
                <props.Next class={styles['tooltip-control']}>{props.progress() === 100 ? 'Done' : "Next"}</props.Next>
            </Flex>
        </div>
    )
}

const Next = (p: ComponentProps) => <Controls {...p} direction="next" />;
const Prev = (p: ComponentProps) => <Controls {...p} direction="prev" />;

const DEFAULT_POSITION = "bottom"

const TutorialTooltip = <T extends Record<string, any> = {}>(props: TutorialTooltipProps<T>) => {
    const ctx = useContext(TutorialContext);
    // eslint-disable-next-line solid/components-return-once -- misuse guard: the context is fixed for the component's lifetime, so render nothing
    if (!ctx) return;

    const [visible, setVisible] = createSignal(false);
    let elementRef: HTMLDivElement | undefined;
    let visibleTO: NodeJS.Timeout | undefined;

    createEffect(() => ctx.current(), (current) => {
        setVisible(false);

        if (visibleTO) clearTimeout(visibleTO);
        visibleTO = setTimeout(() => {
            if (current === 0) return;
            setVisible(true)
        }, 500)
    }, { defer: true });

    const position = createMemo((prev: TooltipPosition | undefined) => {
        const currentPosition = prev || DEFAULT_POSITION;
        if (!visible() || !elementRef) return currentPosition;

        const provided = props.tooltipData().position;
        if (provided) return provided;

        const rect = elementRef!.getBoundingClientRect();
        const suggested = getSafePosition(rect!)

        return suggested || currentPosition;
    })

    // The user's tooltip component, or the default one.
    // Typed without the extra `T` props: the Tutorial only ever passes ProvidedProps.
    const TooltipComponent = dynamic(() => (props.userTooltip ?? DefaultTooltip) as TooltipType);

    return (
        <div
            ref={(el: HTMLDivElement) => { elementRef = el; }}
            class={[styles['tooltip-wrapper'], visible() && styles['tooltip-visible'], styles[`tooltip-${position()}`]]}>
            {/* One prop each (not a spread of providedTooltipProps()): with the spread, reading any prop (e.g. progress)
                also read tooltipData, so a step change rendered once with the new step and the old data (EFFECT_RELAY_TEAR). */}
            <TooltipComponent
                title={props.tooltipData().title}
                content={props.tooltipData().content}
                step={ctx.current}
                Next={Next}
                Prev={Prev}
                progress={props.progress} />
        </div>
    )
}

export default TutorialTooltip;