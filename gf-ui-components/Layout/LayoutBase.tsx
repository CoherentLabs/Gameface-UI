import { ParentComponent, onMount } from "solid-js";
import { ComponentProps } from "../types/ComponentProps";
import { BaseComponent } from "../BaseComponent/BaseComponent";

const LayoutBase: ParentComponent<ComponentProps> = (props) => {
    let element: HTMLDivElement | undefined;
    const { eventHandlers, ...rest } = BaseComponent(props);

    onMount(() => {
        if (props.ref && element) {
            (props.ref as (ref: any) => void)({
                ...props.refObject,
                element,
            })
        }
    });

    return (
        <div ref={element} {...eventHandlers} {...rest}>
            {props.children}
        </div>
    )
}

export default LayoutBase;