import { useContext } from "solid-js";
import { TutorialContext } from "./Tutorial";
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";
import exposeRef from "@components/utils/exposeRef";

interface ControlsProps extends ComponentProps {
    direction: 'next' | 'prev',
}

const Controls = (props: ControlsProps) => {
    const ctx = useContext(TutorialContext);
    if (!ctx) return;

    // A `click` prop is attached as a listener by baseComponent, so it isn't called here as well.
    const clickHandler = () => {
        if (props.direction === 'next') {
            return ctx.progress() === 100 ? ctx.exit() : ctx.nextStep();
        }
        return ctx.previousStep();
    }

    return (
        <div
            class={props.class}
            style={props.style}
            ref={[exposeRef(props), baseComponent(props)]}
            onClick={clickHandler}>
            {props.children}
        </div>
    )
}

export default Controls
