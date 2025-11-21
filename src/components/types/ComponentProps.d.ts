import { JSX, ParentProps } from "solid-js";
import Events from "./BaseComponent";
import { ActionName } from "@components/Navigation/Navigation/types";

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

type NavigationActionHandler = (scope?: string) => void; 
export type NavigationActionsConfig = {
    anchor?: HTMLElement | string;
} & {
    [K in ActionName]?: NavigationActionHandler | HTMLElement | string | undefined;
}

declare module "solid-js" {
    namespace JSX {
        interface IntrinsicElements {
            p: JSX.HTMLAttributes<HTMLParagraphElement> & { cohinline?: any };
        }
        
        interface Directives {
            forwardEvents: ComponentProps<any>;
            forwardAttrs:  ComponentProps<any>;
            navigationActions: NavigationActionsConfig;
        }
    }
}