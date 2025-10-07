import { ComponentProps } from "@components/types/ComponentProps";
import { createEffect } from "solid-js";

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

function forwardAttrs(el: HTMLElement, getData: () => Record<string, any>) {
    let prev = new Set<string>();

    return createEffect(() => {
        const data = getData();
        const seen = new Set<string>();

        for (const key in data) {
            if (!key.startsWith("attr:")) continue;

            const name = key.slice(5);
            const val = data[key];
            seen.add(name);

            if (val != null) el.setAttribute(name, String(val));
            else el.removeAttribute(name);
        }

        for (const old of prev) {
            if (!seen.has(old)) el.removeAttribute(old);
        }

        prev = seen;
    });
}

function forwardEvents(el: HTMLElement, getData: () => Record<string, any>) {
    const listeners: Array<[string, EventListener]> = [];
    const data = getData();

    for (const name of baseEventsSet) {
        const handler = data[name];
        if (handler) {
            el.addEventListener(name, handler as EventListener);
            listeners.push([name, handler as EventListener]);
        }
    }
    return () => {
        for (const [eventName, fn] of listeners) {
            el.removeEventListener(eventName, fn);
        }
    }
}

export function useBaseComponent(props: ComponentProps) {
    const className = () => {
        const classes = (typeof props.componentClasses === "function" ? props.componentClasses() : props.componentClasses || '') + " " + (props.class || '');
        return classes.trim();
    };

    const inlineStyles = () => ({
        ...(typeof props.componentStyles === "function" ? props.componentStyles() : props.componentStyles),
        ...props.style
    });

    return { className, inlineStyles, forwardAttrs, forwardEvents };
}

export default useBaseComponent;