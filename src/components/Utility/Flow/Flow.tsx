import { getOwner, onCleanup, useContext } from 'solid-js';
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { waitForFrames } from '@components/utils/waitForFrames';
import { useNavigation } from '../Navigation/Navigation';
import type { NavigationRef } from '../Navigation/Navigation';
import type { ElementId, FlowApi, FlowData, FlowNav, FlowOptions, StateGroupApi } from './types';
import { createInternalStateGroup, OBSERVE } from './stateGroup';
import { FlowInstance, isFlowRoot, registerOwner, registerRoot, unregisterRoot } from './registry';
import { registerDocument, reportStateChange, unregisterDocument } from './devHooks';
import { scheduleModelSync } from './modelSync';
import { createNavigationWiring } from './navigation';
import { OverlayEntryContext } from './OverlayHost';

export type * from './types';
export { createStateGroup } from './stateGroup';
export { stateOf } from './registry';
export { scheduleModelSync } from './modelSync';
export { OverlayHost, useOverlays } from './OverlayHost';

const flowFiles = new WeakMap<object, string>();

/**
 * Identity at runtime; gives type checking to `<Name>.flow.ts`. In dev builds the editor plugin passes the
 * document's project-relative path as `file`, so Live states can address it; it is never written to the source.
 */
export function defineFlow<T extends FlowData>(data: T, file?: string): T {
    if (file) flowFiles.set(data, file);
    return data;
}

/** Frames to wait after the root ref before reading the DOM (GFUI's waitForFrames defaults to 3). */
const ROOT_MOUNT_FRAMES = 1;

const NAV_METHODS = [
    'addAction', 'removeAction', 'updateAction', 'executeAction', 'getScope', 'getAction', 'getActions',
    'pauseAction', 'resumeAction', 'pauseInput', 'resumeInput', 'isPaused',
    'registerArea', 'unregisterArea', 'focusFirst', 'focusLast', 'switchArea', 'clearFocus',
    'changeNavigationKeys', 'resetNavigationKeys', 'pauseNavigation', 'resumeNavigation', 'setEdgeHandler',
] as const;
// Fails to compile when Navigation gains a method that f.nav doesn't forward.
const navMethodsComplete: Exclude<keyof NavigationRef, typeof NAV_METHODS[number]> extends never ? true : never = true;
void navMethodsComplete;

/** `Tabs` → `tabs`, `No save file` → `no-save-file`, `hasSave` → `has-save` (the printer's modifier class names). */
export function toKebab(name: string) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function inertGroup(name: string): StateGroupApi {
    return {
        name,
        current: () => '',
        is: () => false,
        set: () => console.warn(`[Flow] No state group "${name}".`),
        onEnter: () => () => {},
        onChange: () => () => {},
    };
}

/**
 * Behaviour of a screen or component from its `<Name>.flow.ts`: states, navigation and overlays.
 * Call it once, synchronously, first in the component body. The flow is optional.
 */
