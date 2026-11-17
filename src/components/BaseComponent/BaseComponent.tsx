import { createEffect, onCleanup, untrack } from "solid-js";
import { ComponentProps, NavigationActionsConfig } from "@components/types/ComponentProps";
import { useNavigation } from "@components/Utility/Navigation/Navigation";
import eventBus from "@components/Utility/EventBus";
import { waitForFrames } from "@components/utils/waitForFrames";
import { DEFAULT_ACTION_NAMES } from "@components/Utility/Navigation/defaults";
import { DefaultActions } from "@components/Utility/Navigation/types";
import { resetStyleCache, setStyleProperty } from "./gameface-dom";

export type RefCallback<T extends Element = Element> = (el: T) => void;

const baseEventsSet = new Set([
    "abort", "animationend", "blur", "click", "dblclick", "durationchange", "ended", "finish",
    "focus", "focusin", "focusout", "gamepadconnected", "gamepaddisconnected", "keydown",
    "keypress", "keyup", "load", "mousedown", "mouseenter", "mouseleave", "mousemove",
    "mouseout", "mouseover", "mouseup", "popstate", "readystatechange", "resize", "scroll",
    "timeout", "touchend", "touchmove", "touchstart", "transitionend", "volumechange", "wheel",
]);

type ElementGetter = () => HTMLElement | undefined;

function handleClasses(getEl: ElementGetter, props: ComponentProps) {
    createEffect(
        () => {
            const rawBase = props.componentClasses;
            const base = typeof rawBase === "function" ? rawBase() : rawBase;
            const ext = props.class;
            return base ? (ext ? base + " " + ext : base) : (ext || "");
        },
        (finalClass) => {
            const el = getEl();
            if (el && el.className !== finalClass) el.className = finalClass;
        }
    );
}

type StyleObject = Record<string, string | number | null | undefined>;

// Delegates to gameface-dom.ts's setStyleProperty rather than writing
// el.style directly - props.style is typed to accept NumericCSSProperty
// ({ value, unit }) and TransformStyle, not just plain CSS strings/numbers,
// and only setStyleProperty (with its per-element CSSTOM cache) understands
// those shapes. Writing them through el.style/CSSStyleDeclaration directly
// would stringify them to "[object Object]".
function reconcileStyles(el: HTMLElement, next: any, prev: any) {
    for (const key in prev) {
        if (next[key] == null) setStyleProperty(el, key, null);
    }

    for (const key in next) {
        const value = next[key];
        // NumericCSSProperty/TransformStyle can carry an un-invoked accessor
        // (`value: Accessor<number>`), so the descriptor object can keep the
        // same identity across effect runs even though the accessor's value
        // changed underneath it - an identity check alone would skip calling
        // setStyleProperty and the new value would never reach the DOM.
        // Always reprocess structured values; gameface-dom.ts's own
        // per-property cache already skips the actual native write when the
        // resolved value hasn't changed, so this only costs a comparison.
        const isStructured = value !== null && typeof value === "object";
        if (isStructured || prev[key] !== value) setStyleProperty(el, key, value);
    }
}

function handleStyles(getEl: ElementGetter, props: ComponentProps) {
    let prevStyles: StyleObject = {};

    createEffect(
        // Compute (tracked): read the style props. Evaluating the props here is
        // what subscribes to values inside them, e.g. `{ width: { value: w() } }`.
        () => {
            const compRaw = props.componentStyles;
            return {
                compStyles: typeof compRaw === "function" ? compRaw() : compRaw,
                extStyles: props.style,
            };
        },
        // Apply (untracked): write them to the element.
        ({ compStyles, extStyles }) => {
            const el = getEl();
            if (!el) return;
            const styles = el.style;

            if (!compStyles && !extStyles) {
                if (Object.keys(prevStyles).length > 0) {
                    resetStyleCache(el);
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
                    resetStyleCache(el);
                    styles.cssText = finalString;
                }

                prevStyles = {};
                return;
            }

            const nextStyles: StyleObject = {
                ...(compStyles as StyleObject || {}),
                ...(extStyles as StyleObject || {})
            };

            reconcileStyles(el, nextStyles, prevStyles);

            prevStyles = nextStyles;
        }
    );
}

// `attr:*` props on Gameface UI components (e.g. `<Block attr:id="x" />`) are
// forwarded to the element as attributes. On components the compiler still
// passes `attr:*` through as an ordinary prop name in Solid 2; only on native
// elements is the `attr:` namespace a compile error.
function handleAttrs(getEl: ElementGetter, props: ComponentProps) {
    let prevKeys: string[] = [];

    createEffect(
        () => {
            const entries: Array<[string, unknown]> = [];
            for (const key in props) {
                if (!key.startsWith("attr:")) continue;
                entries.push([key.slice(5), (props as any)[key]]);
            }
            return entries;
        },
        (entries) => {
            const el = getEl();
            if (!el) return;

            const currentKeys: string[] = [];
            for (const [name, val] of entries) {
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

            for (let i = 0; i < prevKeys.length; i++) {
                const oldName = prevKeys[i];
                if (!currentKeys.includes(oldName)) {
                    el.removeAttribute(oldName);
                }
            }
            prevKeys = currentKeys;
        }
    );
}

// Event props are read once (as in 1.x, where they were read once in the
// directive body), so this is an intentional untracked read.
function collectEvents(props: ComponentProps): Array<[string, EventListener]> {
    return untrack(() => {
        const listeners: Array<[string, EventListener]> = [];
        for (const key in props) {
            if (baseEventsSet.has(key)) {
                const handler = (props as any)[key];
                if (typeof handler === 'function') listeners.push([key, handler as EventListener]);
            }
        }
        return listeners;
    });
}

export function navigationActions(config: NavigationActionsConfig | undefined): RefCallback<HTMLElement> {
    // Setup (owned): context, subscriptions and their cleanup.
    // The config is read once, as in 1.x.
    const nav = config ? useNavigation() : undefined;
    if (!config || !nav) return () => {};

    const { anchor, ...actionHandlers } = config;

    let el: HTMLElement | undefined;
    let anchorElement: HTMLElement | null = null;
    if (anchor) {
        if (typeof anchor === 'string') {
            waitForFrames(() => anchorElement = document.querySelector(anchor));
        } else if (anchor instanceof HTMLElement) {
            anchorElement = anchor;
        }
    }

    const isFocused = () => {
        if (!el) return false;
        const active = document.activeElement;
        return (
            active === el ||
            (anchorElement && active === anchorElement) ||
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
    });

    // Apply (unowned): capture the element.
    return (nextEl) => {
        el = nextEl;
        el.setAttribute('tabindex', '0');
    };
}

function baseComponent(props: ComponentProps): RefCallback {
    // Setup (owned): effects and cleanup.
    let el: HTMLElement | undefined;
    const getEl = () => el;

    handleClasses(getEl, props);
    handleStyles(getEl, props);
    handleAttrs(getEl, props);

    const listeners = collectEvents(props);
    onCleanup(() => {
        if (!el) return;
        for (const [eventName, fn] of listeners) {
            el.removeEventListener(eventName, fn);
        }
    });

    // Apply (unowned): capture the element and attach the event listeners.
    return (nextEl) => {
        el = nextEl as HTMLElement;
        for (const [eventName, fn] of listeners) {
            el.addEventListener(eventName, fn);
        }
    };
}

export default baseComponent;
