import { Component, createContext, createSignal, For, getOwner, onCleanup, Show, useContext } from 'solid-js';
import { Dynamic, Portal } from 'solid-js/web';
import { waitForFrames } from '@components/utils/waitForFrames';
import eventBus from '@components/Utility/EventBus';
import { useNavigation } from '../Navigation/Navigation';
import type { NavigationRef } from '../Navigation/Navigation';
import type { FlowData, OverlayHostApi, OverlayOptions } from './types';
import { findFlow, flowOfElement, parentFlow } from './registry';
import { registerOverlayHost } from './devHooks';
import { scheduleModelSync } from './modelSync';
import { focusablesIn, insideArea, isInside } from './navigation';
import styles from './OverlayHost.module.scss';

/** Internal API of a mounted OverlayHost (dev hooks and useOverlays). */
export interface OverlayHostInternal {
    open(name: string, options?: OverlayOptions): Promise<unknown>;
    isOpen(name: string): boolean;
    has(name: string): boolean;
    /** Closes the overlay opened last; false when none is open. */
    closeTop(): boolean;
}

interface OverlayEntry {
    key: number;
    name: string;
    areaName: string;
    options: OverlayOptions;
    component: Component<any>;
    opener: Element | null;
    prevScope?: string;
    areaRegistered: boolean;
    closing: boolean;
    resolve(value: unknown): void;
}

/** The overlay a component is rendered inside; `useOverlays().close()` closes it. */
export const OverlayEntryContext = createContext<{ name: string; close(value?: unknown): void }>();
const OverlayHostContext = createContext<OverlayHostInternal>();

/** Frames before the overlay's area is collected: one for the content to attach, one for its own useFlow to register. */
const OVERLAY_WIRE_FRAMES = 2;
const FOCUS_AFTER_REGISTER_FRAMES = 4;

function isAttached(node: Element) {
    for (let n: Element | null = node; n; n = n.parentElement) {
        if (n === document.documentElement) return true;
    }
    return false;
}

