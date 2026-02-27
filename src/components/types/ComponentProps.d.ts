import { JSX, ParentProps } from "solid-js";
import Events from "./BaseComponent";
import baseComponent, { navigationActions } from "@components/BaseComponent/BaseComponent";
import { ActionName } from "@components/Utility/Navigation/types";

type ExcludedEvents =
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
    class?: string,
    [key: `attr:${string}`]: any;
    anchor?: HTMLElement | string;
    onAction?: ComponentNavigationActions
}

export interface ComponentProps<T extends Record<string, any> = {}> extends ComponentBaseProps {
    componentStyles?: JSX.CSSProperties | (() => JSX.CSSProperties),
    componentClasses?: string | (() => string)
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

declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            p: JSX.HTMLAttributes<HTMLParagraphElement> & { cohinline?: any };
        }

        interface DirectiveFunctions {
            baseComponent: typeof baseComponent;
            navigationActions: typeof navigationActions;
        }
    }
}