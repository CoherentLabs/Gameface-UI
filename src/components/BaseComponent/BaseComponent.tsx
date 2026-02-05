import { createEffect, onCleanup } from "solid-js";
import { ComponentProps } from "@components/types/ComponentProps";

const baseEventsSet = new Set([
    "abort", "animationend", "blur", "click", "dblclick", "durationchange", "ended", "finish",
    "focus", "focusin", "focusout", "gamepadconnected", "gamepaddisconnected", "keydown",
    "keypress", "keyup", "load", "mousedown", "mouseenter", "mouseleave", "mousemove",
    "mouseout", "mouseover", "mouseup", "popstate", "readystatechange", "resize", "scroll",
    "timeout", "touchend", "touchmove", "touchstart", "transitionend", "volumechange", "wheel",
]);

function handleClasses(el: Element, props: ComponentProps) {
    let currentClass = "";

    createEffect(() => {
        const rawBase = props.componentClasses;
        const base = typeof rawBase === "function" ? rawBase() : rawBase;

        const ext = props.class;
        const finalClass = base ? (ext ? base + " " + ext : base) : (ext || "");

        if (currentClass !== finalClass) {
            const prevTokens = currentClass.trim() ? currentClass.trim().split(/\s+/) : [];
            if (prevTokens.length) {
                el.classList.remove(...prevTokens);
            }

            const nextTokens = finalClass.trim() ? finalClass.trim().split(/\s+/) : [];
            if (nextTokens.length) {
                el.classList.add(...nextTokens);
            }

            currentClass = finalClass;
        }
    });
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

function handleStyles(el: HTMLElement, props: ComponentProps) {
    let prevStyles: StyleObject = {};

    createEffect(() => {
        const styles = el.style;
        const compRaw = props.componentStyles;
        const extStyles = props.style;

        const compStyles = typeof compRaw === "function" ? compRaw() : compRaw;

        if (!compStyles && !extStyles) {
            if (Object.keys(prevStyles).length > 0) {
                el.removeAttribute("style");
                prevStyles = {};
            }
            return;
        }

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

function handleAttrs(el: Element, props: ComponentProps) {
    let prevKeys: string[] = [];

    createEffect(() => {
        const currentKeys: string[] = [];

        for (const key in props) {
            if (!key.startsWith("attr:")) continue;

            const name = key.slice(5);
            const val = (props as any)[key];
            currentKeys.push(name);

            if (val != null) {
                const strVal = String(val);
                if (el.getAttribute(name) !== strVal) {
                    el.setAttribute(name, strVal);
                }
            } else {
                el.removeAttribute(name);
            }
        }

        if (prevKeys.length > 0) {
            for (let i = 0; i < prevKeys.length; i++) {
                const oldName = prevKeys[i];
                if (!(`attr:${oldName}` in props)) {
                    el.removeAttribute(oldName);
                }
            }
        }
        prevKeys = currentKeys;
    });
}

function handleEvents(el: Element, props: ComponentProps) {
    const listeners: Array<[string, EventListener]> = [];

    for (const key in props) {
        if (baseEventsSet.has(key)) {
            const handler = (props as any)[key];
            if (typeof handler === 'function') {
                el.addEventListener(key, handler as EventListener);
                listeners.push([key, handler as EventListener]);
            }
        }
    }

    return () => {
        for (const [eventName, fn] of listeners) {
            el.removeEventListener(eventName, fn);
        }
    };
}

function baseComponent(el: Element, accessor: () => ComponentProps) {
    const props = accessor();

    handleClasses(el, props);
    handleStyles(el as HTMLElement, props);
    handleAttrs(el, props);

    const cleanupEvents = handleEvents(el, props);
    onCleanup(() => cleanupEvents());
}

export default baseComponent;