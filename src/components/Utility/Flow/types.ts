import type { Accessor, Component } from 'solid-js';
import type { NavigationRef } from '../Navigation/Navigation';

/** `data-gf-id` of an element in the same document (or `data-gf-iid` of an instance). */
export type ElementId = string;

/** A model-path rule. Kept for reading older flow files; conditions reach the runtime as drivers (`FlowOptions.states`). */
export type Rule = {
    path: string;
    op: 'isTrue' | 'isFalse' | 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';
    value?: string | number | boolean;
};

export interface StateDef {
    name: string;
    /** "Follows a condition". Such a state is never a `set` target; the group's driver decides when it is on. */
    showWhen?: Rule | { expr: string };
    /** The component's interactions don't run while this state is on (the printer guards the handlers). */
    ignoreInput?: boolean;
    transition?: { duration: number; easing: string } | { timeline: string };
}

export interface StateGroup {
    name: string;
    states: StateDef[];
    initial: string;
}

export interface FlowNavigationScreen {
    /** Element focused when the screen shows. Without it the first focusable element of the screen is focused. */
    firstFocus?: ElementId;
    /** `false` stops focus from looping at the screen's edges. Default true. */
    wrap?: boolean;
    /** Focus returns to the opener when an overlay this screen opened closes. Default true. */
    returnFocusOnClose?: boolean;
}

export interface FlowNavigationArea {
    name: string;
    firstFocus?: ElementId;
    wrap?: boolean;
}

export interface FlowNavigation {
    screen?: FlowNavigationScreen;
    /** Per element. `focusable: true` adds it to navigation; `false` removes an element that would be focusable by default. */
    elements?: Record<ElementId, { focusable?: boolean }>;
    /** Keyed by the id of the element that holds the area. */
    areas?: Record<ElementId, FlowNavigationArea>;
}

export type OverlayLoader = () => Promise<{ default: Component<any> }>;

export interface FlowData {
    states?: StateGroup[];
    navigation?: FlowNavigation;
    overlays?: Record<string, OverlayLoader>;
}

export interface FlowOptions {
    /** The component's props (state props, animation props). */
    props?: Record<string, unknown>;
    /** Per group: a function returning the state to show, or undefined to fall back to the last state set (or the initial one). */
    states?: Record<string, () => string | undefined>;
}

export interface StateGroupApi {
    readonly name: string;
    current: Accessor<string>;
    is(...states: string[]): boolean;
    /** Switches to a state. Refused with a warning for a state that follows a condition. */
    set(state: string): void;
    /** Runs `fn` every time the group changes to `state`. Returns a function that removes it. */
    onEnter(state: string, fn: () => void): () => void;
    onChange(fn: (next: string, prev: string) => void): () => void;
}

export type FlowNav = ((api: NavigationRef) => void) & NavigationRef;

export interface FlowApi {
    /** Ref for the root element. Accepts a DOM element or the `{ element, ... }` object GFUI components pass to `ref`. */
    root: (ref: HTMLElement | { element: HTMLElement }) => void;
    /** Space-separated, CSS-module-mapped modifier classes (`<group>--<state>`) of the active states. Reactive. */
    classes(styles: Record<string, string>): string;
    state(group: string): StateGroupApi;
    /** Callable ref for `<Navigation ref={f.nav}>`; afterwards forwards to the Navigation API. */
    nav: FlowNav;
    /** Finds an element of this document by `data-gf-id` (or an instance by `data-gf-iid`), including owned portals. */
    el(id: ElementId): HTMLElement | undefined;
}

export interface OverlayOptions {
    position?: 'center';
    dim?: boolean;
    closeOnBack?: boolean;
    params?: Record<string, unknown>;
}

export interface OverlayHostApi {
    /** Opens an overlay; resolves with the value passed to `close` (undefined when closed with Back). */
    open(name: string, options?: OverlayOptions): Promise<unknown>;
    /** Closes the overlay the calling component is inside. */
    close(value?: unknown): void;
    isOpen(name: string): boolean;
}
