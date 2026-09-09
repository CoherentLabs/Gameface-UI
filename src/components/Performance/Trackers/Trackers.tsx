import { Accessor, For, ParentComponent, ParentProps, createContext, createEffect, onCleanup, onMount, useContext } from 'solid-js';
import { ComponentProps } from '@components/types/ComponentProps';
import { createTokenComponent, useTokens } from '@components/utils/tokenComponents';
import baseComponent from "@components/BaseComponent/BaseComponent";
import styles from './Trackers.module.scss';
import { GAMEFACE_VERSION, verIsAtLeast } from '@components/utils/gamefaceVersion';

function hasEngine(): boolean {
    return typeof window.engine !== 'undefined' && typeof window.engine.on === 'function';
}

if (!hasEngine() && !verIsAtLeast(3, 1, 2) && import.meta.env.DEV) {
    // If you are using updateTrackers instead of engine events, this warning can be ignored.
    console.warn(`[Gameface UI - Trackers] Import cohtml.js to ensure trackers component events work properly with the current Gameface version - ${GAMEFACE_VERSION} if you are using engine events for communication. If you are only using updateTrackers, this warning can be ignored.`);
}
declare global {
    interface Window {
        engine?: {
            isAttached?: boolean;
            trigger: (name: string, data?: unknown) => void;
            on: (name: string, callback: (...args: any[]) => void) => void;
            off: (name: string, callback: (...args: any[]) => void) => void;
        };
    }
}

interface TrackerItemTokenProps extends ParentProps, ComponentProps {
    id: string;
    /**
     * Uniform scale factor, composed into the same transform Trackers already
     * manages for this element (alongside its live x/y position). Pass a plain
     * number for a one-off value, or a signal getter to keep it reactive.
     */
    scale?: Accessor<number> | number;
    /**
     * Rotation in degrees, composed into the same transform as `scale` and the
     * tracker-managed position. Pass a plain number for a one-off value, or a
     * signal getter to keep it reactive.
     */
    rotate?: Accessor<number> | number;
}

export const Item = createTokenComponent<TrackerItemTokenProps>();

export interface TrackersProps extends ComponentProps {
    id: string;
}

type TrackersEventPayload = { id: string; x?: number; y?: number; hide?: boolean }

interface RegistryEntry {
    event: string;
    handleEvent: (payload: TrackersEventPayload | TrackersEventPayload[]) => void;
}

// Module-level so the exported update* functions (called from anywhere -
// event handlers, other modules, an engine.on callback) can route to the
// right <Trackers> instance by id, since a page can have several at once
// (minimap, nameplates, damage indicators, ...).
const registry = new Map<string, RegistryEntry>();

function eventNameFor(trackersId: string) {
    return `trackers:${trackersId}`;
}

function dispatch(trackersId: string, payload: TrackersEventPayload | TrackersEventPayload[]) {
    const entry = registry.get(trackersId);

    if (!entry) {
        console.warn(`[Trackers] No <Trackers id="${trackersId}"> is currently mounted - update ignored.`);
        return;
    }

    if (hasEngine()) {
        window.engine!.trigger(entry.event, payload);
    } else {
        // no engine bridge on this page
        // then call the handler directly so the component still works during development.
        entry.handleEvent(payload);
    }
}

// Solid-side wrappers whose entire body is a dispatch onto the engine
// channel - both a JS caller and a real engine.trigger() from C++ end up
// going through the exact same <Trackers> handler.
export function updateTrackers(trackersId: string, updates: TrackersEventPayload | TrackersEventPayload[]) {
    dispatch(trackersId, updates);
}

// Per docs.coherent-labs.com/cpp-gameface/content_development/csstypedobjectmodel:
// cache attributeStyleMap per element, parse the transform once, then only
// ever mutate the existing CSSUnitValue's .value on later updates - never
// reconstruct CSSTranslate/CSSUnitValue objects per call, that defeats the
// point (still allocates + still needs the string parsed once up front).
const styleMapCache = new WeakMap<HTMLElement, StylePropertyMap>();
const transformCache = new WeakMap<HTMLElement, CSSTransformValue>();
// Tracks each element's last-applied hidden state so updateTracker never has to
// read el.style.display (a DOM getter, called for every tracker on every frame) -
// comparing against a plain boolean in memory is effectively free by comparison.
const hiddenCache = new WeakMap<HTMLElement, boolean>();

function writeTransform(el: HTMLElement, x?: number, y?: number) {
    let transform = transformCache.get(el);
    if (!transform) {
        // eslint-disable-next-line gameface/js-partial-member-access
        transform = CSSStyleValue.parse('transform', 'translate(0px, 0px)') as CSSTransformValue;
        transformCache.set(el, transform);
    }

    const translate = transform[0] as CSSTranslate;
    let changed = false;
    if (x !== undefined && (translate.x as CSSUnitValue).value !== x) {
        (translate.x as CSSUnitValue).value = x;
        changed = true;
    }
    if (y !== undefined && (translate.y as CSSUnitValue).value !== y) {
        (translate.y as CSSUnitValue).value = y;
        changed = true;
    }
    // Only touch the styleMap when a coordinate actually moved - re-setting an
    // unchanged CSSTransformValue still triggers style invalidation (RecalcVisualStyle)
    // on the engine side, which is wasted scripting time for stationary trackers.
    if (changed) {
        let styleMap = styleMapCache.get(el);
        if (!styleMap) {
            styleMap = el.attributeStyleMap;
            styleMapCache.set(el, styleMap);
        }
        styleMap.set('transform', transform);
    }
}

interface TrackersContextValue {
    registerItem: (id: string, el: HTMLElement) => void;
    unregisterItem: (id: string) => void;
}

