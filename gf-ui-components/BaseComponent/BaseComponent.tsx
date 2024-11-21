import Events from "../types/BaseComponent";

interface BaseComponentProps extends Events {}

const baseEventsSet = new Set ([
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

type BaseComponentType<P = BaseComponentProps> = (props: P) => {
    GFUI: {}
    log: typeof console.log,
    events: Events,
}

const BaseComponent: BaseComponentType = (props) => {
    const GFUI = {}
    const log = console.log;

    return { GFUI, log, events: assignEvents(props) };
}


export default BaseComponent;