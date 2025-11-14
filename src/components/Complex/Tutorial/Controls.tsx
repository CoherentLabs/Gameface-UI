import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { useContext } from "solid-js";
import { TutorialContext } from "./Tutorial";
import { ComponentProps } from "@components/types/ComponentProps";

interface ControlsProps extends ComponentProps {
    direction: 'next' | 'prev',
}

const Controls = (props: ControlsProps) => {
    const ctx = useContext(TutorialContext);
    if (!ctx) return;

    const clickHanlder = (e: MouseEvent) => {
        const isNext = props.direction === 'next';
        props.click?.(e);
        
        if (isNext) {
            return ctx.progress() === 100 ? ctx.exit() : ctx.nextStep();
        }
        return ctx.previousStep();
    }

    const { className, inlineStyles, forwardEvents, forwardAttrs } = useBaseComponent(props);

    return (
        <div 
            ref={props.ref as HTMLDivElement}
            class={className()}
            style={inlineStyles()}
            use:forwardAttrs={props}
            use:forwardEvents={props}
            onclick={clickHanlder}>
                {props.children}
        </div>
    )
}

export default Controls