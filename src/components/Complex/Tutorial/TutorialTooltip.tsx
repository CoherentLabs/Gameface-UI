import { ComponentProps } from "@components/types/ComponentProps";
import { Accessor, Component, createEffect, createMemo, createRenderEffect, createSignal, JSX, on, Show, useContext } from "solid-js";
import { Dynamic } from "solid-js/web";
import { HighlightRect, TutorialContext } from "./Tutorial";
import Controls from "./Controls";
import Progress from "@components/Feedback/Progress/Progress";
import Flex from "@components/Layout/Flex/Flex";
import { getSafePosition } from "@components/utils/getSafePosition";
import styles from './Tutorial.module.scss';

export interface ToolTipData {
    title?: string; 
    content?: string | JSX.Element;
}

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

export type TooltipType<T extends Record<string, any> = {}> = Component<ProvidedProps & T & DefaultProps>;

interface TutorialTooltipProps<T extends Record<string, any>> {
    data: Accessor<ToolTipData>,
    showTooltip: Accessor<boolean>,
    userTooltip: TooltipType<T> | undefined,
    progress: Accessor<number>,
}

const DefaultTooltip: TooltipType = (props) => {
    return (
        <div class={styles.tooltip} >
            <h2 class={styles['tooltip-heading']}>{props.title}</h2>
            <span class={styles['tooltip-content']}>{props.content}</span>
            <Progress.Bar class={styles['tooltip-progress']} style={{width: '100%'}} progress={props.progress()}>
            </Progress.Bar>
            <Flex>
                <props.Prev class={`${styles['tooltip-control']} ${styles['tooltip-control-first']}`}>Prev</props.Prev>
                <props.Next class={styles['tooltip-control']}>Next</props.Next>
            </Flex>
        </div>
    )
}

const Next = (p: ComponentProps) => <Controls {...p} direction="next" />;
const Prev = (p: ComponentProps) => <Controls {...p} direction="prev" />;

const DEFAULT_POSITION = "bottom"

const TutorialTooltip = <T extends Record<string, any> = {}>(props: TutorialTooltipProps<T>) => {
    const ctx = useContext(TutorialContext);
    if (!ctx) return;

    const [visible, setVisible] = createSignal(false);
    let elementRef: HTMLDivElement | undefined;
    let visibleTO: NodeJS.Timeout | undefined;

    

    const providedTooltipProps = (): ProvidedProps => {
        const data = props.data();

        return {
            title: data.title,
            content: data.content,
            step: ctx.current,
            Next,
            Prev,
            progress: props.progress,
        }
    }

    createEffect(on(ctx.current, () => {
        setVisible(false);

        if (visibleTO) clearTimeout(visibleTO);
        visibleTO = setTimeout(() => setVisible(true), 500)
    }))

    const position = createMemo((prev) => {
        const currentPosition = prev || DEFAULT_POSITION;
        if (!visible() || !elementRef) return currentPosition;

        const rect = elementRef!.getBoundingClientRect();
        return  getSafePosition(rect!) || currentPosition;
    })

    const tooltipClasses = createMemo(() => {
        const classes = [styles['tooltip-wrapper']];

        if (visible()) classes.push(styles['tooltip-visible']);
        classes.push(styles[`tooltip-${position()}`]);
        return classes.join(' ');
    });

    return (
        <div 
            ref={elementRef} 
            class={tooltipClasses()}>
            <Show when={props.userTooltip} fallback={<DefaultTooltip {...providedTooltipProps()} />}>
                <Dynamic component={props.userTooltip! as Component<ProvidedProps & DefaultProps>} {...providedTooltipProps()} />
            </Show>
        </div>
    )
}

export default TutorialTooltip;