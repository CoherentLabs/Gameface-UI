import { children, createEffect, createMemo, onCleanup, onMount, ParentComponent, useContext } from "solid-js"
import { TutorialContext } from "./Tutorial";
import { waitForFrames } from "@components/utils/waitForFrames";
import { TooltipPosition } from "./TutorialTooltip";

interface StepProps {
    order: number,
    title?: string,
    content?: string,
    outset?: number,
    position?: TooltipPosition
}

const Step: ParentComponent<StepProps> = (props) => {
    const ctx = useContext(TutorialContext)
    if (!ctx) return null;

    const storedChildren = children(() => props.children)
    const isCurrent = createMemo(() => ctx.current() === props.order);

    createEffect(() => {
        if (!isCurrent()) return;

        const isInitial = ctx.initialRender();
        waitForFrames(() => {
            if (isInitial) ctx.setInitialRender(false);
            updateTargetElement()
            updateTooltipContent()
        }, !isInitial ? 0 : 3)
    })

    const updateTargetElement = () => {
        let children = storedChildren();
        if (Array.isArray(children)) {
            const htmlElement = children.find((child) => child instanceof HTMLElement)
            children = htmlElement?.parentElement
        }
        
        if (children && children instanceof HTMLElement) {
            ctx.setTarget(children)
        } else console.warn(
            '[Tutorial.Step] Invalid child element detected. ' +
            'Each <Tutorial.Step> must wrap a valid HTML element (e.g., <div>, <button>, <section>, etc.), ' +
            'not text, numbers, or other non-DOM nodes.'
        );
    }

    const updateTooltipContent = () => {
        ctx.setOutset(props.outset ?? null);
        ctx.setTooltipData({
            title: props.title || "",
            content: props.content || "",
            position: props.position || null
        })
    }

    onMount(() => ctx.setCount(prev => prev + 1))
    onCleanup(() => ctx.setCount(prev => prev - 1))

    return storedChildren()
}

export default Step;