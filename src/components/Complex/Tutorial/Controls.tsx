import useBaseComponent from "@components/BaseComponent/BaseComponent";
import { ParentComponent, useContext } from "solid-js";
import { TutorialContext } from "./Tutorial";
import { ComponentProps } from "@components/types/ComponentProps";

interface ControlsProps extends ComponentProps {
    direction: 'next' | 'prev',
}

const Controls = (props: ControlsProps) => {
    const ctx = useContext(TutorialContext);
    if (!ctx) return;

    const clickHanlder = () => {
        return props.direction === 'prev' ? ctx.previousStep() : ctx.nextStep();
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