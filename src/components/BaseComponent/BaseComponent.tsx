import { createEffect, onCleanup } from "solid-js";
import { ComponentProps, NavigationActionsConfig } from "@components/types/ComponentProps";
import { useNavigation } from "@components/Utility/Navigation/Navigation";
import eventBus from "@components/Utility/EventBus";
import { waitForFrames } from "@components/utils/waitForFrames";
import { DEFAULT_ACTION_NAMES } from "@components/Utility/Navigation/defaults";
import { DefaultActions } from "@components/Utility/Navigation/types";

const baseEventsSet = new Set([
    "abort", "animationend", "blur", "click", "dblclick", "durationchange", "ended", "finish",
    "focus", "focusin", "focusout", "gamepadconnected", "gamepaddisconnected", "keydown",
    "keypress", "keyup", "load", "mousedown", "mouseenter", "mouseleave", "mousemove",
    "mouseout", "mouseover", "mouseup", "popstate", "readystatechange", "resize", "scroll",
    "timeout", "touchend", "touchmove", "touchstart", "transitionend", "volumechange", "wheel",
]);

function handleClasses(getEl: () => HTMLElement | undefined, props: ComponentProps) {
    createEffect(
        () => {
            const rawBase = props.componentClasses;
            const base = typeof rawBase === "function" ? rawBase() : rawBase;
            const ext = props.class;
            return base ? (ext ? base + " " + ext : base) : (ext || "");
        },
        (finalClass) => {
            const el = getEl();
            if (el) el.className = finalClass;
        }
    );
}

type StyleObject = Record<string, string | number | null | undefined>;

function reconcileStyles(elStyle: CSSStyleDeclaration, next: any, prev: any) {
    for (const key in prev) {
        if (next[key] == null) {
            if (key.indexOf("-") > -1) {
                elStyle.removeProperty(key);
            } else {
                // @ts-ignore
                elStyle[key] = "";
            }
        }
    }

    for (const key in next) {
        const value = next[key];

        if (prev[key] !== value) {
            if (key.indexOf("-") > -1) {
                elStyle.setProperty(key, String(value));
            } else {
                // @ts-ignore
                elStyle[key] = value;
            }
        }
    }
}

function handleStyles(getEl: () => HTMLElement | undefined, props: ComponentProps) {
    let prevStyles: StyleObject = {};

    createEffect(() => {
        const compRaw = props.componentStyles;
        const extStyles = props.style;
        const compStyles = typeof compRaw === "function" ? compRaw() : compRaw;

        return ({extStyles, compStyles})

    }, ({compStyles, extStyles}) => {
        const el = getEl();
        
        if (!el) return;

        if (!compStyles && !extStyles) {
            if (Object.keys(prevStyles).length > 0) {
                el.removeAttribute("style");
                prevStyles = {};
            }
            return;
        }

        const styles = el.style;
        const isCompString = typeof compStyles === "string";
        const isExtString = typeof extStyles === "string";

        if (isCompString || isExtString) {
            const compStr = isCompString ? compStyles : "";
            const extStr = isExtString ? extStyles : "";
            const finalString = [compStr, extStr].filter(part => part && String(part).trim() !== "").join(";");

            if (styles.cssText !== finalString) {
                styles.cssText = finalString;
            }

            prevStyles = {};
            return;
        }

        const nextStyles: StyleObject = {
            ...(compStyles as StyleObject || {}),
            ...(extStyles as StyleObject || {})
        };

        reconcileStyles(styles, nextStyles, prevStyles);

        prevStyles = nextStyles;
    });
}

function handleAttrs(getEl: () => HTMLElement | undefined, props: ComponentProps) {
    createEffect(() => {
        const attrs: Record<string, string | null> = {};
        for (const key in props) {
            if (!key.startsWith('data-')) continue;
            attrs[key] = (props as any)[key] != null ? String((props as any)[key]) : null;
        }
        return attrs;
    }, 
    (next, prev) => {
        const el = getEl();
        if (!el) return;
        if (prev) {
            for (const key in prev) {
                if (!(key in next)) el.removeAttribute(key);
            }
        }
        for (const key in next) {
            if (next[key] != null) el.setAttribute(key, next[key]!);
            else el.removeAttribute(key);
        }
    })
}

function handleEvents(getEl: () => HTMLElement | undefined, props: ComponentProps) {
    const listeners: Array<[string, EventListener]> = [];

    for (const key in props) {
        if (baseEventsSet.has(key)) {
            const handler = (props as any)[key];
            if (typeof handler === 'function') {
                
                listeners.push([key, handler as EventListener]);
            }
        }
    }

    onCleanup(() => {
        const el = getEl();
        if (!el) return;
        for (const [eventName, fn] of listeners) {
            el.removeEventListener(eventName, fn);
        }
    })

    return (el: HTMLElement) => {
        for (const [eventName, fn] of listeners) {
            el.addEventListener(eventName, fn);
        }
    };
}

export function navigationActions(config: NavigationActionsConfig | undefined) {
    if (!config) return () => {};

    const nav = useNavigation();
    if (!nav) return () => {};

    const { anchor, ...actionHandlers } = config;
    let el: HTMLElement | undefined, 
    anchorElement: HTMLElement | null = null;

    const isFocused = () => {
        if (!el) return false;
        const active = document.activeElement;

        return (
            active === el || 
            (anchorElement !== null && active === anchorElement) || 
            el.contains(active)
        );
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

        const handler = (...args: any) => {
            if (isFocused()) (func as Function)(...args);
        };

        eventBus.on(name, handler);
        listeners.push([name, handler]);
    }

    
    onCleanup(() => {
        for (const [name, handler] of listeners) {
            eventBus.off(name, handler);
        }
    })

    return (nextEl: HTMLElement) => {
        el = nextEl
        el.setAttribute('tabindex', '0');

        if (anchor) {
            if (typeof anchor === 'string') {
                waitForFrames(() => anchorElement = document.querySelector(anchor));
            } else if (anchor instanceof HTMLElement) {
                anchorElement = anchor;
            }
        }
    }
}

function baseComponent(props: ComponentProps<any>) {
    let el: HTMLElement | undefined;
    handleClasses(() => el, props);
    handleStyles(() => el, props);
    handleAttrs(() => el, props);
    const attachEvents = handleEvents(() => el, props);

    return (nextEl: HTMLElement) => {
        el = nextEl;
        attachEvents(nextEl);

        if (!props.ref) return;

        if (props.refObject) {
            (props.ref as Function)({ ...props.refObject, element: nextEl });
        } else {
            (props.ref as Function)(nextEl);
        }
    }
}

export default baseComponent;