export function useFlow(data?: FlowData, options: FlowOptions = {}): FlowApi {
    const owner = getOwner();
    // Components can't read the Navigation context after mount; a screen gets its API from <Navigation ref={f.nav}>.
    const contextNav = useNavigation();
    const inOverlay = !!useContext(OverlayEntryContext);

    const flow: FlowInstance = {
        file: data ? flowFiles.get(data) : undefined,
        groups: new Map(),
        navigation: data?.navigation,
        nav: contextNav,
        ownsNavigation: false,
        disposed: false,
    };
    registerOwner(owner, flow);

    let refreshPending = false;
    const scheduleRefresh = () => {
        if (refreshPending) return;
        refreshPending = true;
        queueMicrotask(() => {
            refreshPending = false;
            if (!flow.disposed && flow.root) wiring.refresh();
        });
    };

    for (const def of data?.states ?? []) {
        const group = createInternalStateGroup(def, options.states?.[def.name]);
        flow.groups.set(def.name, group);
        group[OBSERVE]((next, _prev, forced) => {
            // A state the editor forced isn't echoed back to it.
            if (!forced) reportStateChange(flow, def.name, next);
            scheduleRefresh();
        });
    }
    for (const name of Object.keys(options.states ?? {})) {
        if (!flow.groups.has(name)) console.warn(`[Flow] useFlow got a driver for unknown state group "${name}".`);
    }

    const el = (id: ElementId): HTMLElement | undefined => {
        const root = flow.root;
        if (!root) return undefined;
        if (root.getAttribute('data-gf-id') === id || root.getAttribute('data-gf-iid') === id) return root;

        const containers: Element[] = [root];
        if (flow.rootId) document.querySelectorAll(`[data-gf-owner="${flow.rootId}"]`).forEach((c) => containers.push(c));

        for (const container of containers) {
            for (const attr of ['data-gf-id', 'data-gf-iid']) {
                const found = container.querySelectorAll<HTMLElement>(`[${attr}="${id}"]`);
                for (let i = 0; i < found.length; i++) {
                    if (belongsHere(found[i], attr === 'data-gf-iid', container)) return found[i];
                }
            }
        }
        return undefined;
    };

    /** Elements inside a nested document (another useFlow root, or a portal another document owns) aren't ours. */
    const belongsHere = (node: HTMLElement, byInstanceId: boolean, container: Element) => {
        // An instance id belongs to the document that places the instance, so its own root is fine.
        for (let n = byInstanceId ? node.parentElement : node; n && n !== container; n = n.parentElement) {
            if (isFlowRoot(n)) return false;
            const owner = n.getAttribute('data-gf-owner');
            if (owner !== null && owner !== flow.rootId) return false;
        }
        return true;
    };

    const wiring = createNavigationWiring(flow, el);

    const mount = (node: HTMLElement) => {
        if (flow.disposed || flow.root !== node) return;
        flow.rootId = node.getAttribute('data-gf-id') ?? undefined;
        registerRoot(flow);
        registerDocument(flow);
        // An overlay's area is registered by its OverlayHost; only a screen on its own registers its screen area.
        wiring.wire({ screenArea: flow.ownsNavigation && !inOverlay });
        scheduleModelSync();
    };

    const root: FlowApi['root'] = (ref) => {
        const node = (ref as { element?: HTMLElement })?.element ?? (ref as HTMLElement);
        if (!node || node === flow.root) return;
        if (flow.root) {
            wiring.teardown();
            unregisterDocument(flow);
            unregisterRoot(flow);
        }
        flow.root = node;
        waitForFrames(() => mount(node), ROOT_MOUNT_FRAMES);
    };

    const nav = ((api: NavigationRef) => {
        flow.nav = api;
        flow.ownsNavigation = true;
    }) as FlowNav;
    for (const method of NAV_METHODS) {
        (nav as any)[method] = (...args: unknown[]) => {
            const api = flow.nav;
            if (!api) {
                console.warn(`[Flow] f.nav.${method}() was called before <Navigation ref={f.nav}> mounted.`);
                return undefined;
            }
            return (api[method] as (...a: unknown[]) => unknown)(...args);
        };
    }
    // Per-area first focus (§18): GFUI has none, so switching to an area with firstFocus focuses that element.
    nav.switchArea = (area, opts) => {
        const result = flow.nav?.switchArea(area, opts) ?? null;
        const firstFocus = wiring.areaByName(area)?.firstFocus;
        const target = firstFocus ? el(firstFocus) : undefined;
        if (target) {
            target.focus();
            return target;
        }
        return result;
    };
    // pauseInput pauses GFUI actions only; focus moves are paused with it. resumeInput resumes focus moves only
    // when pauseInput paused them, so navigation paused before (a tutorial step, say) stays paused.
    let pausedNavigation = false;
    nav.pauseInput = () => {
        flow.nav?.pauseInput();
        if (!spatialNavigation.paused) {
            flow.nav?.pauseNavigation();
            pausedNavigation = true;
        }
    };
    nav.resumeInput = () => {
        flow.nav?.resumeInput();
        if (pausedNavigation && spatialNavigation.paused) flow.nav?.resumeNavigation();
        pausedNavigation = false;
    };

    onCleanup(() => {
        flow.disposed = true;
        wiring.dispose();
        unregisterDocument(flow);
        unregisterRoot(flow);
    });

    return {
        root,
        classes(styles) {
            let result = '';
            for (const group of flow.groups.values()) {
                const cls = styles[`${toKebab(group.name)}--${toKebab(group.current())}`];
                if (cls) result += result ? ` ${cls}` : cls;
            }
            return result;
        },
        state(name) {
            const group = flow.groups.get(name);
            if (group) return group;
            console.warn(`[Flow] No state group "${name}".`);
            return inertGroup(name);
        },
        nav,
        el,
    };
}
