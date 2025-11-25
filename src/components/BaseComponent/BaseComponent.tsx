import { useNavigation } from "@components/Utility/Navigation/Navigation";
import eventBus from "@components/tools/EventBus";
import { ComponentProps, NavigationActionsConfig } from "@components/types/ComponentProps";
import { Accessor, createEffect } from "solid-js";
import { waitForFrames } from "@components/utils/waitForFrames";
import { DEFAULT_ACTION_NAMES } from "@components/Utility/Navigation/defaults";
import { DefaultActions } from "@components/Utility/Navigation/types";

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

function navigationActions(el: HTMLElement, accessor: Accessor<NavigationActionsConfig>) {
    const nav = useNavigation();
    if (!nav) return;

    const config = accessor();
    const { anchor, ...actionHandlers } = config;

    el.setAttribute('tabindex', '0');

    let anchorElement: HTMLElement | null = null;
    if (anchor) {
        if (typeof anchor === 'string') {
            waitForFrames(() => anchorElement = document.querySelector(anchor));
        } else {
            anchorElement = anchor;
        }
    }

    const isFocused = () => {
        const active = document.activeElement;
        return active === el ||
            (anchorElement && active === anchorElement) ||
            el.contains(active);
    };

    const listeners: Array<[string, (args: any) => void]> = [];
    for (const [name, func] of Object.entries(actionHandlers)) {
        const action = nav.getAction(name);
        if (!action) {
            console.warn(`Action "${name}" is not registered in Navigation.`);
            continue;
        }

        if (!action.global && !DEFAULT_ACTION_NAMES.has(name as DefaultActions)) {
            console.warn(`Action "${name}" is not global. To subscribe components to it, please make it global.`);
            continue;
        }

        const handler = (args: any) => {
            if (isFocused()) (func as Function)(args);
        };

        eventBus.on(name, handler);
        listeners.push([name, handler]);
    }

    return () => {
        for (const [name, handler] of listeners) {
            eventBus.off(name, handler);
        }
    };
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

    return { className, inlineStyles, forwardAttrs, forwardEvents, navigationActions };
}

export default useBaseComponent;