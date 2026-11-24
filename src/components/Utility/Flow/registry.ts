import type { Owner } from 'solid-js';
import type { NavigationRef } from '../Navigation/Navigation';
import type { FlowNavigation, StateGroupApi } from './types';
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
    disposed: boolean;
}

const ownerFlows = new WeakMap<Owner, FlowInstance>();
const rootFlows = new WeakMap<Element, FlowInstance>();
const rootsById = new Map<string, Set<FlowInstance>>();

export function registerOwner(owner: Owner | null, flow: FlowInstance) {
    if (owner) ownerFlows.set(owner, flow);
}

/** The nearest useFlow up the Solid owner tree (that matches `predicate`, when given). */
export function findFlow(owner: Owner | null, predicate?: (flow: FlowInstance) => boolean): FlowInstance | undefined {
    for (let o = owner; o; o = o.owner) {
        const flow = ownerFlows.get(o);
        if (flow && !flow.disposed && (!predicate || predicate(flow))) return flow;
    }
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