/** Placed once by the screen skeleton, last inside <Navigation>; holds the open overlays. */
export const OverlayHost: Component<{ overlays?: FlowData['overlays'] }> = (props) => {
    // Matched by the overlays object: in production builds the screen and the components it places can share
    // a Solid owner, so the nearest flow isn't always the screen's.
    const hostOwner = getOwner();
    const flow = findFlow(hostOwner, (f) => !!props.overlays && f.overlays === props.overlays) ?? findFlow(hostOwner);
    const contextNav = useNavigation();
    const nav = (): NavigationRef | undefined => contextNav ?? flow?.nav;

    const [stack, setStack] = createSignal<OverlayEntry[]>([]);
    const loaded = new Map<string, Promise<Component<any>>>();
    let nextKey = 0;
    let disposed = false;

    const load = (name: string) => {
        let pending = loaded.get(name);
        if (!pending) {
            pending = props.overlays![name]().then((m) => m.default);
            pending.catch(() => loaded.delete(name));
            loaded.set(name, pending);
        }
        return pending;
    };

    const open = async (name: string, options: OverlayOptions = {}): Promise<unknown> => {
        if (!props.overlays?.[name]) {
            console.warn(`[Flow] OverlayHost has no overlay "${name}".`);
            return undefined;
        }
        const opener = document.activeElement;
        const prevScope = nav()?.getScope();
        const component = await load(name);
        if (disposed) return undefined;

        return new Promise((resolve) => {
            const key = nextKey++;
            const taken = stack().some((e) => e.areaName === `overlay:${name}`);
            setStack((s) => [...s, {
                key, name, options, component, opener, prevScope, resolve,
                areaName: taken ? `overlay:${name}#${key}` : `overlay:${name}`,
                areaRegistered: false,
                closing: false,
            }]);
        });
    };

    const close = (entry: OverlayEntry, value?: unknown) => {
        if (entry.closing) return;
        entry.closing = true;

        try {
            const api = nav();
            if (api && entry.areaRegistered) api.unregisterArea(entry.areaName);

            const rest = stack().filter((e) => e !== entry);
            setStack(rest);

            const top = rest[rest.length - 1];
            if (api) {
                if (top?.areaRegistered) api.switchArea(top.areaName);
                else if (entry.prevScope) api.switchArea(entry.prevScope);
            }
            const returnFocus = flow?.navigation?.screen?.returnFocusOnClose ?? true;
            if (returnFocus && entry.opener instanceof HTMLElement && isAttached(entry.opener)) entry.opener.focus();
        } finally {
            entry.resolve(value);
        }
    };

    /** After the overlay mounts: its own area, then its first focus (§18). */
    const wire = (entry: OverlayEntry, container: HTMLElement) => {
        scheduleModelSync();
        waitForFrames(() => {
            if (entry.closing || disposed) return;
            const api = nav();
            if (!api) return;

            const content = container.querySelector('[data-gf-overlay-content]')?.firstElementChild;
            // Only the overlay's own flow. Without one, flowOfElement reaches the portal, which the opener owns.
            const found = content ? flowOfElement(content) : undefined;
            const overlayFlow = found?.root && isInside(found.root, container) ? found : undefined;
            const firstFocusId = overlayFlow?.navigation?.screen?.firstFocus;
            const firstFocus = firstFocusId ? container.querySelector<HTMLElement>(`[data-gf-id="${firstFocusId}"]`) : null;

            // Areas of the overlay's own flow are registered by its useFlow; leave their elements out.
            const elements = focusablesIn(container, (n) => insideArea(n, container));
            if (elements.length === 0) return;
            api.registerArea(entry.areaName, elements, !firstFocus);
            entry.areaRegistered = true;
            if (overlayFlow?.navigation?.screen?.wrap === false) api.setEdgeHandler(entry.areaName, () => false);
            if (firstFocus) waitForFrames(() => { if (!entry.closing) firstFocus.focus(); }, FOCUS_AFTER_REGISTER_FRAMES);
        }, OVERLAY_WIRE_FRAMES);
    };

    const onBack = () => {
        const top = stack()[stack().length - 1];
        if (top?.options.closeOnBack) close(top, undefined);
    };
    eventBus.on('back', onBack);

    const internal: OverlayHostInternal = {
        open,
        isOpen: (name) => stack().some((e) => e.name === name && !e.closing),
        has: (name) => !!props.overlays?.[name],
        closeTop() {
            const top = stack()[stack().length - 1];
            if (!top) return false;
            close(top, undefined);
            return true;
        },
    };

    if (flow) flow.overlayHost = internal;
    const unregisterDev = registerOverlayHost(internal);

    onCleanup(() => {
        disposed = true;
        eventBus.off('back', onBack);
        unregisterDev();
        if (flow?.overlayHost === internal) flow.overlayHost = undefined;
        const api = nav();
        for (const entry of stack()) {
            entry.closing = true;
            if (api && entry.areaRegistered) api.unregisterArea(entry.areaName);
            entry.resolve(undefined);
        }
    });

    return (
        <OverlayHostContext.Provider value={internal}>
            <For each={stack()}>
                {(entry) => (
                    <Portal>
                        <div
                            class={`${styles.overlay} ${entry.options.position === 'center' ? styles.center : ''}`}
                            attr:data-gf-owner={flow?.rootId}
                            attr:data-gf-overlay={entry.name}
                            ref={(el) => wire(entry, el)}
                        >
                            <Show when={entry.options.dim}>
                                <div class={styles.dim} />
                            </Show>
                            {/* Positioned, so it paints above the dim layer. */}
                            <div class={styles.content} attr:data-gf-overlay-content="">
                                <OverlayEntryContext.Provider value={{ name: entry.name, close: (value) => close(entry, value) }}>
                                    <Dynamic component={entry.component} {...(entry.options.params ?? {})} />
                                </OverlayEntryContext.Provider>
                            </div>
                        </div>
                    </Portal>
                )}
            </For>
        </OverlayHostContext.Provider>
    );
};

/**
 * Overlays from inside a component body (call it synchronously, like useFlow). `open` uses the OverlayHost of the
 * nearest useFlow that has one, otherwise the host from context; `close` closes the overlay this component is inside.
 */
export function useOverlays(): OverlayHostApi {
    const owner = getOwner();
    const entry = useContext(OverlayEntryContext);
    const contextHost = useContext(OverlayHostContext);
    // The caller's own flow: useFlow runs first in the same component body, so it is the last one registered.
    const self = findFlow(owner);
    const host = () => {
        // Up the documents the caller sits in, by the DOM: Solid owners can be shared in production builds.
        for (let f = self; f; f = parentFlow(f)) {
            if (f.overlayHost && !f.disposed) return f.overlayHost;
        }
        return findFlow(owner, (f) => !!f.overlayHost)?.overlayHost ?? contextHost;
    };

    return {
        open(name, options) {
            const h = host();
            if (!h) {
                console.warn(`[Flow] No OverlayHost to open "${name}". Add <OverlayHost overlays={flow.overlays} /> to the screen.`);
                return Promise.resolve(undefined);
            }
            return h.open(name, options);
        },
        close(value) {
            if (!entry) return console.warn('[Flow] overlays.close() was called outside an overlay.');
            entry.close(value);
        },
        isOpen(name) {
            return host()?.isOpen(name) ?? false;
        },
    };
}
