import { useContext } from "solid-js";
import { TutorialContext } from "./Tutorial";
import { ComponentProps } from "@components/types/ComponentProps";
import baseComponent from "@components/BaseComponent/BaseComponent";

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


    return (
        <div
            ref={props.ref as HTMLDivElement}
            use:baseComponent={props}
            onclick={clickHanlder}>
            {props.children}
        </div>
    )
}

export default Controls