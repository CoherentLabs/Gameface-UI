import type { FlowInstance } from './registry';
import type { OverlayHostInternal } from './OverlayHost';
import { FORCE } from './stateGroup';

declare const __GF_DEV_HOOKS__: boolean | undefined;

/**
 * The editor hooks exist in the Vite dev server, in `vite build --mode development`, and in builds made with
 * `build.devHooks: true` (the editor plugin defines `__GF_DEV_HOOKS__`). A normal production build compiles them out.
 */
export const DEV_HOOKS: boolean = import.meta.env.DEV || (typeof __GF_DEV_HOOKS__ !== 'undefined' && !!__GF_DEV_HOOKS__);

export interface GfFlowsHook {
    states: {
        /** Forces `state` on every live document of `file`. Last change wins. */
        set(file: string, group: string, state: string): void;
        get(file: string, group: string): string | undefined;
    };
    overlays: {
        open(name: string): void;
        /** Closes the overlay opened last. */
        close(): void;
    };
    [extra: string]: unknown;
}

declare global {
    interface Window {
        __gfFlows?: GfFlowsHook;
        /** Installed by the editor over CDP (`Runtime.addBinding`) while Live states is on. */
        __gfStateChanged?: (file: string, group: string, state: string) => void;
    }
}

const documents = new Map<string, Set<FlowInstance>>();
const overlayHosts: OverlayHostInternal[] = [];

/** Documents are keyed by their file; without the editor plugin, by their root's data-gf-id. */
export function documentKey(flow: FlowInstance) {
    return flow.file ?? flow.rootId;
}

export function registerDocument(flow: FlowInstance) {
    if (!DEV_HOOKS) return;
    const key = documentKey(flow);
    if (!key) return;
    install();
    let set = documents.get(key);
    if (!set) documents.set(key, set = new Set());
    set.add(flow);
}

export function unregisterDocument(flow: FlowInstance) {
    if (!DEV_HOOKS) return;
    const key = documentKey(flow);
    if (!key) return;
    const set = documents.get(key);
    set?.delete(flow);
    if (set && set.size === 0) documents.delete(key);
}

export function reportStateChange(flow: FlowInstance, group: string, state: string) {
    if (!DEV_HOOKS) return;
    const key = documentKey(flow);
    if (!key || typeof window.__gfStateChanged !== 'function') return;
    try {
        window.__gfStateChanged(key, group, state);
    } catch (e) {
        console.warn('[Flow] __gfStateChanged failed', e);
    }
}

export function registerOverlayHost(host: OverlayHostInternal) {
    if (!DEV_HOOKS) return () => {};
    install();
    overlayHosts.push(host);
    return () => {
        const i = overlayHosts.indexOf(host);
        if (i !== -1) overlayHosts.splice(i, 1);
    };
}

function install() {
    if (typeof window === 'undefined' || (window.__gfFlows as { __flowRuntime?: boolean } | undefined)?.__flowRuntime) return;

    const hook: GfFlowsHook & { __flowRuntime: true } = {
        ...(window.__gfFlows ?? {}),
        __flowRuntime: true,
        states: {
            set(file, group, state) {
                const docs = documents.get(file);
                if (!docs?.size) return console.warn(`[Flow] No live document "${file}".`);
                for (const flow of docs) {
                    const g = flow.groups.get(group);
                    if (!g) console.warn(`[Flow] "${file}" has no state group "${group}".`);
                    else if (!g[FORCE](state)) console.warn(`[Flow] State group "${group}" has no state "${state}".`);
                }
            },
            get(file, group) {
                for (const flow of documents.get(file) ?? []) {
                    const g = flow.groups.get(group);
                    if (g) return g.current();
                }
            },
        },
        overlays: {
            open(name) {
                for (let i = overlayHosts.length - 1; i >= 0; i--) {
                    if (overlayHosts[i].has(name)) {
                        overlayHosts[i].open(name);
                        return;
                    }
                }
                console.warn(`[Flow] No OverlayHost can open "${name}".`);
            },
            close() {
                for (let i = overlayHosts.length - 1; i >= 0; i--) {
                    if (overlayHosts[i].closeTop()) return;
                }
            },
        },
    };

    window.__gfFlows = hook;
}
