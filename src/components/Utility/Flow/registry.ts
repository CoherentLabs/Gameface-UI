import type { Owner } from 'solid-js';
import type { NavigationRef } from '../Navigation/Navigation';
import type { FlowData, FlowNavigation, StateGroupApi } from './types';
import type { InternalStateGroup } from './stateGroup';
import type { OverlayHostInternal } from './OverlayHost';

/** One live document (a screen or a component instance) that called useFlow. */
export interface FlowInstance {
    /** Project-relative path of the document, injected into defineFlow by the editor plugin in dev builds. */
    file?: string;
    root?: HTMLElement;
    rootId?: string;
    groups: Map<string, InternalStateGroup>;
    navigation?: FlowNavigation;
    /** The Navigation API: the context captured in a component, or the API handed to f.nav in a screen. */
    nav?: NavigationRef;
    /** True for documents that render their own <Navigation> (screens). */
    ownsNavigation: boolean;
    overlayHost?: OverlayHostInternal;
    /** The `overlays` of the flow data; an OverlayHost given the same object belongs to this document. */
    overlays?: FlowData['overlays'];
    /** Re-collects this document's navigation areas now (after a state change). */
    refreshNow?: () => void;
    disposed: boolean;
}

/**
 * Flows by the Solid owner useFlow ran under. In production builds components get no owner of their own, so a
 * screen and the components it places directly can share one owner: each keeps a list, in registration order.
 */
const ownerFlows = new WeakMap<Owner, FlowInstance[]>();
const rootFlows = new WeakMap<Element, FlowInstance>();
const rootsById = new Map<string, Set<FlowInstance>>();

export function registerOwner(owner: Owner | null, flow: FlowInstance) {
    if (!owner) return;
    const list = (ownerFlows.get(owner) ?? []).filter((f) => !f.disposed);
    list.push(flow);
    ownerFlows.set(owner, list);
}

/**
 * The nearest useFlow up the Solid owner tree (that matches `predicate`, when given). Under a shared owner the flow
 * registered last comes first: called in a component body after that component's own useFlow, it is that flow.
 */
export function findFlow(owner: Owner | null, predicate?: (flow: FlowInstance) => boolean): FlowInstance | undefined {
    for (let o = owner; o; o = o.owner) {
        const list = ownerFlows.get(o);
        if (!list) continue;
        for (let i = list.length - 1; i >= 0; i--) {
            const flow = list[i];
            if (!flow.disposed && (!predicate || predicate(flow))) return flow;
        }
    }
}

/** The document `flow` is placed in: the flow whose root, or owned portal, contains `flow`'s root. */
export function parentFlow(flow: FlowInstance): FlowInstance | undefined {
    const parent = flow.root?.parentElement;
    return parent ? flowOfElement(parent) : undefined;
}

export function registerRoot(flow: FlowInstance) {
    if (!flow.root) return;
    rootFlows.set(flow.root, flow);
    if (!flow.rootId) return;
    let set = rootsById.get(flow.rootId);
    if (!set) rootsById.set(flow.rootId, set = new Set());
    set.add(flow);
}

export function unregisterRoot(flow: FlowInstance) {
    if (flow.root && rootFlows.get(flow.root) === flow) rootFlows.delete(flow.root);
    if (!flow.rootId) return;
    const set = rootsById.get(flow.rootId);
    set?.delete(flow);
    if (set && set.size === 0) rootsById.delete(flow.rootId);
}

export function isFlowRoot(el: Element) {
    return rootFlows.has(el);
}

/** The document that owns `el`: the nearest flow root above it, following portal containers to their owner. */
export function flowOfElement(el: Element | null): FlowInstance | undefined {
    for (let node = el; node; node = node.parentElement) {
        const flow = rootFlows.get(node);
        if (flow && !flow.disposed) return flow;

        const owner = node.getAttribute('data-gf-owner');
        if (owner) {
            for (const candidate of rootsById.get(owner) ?? []) {
                if (!candidate.disposed) return candidate;
            }
        }
    }
}

/** The state group `group` of the component that owns `element`. For custom binding handlers and code outside Solid. */
export function stateOf(element: Element, group: string): StateGroupApi | undefined {
    return flowOfElement(element)?.groups.get(group);
}
