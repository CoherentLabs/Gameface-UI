import { getOwner, onCleanup, useContext } from 'solid-js';
import { spatialNavigation } from 'coherent-gameface-interaction-manager';
import { waitForFrames } from '@components/utils/waitForFrames';
import { useNavigation } from '../Navigation/Navigation';
import type { NavigationRef } from '../Navigation/Navigation';
import type { ElementId, FlowApi, FlowData, FlowNav, FlowOptions, StateGroupApi } from './types';
import { createInternalStateGroup, OBSERVE } from './stateGroup';
import { addLiveFlow, FlowInstance, flushNavWaiters, isFlowRoot, parentFlow, registerOwner, registerRoot, removeLiveFlow, unregisterRoot } from './registry';
import { registerDocument, reportStateChange, unregisterDocument } from './devHooks';
import { scheduleModelSync } from './modelSync';
import { createNavigationWiring } from './navigation';
import { OverlayEntryContext } from './OverlayHost';
import { subscribePlatformEvents } from './platform';
import { subscribeScreenClosing } from './helpers';
import { registerDefinedActions } from './input';

export type * from './types';
export { createStateGroup } from './stateGroup';
export { stateOf } from './registry';
export { scheduleModelSync } from './modelSync';
export { OverlayHost, useOverlays } from './OverlayHost';
export {
    useInputAction, useInputKeys, useHold, defineInputActions, setInputBinding, resetInputBindings,
} from './input';
export type { InputAction, InputActionBindings, InputOptions, MouseBinding, InputKeys } from './input';
export {
    onScreenShow, onScreenHide, onInputDevice, onUIEvent, after, every,
    navigate, playSound, setLanguage, delay, once, debounce, throttle,
} from './helpers';
export type { FlowRegister, SoundName } from './helpers';
export { defineGameEvents, onGameEvent, BUILT_IN_GAME_EVENTS } from './gameEvents';
export type { GameEvent, GameEventDef, GameEventArgs, GameEventResult, GameEventFieldType, GameEventValue } from './gameEvents';
export { setPlatform, setStyleMode, setInputDevice, platform, inputDevice, styleMode } from './platform';
export type { Platform, InputDevice } from './platform';
export { Glyph, InputHint, registerGlyphs, glyphUrl } from './Glyph';

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
/**
 * Frames before the second navigation refresh after a state change. Components the change mounts mark their own
 * areas ROOT_MOUNT_FRAMES after their root mounts; collecting after that leaves their elements out of this document's.
 */
const REFRESH_FRAMES = ROOT_MOUNT_FRAMES + 1;

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
        overlays: data?.overlays,
        nav: contextNav,
        ownsNavigation: false,
        disposed: false,
        navWaiters: new Set(),
        showHandlers: new Set(),
        hideHandlers: new Set(),
        shown: false,
        hidden: false,
    };
    registerOwner(owner, flow);
    addLiveFlow(flow);
    subscribePlatformEvents();
    subscribeScreenClosing();

    flow.refreshNow = () => {
        if (!flow.disposed && flow.root) wiring.refresh();
    };
    // This document first, then the ones it sits in: a component's elements outside its own areas are in theirs, and
    // its focusable settings have to be applied before they collect.
    const refreshChain = () => {
        for (let f: FlowInstance | undefined = flow; f; f = parentFlow(f)) f.refreshNow?.();
    };
    // Two passes after a state change: at once, so removed elements leave navigation and new ones are focusable
    // straight away, and REFRESH_FRAMES later, once components the change mounted have marked their own areas.
    let microPending = false;
    let framePending = false;
    const refreshUp = () => {
        if (!microPending) {
            microPending = true;
            queueMicrotask(() => {
                microPending = false;
                refreshChain();
            });
        }
        if (!framePending) {
            framePending = true;
            waitForFrames(() => {
                framePending = false;
                refreshChain();
            }, REFRESH_FRAMES);
        }
    };

    for (const def of data?.states ?? []) {
        const group = createInternalStateGroup(def, options.states?.[def.name]);
        flow.groups.set(def.name, group);
        group[OBSERVE]((next, _prev, forced) => {
            // A state the editor forced isn't echoed back to it.
            if (!forced) reportStateChange(flow, def.name, next);
            refreshUp();
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
        flushNavWaiters(flow);
        scheduleModelSync();
        // Screen shows (§17.2): after the intro. There is no intro runtime yet, so right after the root mounts.
        if (!flow.shown) {
            flow.shown = true;
            for (const fn of [...flow.showHandlers]) {
                try {
                    fn();
                } catch (e) {
                    console.error('[Flow] onScreenShow handler failed', e);
                }
            }
        }
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
        // Inside Navigation's onMount: cleanups registered here run before Navigation removes its actions.
        registerDefinedActions(api);
        flushNavWaiters(flow);
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
        flow.navWaiters.clear();
        removeLiveFlow(flow);
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
