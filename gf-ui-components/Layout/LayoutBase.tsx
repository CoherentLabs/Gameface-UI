import BaseComponent from "../BaseComponent/BaseComponent";
import { ParentProps, Component, ParentComponent, JSX, useContext, onMount, createSignal, mergeProps  } from "solid-js";
import assignEventHandlers from "../utils/assignEventHandlers";
import LayoutBaseProps from "../types/LayoutBase";

export interface LayoutBaseRef {
    element: HTMLDivElement; 
}

interface LayoutBaseComponentProps<T extends Record<string, any> = {}> extends LayoutBaseProps {
    componentStyles?: JSX.CSSProperties,
    componentClasses?: string
    ref?: (ref: LayoutBaseRef & T) => void;
    refObject?: T;
}

const LayoutBase: ParentComponent<LayoutBaseComponentProps> = (passedProps) => {
    const props = mergeProps(passedProps)
    const { GFUI, log, events } = BaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${props.componentClasses} ${props.class || ""}`.trim();
    const inlineStyles = {
        ...props.style,
        ...props.componentStyles
    }
    let element: HTMLDivElement | undefined;
    
    onMount(() => {
        if (props.ref && element) {
          props.ref({
            ...props.refObject,
            element,
          })
        }
    });

    return (
        <div ref={element} {...eventHandlers} class={classes} style={inlineStyles}>
            {props.children}
        </div>
    )
}

export default LayoutBase;