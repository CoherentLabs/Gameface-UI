import { ParentProps } from "solid-js";
import { JSX } from "@solidjs/web";
import Events from "./BaseComponent";
import { ActionName } from "@components/Utility/Navigation/types";

export type ExcludedEvents =
    | "abort"
    | "animationend"
    | "durationchange"
    | "ended"
    | "finish"
    | "gamepadconnected"
    | "gamepaddisconnected"
    | "readystatechange"
    | "timeout"
    | "transitionend"
    | "volumechange";

export type refElementType = HTMLParagraphElement | HTMLDivElement | HTMLButtonElement | undefined;

export interface BaseComponentRef {
    element: refElementType;
}

export interface ComponentBaseProps extends ParentProps, Omit<Events, ExcludedEvents> {
    style?: JSX.CSSProperties
    /** String, object (`{ name: cond }`) or array, like Solid's native `class`. */
    class?: JSX.ClassValue,
    [key: `attr:${string}`]: any;
    anchor?: HTMLElement | string;
    onAction?: ComponentNavigationActions
}

export interface ComponentProps<T extends Record<string, any> = {}> extends ComponentBaseProps {
    ref?: unknown | ((ref: BaseComponentRef & T) => void);
    refObject?: T;
}

export interface TokenComponentProps {
    parentChildren: JSX.Element,
}

type NavigationActionHandler = (scope: string, args: any) => void;

// Full config for the navigationActions directive (includes anchor)
export type NavigationActionsConfig = {
    anchor?: HTMLElement | string;
} & {
    [K in ActionName]?: NavigationActionHandler | HTMLElement | string | undefined;
}

// Component prop type (excludes anchor - use the top-level anchor prop instead)
export type ComponentNavigationActions = Omit<NavigationActionsConfig, 'anchor'>;

// Solid 2: the JSX namespace lives in @solidjs/web. The 1.x `DirectiveFunctions`
// augmentation is gone - `use:` directives are now `ref={baseComponent(props)}`
// / `ref={navigationActions(config)}` factories (see BaseComponent.tsx).
declare module "@solidjs/web" {
    namespace JSX {
        interface IntrinsicElements {
            p: JSX.HTMLAttributes<HTMLParagraphElement> & { cohinline?: any };
        }
    }
}