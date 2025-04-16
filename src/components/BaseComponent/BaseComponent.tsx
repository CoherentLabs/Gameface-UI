import { mergeProps } from "solid-js";
import Events from "../types/BaseComponent";
import { ComponentProps } from "../types/ComponentProps";
import assignEventHandlers from "../utils/assignEventHandlers";

interface BaseComponentProps extends Events { }

const baseEventsSet = new Set([
    "abort",
    "animationend",
    "blur",
    "click",
    "dblclick",
    "durationchange",
    "ended",
    "finish",
    "focus",
    "focusin",
    "focusout",
    "gamepadconnected",
    "gamepaddisconnected",
    "keydown",
    "keypress",
    "keyup",
    "load",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "popstate",
    "readystatechange",
    "resize",
    "scroll",
    "timeout",
    "touchend",
    "touchmove",
    "touchstart",
    "transitionend",
    "volumechange",
    "wheel",
]);

function assignEvents(props: BaseComponentProps) {
    const events: Events = {};
    if (!props) return events;

    for (const key in props) {
        const typedKey = key as keyof Events;

        if (typedKey in props && baseEventsSet.has(typedKey)) {
            events[typedKey] = props[typedKey] as any;
        }
    }

    return events
}

function assignAttributes(props: BaseComponentProps) {
    const attributes: Record<string, any> = {};
    if (!props) return attributes;

    for (const key in props) {
        if (key.startsWith("attr:")) {
            const typedKey = key as `attr:${string}`;
            attributes[typedKey] = (props as Record<string, any>)[typedKey];
        }
    }

    return attributes
}

type BaseComponentType<P = BaseComponentProps> = (props: P) => {
    GFUI: {}
    log: typeof console.log,
    events: Events,
    attributes: Record<string, any>;
}

export const createBaseComponent: BaseComponentType = (props) => {
    const GFUI = {}
    const log = console.log;

    return { GFUI, log, events: assignEvents(props), attributes: assignAttributes(props) };
}

export const BaseComponent = (props: ComponentProps) => {
    const { GFUI, log, events, attributes } = createBaseComponent(props);
    const eventHandlers = assignEventHandlers(events);
    const classes = `${props.componentClasses || ''} ${props.class || ""} ${props.active || ""}`.trim();
    const inlineStyles = mergeProps(props.style, props.componentStyles);

    return {
        attributes,
        eventHandlers,
        className: classes,
        style: inlineStyles
    }
}