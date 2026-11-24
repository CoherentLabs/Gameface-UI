import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { waitForFrames } from '@components/utils/waitForFrames';
import type { FlowInstance } from './registry';
import type { ElementId, FlowNavigationArea } from './types';

/** Set on the element that holds a flow navigation area, so the screen's own area leaves its elements out. */
export const AREA_ATTR = 'data-gf-nav-area';

/**
 * Frames to wait after registerArea before focusing: GFUI's registerArea itself waits 3 frames when spatial
 * navigation isn't initialised yet (1 otherwise), so one more frame is always after it.
 */
const FOCUS_AFTER_REGISTER_FRAMES = 4;

export function screenAreaName(flow: FlowInstance) {
    return `screen:${flow.rootId ?? flow.file ?? 'root'}`;
}

/** Elements that take part in spatial navigation inside `container`: tabindex set and not -1. */
export function focusablesIn(container: Element, exclude?: (el: HTMLElement) => boolean): HTMLElement[] {
    const result: HTMLElement[] = [];
    if (isFocusable(container) && !exclude?.(container as HTMLElement)) result.push(container as HTMLElement);
    container.querySelectorAll('[tabindex]').forEach((el) => {
        if (isFocusable(el) && !exclude?.(el as HTMLElement)) result.push(el as HTMLElement);
    });
    return result;
}

function isFocusable(el: Element) {
    const tabindex = el.getAttribute('tabindex');
    return tabindex !== null && tabindex !== '-1';
}

function sameElements(a: HTMLElement[], b: HTMLElement[]) {
    return a.length === b.length && a.every((node, i) => node === b[i]);
}

export function insideArea(el: HTMLElement, root: Element) {
    for (let node: HTMLElement | null = el; node && node !== root; node = node.parentElement) {
        if (node.hasAttribute(AREA_ATTR)) return true;
    }
    return false;
}

export interface NavigationWiring {
    /** Registers the flow's areas, then (for a screen) its own area and first focus. */
    wire(options: { screenArea: boolean }): void;
    /** Re-collects the elements of every area (elements, and area containers, a state change added or removed). */
    refresh(): void;
    areaByName(name: string): FlowNavigationArea | undefined;
    /** Unregisters everything; `wire` can run again afterwards (the root element changed). */
    teardown(): void;
    /** Unregisters everything for good (the document unmounted). */
    dispose(): void;
}

/** §18: focusable elements, areas, first focus and wrap, from the flow's `navigation`. */
export function createNavigationWiring(flow: FlowInstance, el: (id: ElementId) => HTMLElement | undefined): NavigationWiring {
    /** Every area of the flow, in registration order: the flow's areas first, the screen area last. */
    const registered = new Map<string, { collect: () => HTMLElement[]; wrap?: boolean }>();
    /** Areas registered with Navigation, with their elements. An area with no elements waits for a refresh that finds some. */
    const active = new Map<string, HTMLElement[]>();
    const marked = new Set<HTMLElement>();
    let disposed = false;
    /** Bumped by teardown, so frame callbacks from an earlier wiring do nothing. */
    let generation = 0;

    const nav = () => flow.nav;
    const data = () => flow.navigation ?? {};

    const isExcluded = (node: HTMLElement) => {
        const id = node.getAttribute('data-gf-id') ?? node.getAttribute('data-gf-iid');
        return !!id && data().elements?.[id]?.focusable === false;
    };

    const applyFocusable = () => {
        for (const [id, cfg] of Object.entries(data().elements ?? {})) {
            const node = el(id);
            if (!node) continue;
            if (cfg.focusable === true && !isFocusable(node)) node.setAttribute('tabindex', '0');
            if (cfg.focusable === false) node.removeAttribute('tabindex');
        }
    };

    /** Registers an area that has elements. The wrap handler is set on its first registration only. */
    const activate = (name: string, elements: HTMLElement[], focused: boolean) => {
        const api = nav();
        if (!api || elements.length === 0) return;
        api.registerArea(name, elements, focused);
        active.set(name, elements);
        if (registered.get(name)?.wrap === false) api.setEdgeHandler(name, () => false);
    };

    const add = (name: string, collect: () => HTMLElement[], focused: boolean, wrap: boolean | undefined) => {
        registered.set(name, { collect, wrap });
        activate(name, collect(), focused);
    };

    /** The container is looked up on every collect, so one that a state mounts or re-creates is picked up. */
    const collectArea = (containerId: ElementId, area: FlowNavigationArea) => () => {
        const container = el(containerId);
        if (!container) return [];
        if (!container.hasAttribute(AREA_ATTR)) {
            container.setAttribute(AREA_ATTR, area.name);
            marked.add(container);
        }
        return focusablesIn(container, isExcluded);
    };

    const registerScreenArea = (wiredIn: number) => {
        const root = flow.root;
        if (!root || disposed || wiredIn !== generation) return;
        const screen = data().screen ?? {};
        const firstFocus = screen.firstFocus ? el(screen.firstFocus) : undefined;
        add(screenAreaName(flow), () => focusablesIn(root, (n) => isExcluded(n) || insideArea(n, root)), !firstFocus, screen.wrap);
        if (firstFocus) {
            waitForFrames(() => { if (!disposed && wiredIn === generation) firstFocus.focus(); }, FOCUS_AFTER_REGISTER_FRAMES);
        }
    };

    const teardown = () => {
        generation++;
        const api = nav();
        // unregisterArea also drops the area's edge handler, which is right here: this wiring goes away.
        if (api) for (const name of active.keys()) api.unregisterArea(name);
        active.clear();
        registered.clear();
        for (const node of marked) node.removeAttribute(AREA_ATTR);
        marked.clear();
    };

    return {
        wire({ screenArea }) {
            if (disposed) return;
            if (!nav()) {
                if (flow.navigation) console.warn('[Flow] The flow has navigation but there is no <Navigation> around it.');
                return;
            }
            applyFocusable();
            for (const [containerId, area] of Object.entries(data().areas ?? {})) {
                add(area.name, collectArea(containerId, area), false, area.wrap);
            }
            // One frame later, so areas of nested components are marked before the screen collects its own elements.
            const wiredIn = generation;
            if (screenArea) waitForFrames(() => registerScreenArea(wiredIn), 1);
        },
        refresh() {
            const api = nav();
            if (!api || disposed) return;
            applyFocusable();
            for (const [name, { collect }] of registered) {
                // Collect first: the interaction manager's remove() strips tabindex from every element of the area.
                const elements = collect();
                const previous = active.get(name);
                if (previous && sameElements(previous, elements)) continue;
                if (!previous) {
                    activate(name, elements, false);
                    continue;
                }
                // Straight to the interaction manager: Navigation's unregisterArea would also drop the area's
                // edge handler, including one the screen's own code set.
                spatialNavigation.remove(name);
                active.delete(name);
                // registerArea re-adds them a frame later; until then they'd be unfocusable and could drop focus.
                for (const node of elements) node.setAttribute('tabindex', '1');
                if (elements.length === 0) continue;
                api.registerArea(name, elements, false);
                active.set(name, elements);
            }
        },
        areaByName(name) {
            return Object.values(data().areas ?? {}).find((a) => a.name === name);
        },
        teardown,
        dispose() {
            teardown();
            disposed = true;
        },
    };
}