const TrackersContext = createContext<TrackersContextValue>();

// scale/rotate accept either a plain number (set once, never re-read) or a
// signal getter (re-read reactively). This is the only place that cares which.
function resolveScaleOrRotate(value: Accessor<number> | number): number {
    return typeof value === 'function' ? value() : value;
}

// Warn at most once per element - a mistaken `style.transform` is an authoring
// error, not something expected to change reactively, so there's no need to
// re-check it every effect run.
const warnedOwnTransform = new WeakSet<HTMLElement>();

// The one and only shape a tracker item ever renders: a single div that
// registers itself with the nearest <Trackers>. No children-inspection needed
// (nothing to detect - there's only this one shape), which is what lets this
// skip the wrapper div unconditionally instead of only when a runtime check
// happens to recognize a self-positioned single element.
const TrackersItem: ParentComponent<{ token: TrackerItemTokenProps }> = (props) => {
    const ctx = useContext(TrackersContext);
    let el!: HTMLDivElement;

    props.token.componentClasses = styles['trackers-item'];

    onMount(() => {
        if (import.meta.env.DEV && (props.token.style as { transform?: unknown } | undefined)?.transform && !warnedOwnTransform.has(el)) {
            warnedOwnTransform.add(el);
            console.warn(`[Trackers] <Trackers.Item id="${props.token.id}"> sets its own "transform" in style - Trackers controls this element's transform for live position updates (and the scale/rotate props, if used). Your value will be overwritten on the next update.`);
        }

        // scale/rotate share the exact same per-element CSSTransformValue that
        // writeTransform's translate lives in (index 0) - pre-seed it here,
        // before registering, so writeTransform's own lazy-create fallback never
        // fires for this element and there's only ever one parsed transform list.
        if (props.token.scale !== undefined || props.token.rotate !== undefined) {
            let parseStr = 'translate(0px, 0px)';
            let scaleIndex = -1;
            let rotateIndex = -1;

            if (props.token.scale !== undefined) {
                scaleIndex = 1;
                parseStr += ' scale(1)';
            }
            if (props.token.rotate !== undefined) {
                rotateIndex = scaleIndex !== -1 ? 2 : 1;
                parseStr += ' rotate(0deg)';
            }

            // eslint-disable-next-line gameface/js-partial-member-access
            const transform = CSSStyleValue.parse('transform', parseStr) as CSSTransformValue;
            transformCache.set(el, transform);

            createEffect(() => {
                let changed = false;

                if (scaleIndex !== -1) {
                    const s = resolveScaleOrRotate(props.token.scale!);
                    const comp = transform[scaleIndex] as CSSScale;
                    if ((comp.x as CSSUnitValue).value !== s) {
                        (comp.x as CSSUnitValue).value = s;
                        (comp.y as CSSUnitValue).value = s;
                        changed = true;
                    }
                }

                if (rotateIndex !== -1) {
                    const r = resolveScaleOrRotate(props.token.rotate!);
                    const comp = transform[rotateIndex] as CSSRotate;
                    if ((comp.angle as CSSUnitValue).value !== r) {
                        (comp.angle as CSSUnitValue).value = r;
                        changed = true;
                    }
                }

                if (changed) {
                    let styleMap = styleMapCache.get(el);
                    if (!styleMap) {
                        styleMap = el.attributeStyleMap;
                        styleMapCache.set(el, styleMap);
                    }
                    styleMap.set('transform', transform);
                }
            });
        }

        ctx?.registerItem(props.token.id, el);
    });

    onCleanup(() => ctx?.unregisterItem(props.token.id));

    return (
        <div ref={el} use:baseComponent={props.token}>
            {props.token.children}
        </div>
    );
};

const Trackers: ParentComponent<TrackersProps> = (props) => {
    const itemTokens = useTokens(Item, props.children);
    const wrapperRefs = new Map<string, HTMLElement>();

    const registerItem = (id: string, el: HTMLElement) => wrapperRefs.set(id, el);
    const unregisterItem = (id: string) => wrapperRefs.delete(id);

    function updateTracker(data: TrackersEventPayload) {
        const el = wrapperRefs.get(data.id);
        if (!el) return;

        const hide = !!data.hide;
        if (hiddenCache.get(el) !== hide) {
            el.style.display = hide ? 'none' : '';
            hiddenCache.set(el, hide);
        }
        if (hide) return;

        writeTransform(el, data.x, data.y);
    }

    function handleEvent(payload: TrackersEventPayload | TrackersEventPayload[]) {
        if (Array.isArray(payload)) {
            for (let i = 0; i < payload.length; i++) updateTracker(payload[i]);
        } else {
            updateTracker(payload);
        }
    }

    const event = eventNameFor(props.id);

    onMount(() => {
        if (registry.has(props.id)) {
            console.warn(`[Trackers] Another <Trackers id="${props.id}"> is already mounted - the earlier instance will stop receiving updates.`);
        }

        registry.set(props.id, { event, handleEvent });

        if (hasEngine()) window.engine!.on(event, handleEvent);
    });

    onCleanup(() => {
        if (registry.get(props.id)?.handleEvent === handleEvent) registry.delete(props.id);

        if (hasEngine()) {
            window.engine!.off(event, handleEvent);
        }
    });

    props.componentClasses = styles.trackers;

    return (
        <div use:baseComponent={props}>
            <TrackersContext.Provider value={{ registerItem, unregisterItem }}>
                <For each={itemTokens() ?? []}>
                    {(token) => <TrackersItem token={token} />}
                </For>
            </TrackersContext.Provider>
        </div>
    );
};

export default Object.assign(Trackers, { Item });
