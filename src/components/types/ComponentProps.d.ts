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
    style?: JSX.CSSProperties,
    class?: string,
    [key: `data-${string}`]: any;
    anchor?: HTMLElement | string;
    onAction?: ComponentNavigationActions
}

export interface ComponentProps<T extends Record<string, any> = {}> extends ComponentBaseProps {
    componentStyles?: JSX.CSSProperties | (() => JSX.CSSProperties),
    componentClasses?: string | (() => string)
    ref?: ((ref: BaseComponentRef & T) => void) | (BaseComponentRef & T);
    refObject?: Omit<T, keyof BaseComponentRef>;
}

// Use instead of ComponentProps for components that wrap LayoutBase and supply
// componentClasses/componentStyles/refObject themselves — avoids the Omit pattern.
// When T is empty (no custom ref shape), ref receives the raw HTMLElement (BaseComponent
// calls props.ref(el) when no refObject is set). When T has fields, ref receives BaseComponentRef & T.
export type LayoutComponentProps<T extends Record<string, any> = {}> = ComponentBaseProps & {
    ref?: [keyof T] extends [never]
        ? ((ref: HTMLElement) => void) | HTMLElement
        : ((ref: BaseComponentRef & T) => void) | (BaseComponentRef & T);
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

declare module "@solidjs/web" {
    namespace JSX {
        interface IntrinsicElements {
            p: JSX.HTMLAttributes<HTMLParagraphElement> & { cohinline?: any };
        }
    }
}