import { Accessor, children, Component, createContext, createEffect, createMemo, createSignal, For, JSX, onMount, ParentComponent, Setter, Show, untrack } from "solid-js";
import { ComponentProps } from "@components/types/ComponentProps";
import Step from "./Step";
import styles from './Tutorial.module.scss';
import { Portal } from "solid-js/web";
import useBaseComponent from "@components/BaseComponent/BaseComponent";
import TutorialTooltip, { ToolTipData, TooltipType } from "./TutorialTooltip";

export type HighlightRect = Omit<DOMRect, 'bottom' | 'right' | 'x' | 'y' | 'toJSON'>;

interface TutorialProps<T extends Record<string, any> = {}> extends ComponentProps {
    outset?: number
    tooltip?: TooltipType<T>
}

interface TutorialContextType {
    current: Accessor<number>,
    setTarget: Setter<HTMLElement | null>
    setCount: Setter<number>,
    nextStep: () => void,
    previousStep: () => void,
    setTooltipData: Setter<ToolTipData>,
    initialRender: Accessor<boolean>,
    setInitialRender: Setter<boolean>
}
export const TutorialContext = createContext<TutorialContextType>();

export interface TutorialRef {
    element: HTMLDivElement;
}

export function Tutorial<T extends Record<string, any> = {}>(props: TutorialProps<T>): JSX.Element {
    let element: HTMLDivElement | undefined;

    const [currentStep, setCurrentStep] = createSignal(2);
    const [initialRender, setInitialRender] = createSignal(true);
    const [targetElement, setTargetElement] = createSignal<HTMLElement | null>(null);
    const [highlightRect, setHighlightRect] = createSignal<HighlightRect | null>(null);
    const [tutorialStyles, setTutorialStyles] = createSignal<JSX.CSSProperties>({});
    const [tooltipData, setTooltipData] = createSignal<ToolTipData>({});
    const [count, setCount] = createSignal(0);
    const [showTooltip, setShowTooltip] = createSignal(false);
    
    const tutorialClasses = createMemo(() => {
        const classes = [styles.tutorial];
        targetElement() && classes.push(styles['tutorial-visible'])

        return classes.join(" ");
    })

    // CHANGE
    const nextStep = () => {
        setShowTooltip(false);
        setCurrentStep(prev => prev + 1);
    }
    // CHANGE
    const previousStep = () => {
        setCurrentStep(prev => prev - 1);
    }

    const progress = createMemo(() => {
        const steps = count();
        if (steps <= 0) return 0;
        return Number((currentStep() / steps * 100).toFixed(2))
    })

    createEffect(() => {
        const target = targetElement();
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const outset = props.outset ?? 0;

        setHighlightRect({
            left: rect.left - outset,
            top: rect.top - outset,
            width: rect.width + outset * 2,
            height: rect.height + outset * 2,
        })

        setTutorialStyles(() => {
            const { left, top, width, height } = highlightRect()!;
            return {
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`
            }
        });
    })

    props.componentClasses = tutorialClasses;
    props.componentStyles = tutorialStyles;
    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    onMount(() => {
        if (!props.ref || !element) return;

        (props.ref as unknown as (ref: any) => void)({
            element,
        });
    });

    const ctxObject: TutorialContextType = {
        current: currentStep,
        setTarget: setTargetElement,
        setCount,
        nextStep,
        previousStep,
        setTooltipData,
        initialRender,
        setInitialRender
    }

    return (
        <TutorialContext.Provider value={ctxObject}>
            {props.children}
            <Portal>
                <div
                    ref={element}
                    class={className()}
                    style={inlineStyles()}
                    use:forwardEvents={props}
                    use:forwardAttrs={props}>
                    <TutorialTooltip 
                        data={tooltipData} 
                        showTooltip={showTooltip}
                        userTooltip={props.tooltip}
                        progress={progress} />
                </div>
                <div class={styles.overlay}></div>
            </Portal>
        </TutorialContext.Provider>
    );
};

export default Object.assign(Tutorial, { Step });