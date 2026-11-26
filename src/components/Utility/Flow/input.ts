import { createEffect, createRoot, createSignal, getOwner, on, onCleanup, untrack } from 'solid-js';
import type { Accessor } from 'solid-js';
import { gamepad, GamepadMappings, keyboard } from 'coherent-gameface-interaction-manager';
import type { GamepadInput, KeyName } from 'coherent-gameface-interaction-manager';
import { useNavigation } from '../Navigation/Navigation';
import type { NavigationRef } from '../Navigation/Navigation';
import type { ActionCfg } from '../Navigation/types';
import { findFlow, whenNav } from './registry';
import type { FlowInstance } from './registry';
import { gamepadPlatform, platform } from './platform';
import type { Platform } from './platform';

// ── Input actions (src/input/actions.ts, §23.6) ─────────────────────────────────────────────────────────────────

/** Mouse bindings are DOM events the runtime listens for itself: the interaction manager has no mouse bindings. */
export type MouseBinding = 'click' | 'press';

/**
 * One action of Project settings › Input. A keyboard or gamepad binding is a list of inputs pressed together
 * (the interaction manager's `binds`). Gamepad bindings are positions (`face-button-down`), one per platform; PC
 * uses the Xbox binding.
 */
export interface InputActionBindings {
    keyboard?: KeyName[];
    mouse?: MouseBinding[];
    xbox?: GamepadInput[];
    playstation?: GamepadInput[];
    switch?: GamepadInput[];
}

export interface InputAction {
    readonly name: string;
    readonly bindings: InputActionBindings;
}

/** Raw keys (F-247): inputs that are not an action of Project settings › Input. */
export interface InputKeys {
    key?: KeyName[];
    button?: GamepadInput[];
}

export interface InputOptions {
    /** When the row runs: on press (default), on release, or once the input has been held for `holdMs`. */
    on?: 'pressed' | 'released' | 'held';
    /** Hold duration for `held` (default 1000 ms). Setting it alone makes the row a hold row. */
    holdMs?: number;
    /** Element rows: only while this element or a child has focus (for the mouse: a click on it). */
    scope?: () => HTMLElement | undefined;
    /** The screen's rows for the same input don't run. */
    stopHere?: boolean;
    /** Runs only while `with` is held (`anyOrder`: either input first, within 100 ms). Beats the plain input. */
    combo?: { with: InputAction; anyOrder?: boolean };
    /** Runs on two presses within 300 ms. Beats the single press. */
    double?: boolean;
    /** Analog triggers: how far the trigger must go, 0..1 (default 0.5). */
    threshold?: number;
}

const definedActions = new Map<string, InputAction>();

/**
 * Input actions of `src/input/actions.ts`, written by the editor from Project settings › Input. A screen registers
 * every defined action with its Navigation, so `onAction={{ <action>: fn }}` on an element works.
 */
export function defineInputActions<const T extends Record<string, InputActionBindings>>(defs: T): { readonly [K in keyof T & string]: InputAction & { readonly name: K } } {
    const result: Record<string, InputAction> = {};
    for (const [name, bindings] of Object.entries(defs)) {
        const action = Object.freeze({ name, bindings });
        result[name] = action;
        definedActions.set(name, action);
    }
    return result as { readonly [K in keyof T & string]: InputAction & { readonly name: K } };
}

type BindingOverride = { keyboard?: KeyName[] | null; gamepad?: GamepadInput[] | null };
const [overrides, setOverrides] = createSignal<Record<string, BindingOverride>>({});

/**
 * Player remapping (GFUI `Keybinds`): overrides an action's keyboard binding, or its gamepad binding on every
 * platform. `null` unbinds the device; `undefined` goes back to the binding from Project settings.
 */
export function setInputBinding(action: InputAction | string, device: 'keyboard' | 'gamepad', binds: string[] | null | undefined) {
    const name = typeof action === 'string' ? action : action.name;
    setOverrides((all) => {
        const next = { ...all, [name]: { ...all[name], [device]: binds as never } };
        if (binds === undefined) delete next[name][device];
        return next;
    });
}

/** Drops the player's remapping of one action, or of every action. */
export function resetInputBindings(action?: InputAction | string) {
    if (action === undefined) return setOverrides({});
    const name = typeof action === 'string' ? action : action.name;
    setOverrides((all) => {
        const next = { ...all };
        delete next[name];
        return next;
    });
}

// ── Sources: what one Navigation action is bound to ─────────────────────────────────────────────────────────────

interface Resolved {
    key?: KeyName[];
    button?: GamepadInput[];
    mouse: MouseBinding[];
}

interface Source {
    /** The Navigation action name. */
    name: string;
    resolve(p: Platform): Resolved;
}

const nonEmpty = <T,>(list: T[] | null | undefined) => (list && list.length ? list : undefined);

function actionSource(action: InputAction): Source {
    return {
        name: action.name,
        resolve(p) {
            const o = overrides()[action.name] ?? {};
            const key = o.keyboard !== undefined ? o.keyboard : action.bindings.keyboard;
            const button = o.gamepad !== undefined ? o.gamepad : action.bindings[gamepadPlatform(p)];
            return { key: nonEmpty(key), button: nonEmpty(button), mouse: action.bindings.mouse ?? [] };
        },
    };
}

function keysSource(keys: InputKeys): Source {
    return {
        name: `keys:${(keys.key ?? []).join('+')}|${(keys.button ?? []).join('+')}`,
        resolve: () => ({ key: nonEmpty(keys.key), button: nonEmpty(keys.button), mouse: [] }),
    };
}

/** An action Navigation already has (`select` for useHold): its bindings as they were, plus a mouse press. */
function navActionSource(nav: NavigationRef, name: string): Source {
    const cfg = nav.getAction(name);
    return {
        name,
        resolve: () => ({ key: nonEmpty(cfg?.key?.binds), button: nonEmpty(cfg?.button?.binds), mouse: ['press'] }),
    };
}

/**
 * The binding an input hint shows for a device: keyboard keys, the platform's gamepad buttons (with the player's
 * remapping), or mouse bindings. Undefined when the action has none for that device.
 */
export function bindingFor(action: InputAction, device: 'keyboard' | 'gamepad' | 'mouse', p: Platform): string[] | undefined {
    if (device === 'mouse') return nonEmpty(action.bindings.mouse);
    const r = actionSource(action).resolve(p);
    return device === 'keyboard' ? r.key : (r.button as string[] | undefined);
}

const sameList = (a?: unknown[], b?: unknown[]) => (a ?? []).join('\u0000') === (b ?? []).join('\u0000');

// ── Rows and entries ────────────────────────────────────────────────────────────────────────────────────────────

const COMBO_MS = 100;
const DOUBLE_MS = 300;
const HOLD_DEFAULT_MS = 1000;
const DEFAULT_THRESHOLD = 0.5;
/** No hold tick for this long means the gamepad input was released while its action was paused. */
const GAMEPAD_RELEASE_MS = 600;

interface Row {
    fn: () => void;
    opts: InputOptions;
    /** Extra mouse bindings of the row itself (useHold's press on the element). */
    mouse: MouseBinding[];
    flow?: FlowInstance;
    entry?: Entry;
    setProgress: (value: number) => void;
    holdRaf?: number;
    holdEl?: HTMLElement;
    fired?: boolean;
    /** The mouse was pressed on the row's target and not released yet. */
    mouseDown?: boolean;
}

interface Entry {
    nav: NavigationRef;
    source: Source;
    refs: number;
    rows: Set<Row>;
    /** The action as it was before the runtime took it over (Navigation defaults, or one the screen defined). */
    restore?: ActionCfg;
    registered?: Resolved;
    detachTrackers?: () => void;
    down: boolean;
    lastDownAt: number;
    lastPressAt: number;
    gamepadReached: boolean;
    gamepadRelease?: ReturnType<typeof setTimeout>;
    pending?: ReturnType<typeof setTimeout>;
}

const navEntries = new WeakMap<NavigationRef, Map<string, Entry>>();
const liveEntries = new Set<Entry>();

const isHoldRow = (r: Row) => r.opts.on === 'held' || (r.opts.on === undefined && r.opts.holdMs !== undefined);
const isPressRow = (r: Row) => (r.opts.on ?? 'pressed') === 'pressed' && !isHoldRow(r);
const isReleaseRow = (r: Row) => r.opts.on === 'released';

const hasFocus = (el: HTMLElement | undefined) => {
    if (!el) return false;
    const active = document.activeElement;
    return !!active && (active === el || el.contains(active));
};

function callRow(row: Row) {
    try {
        row.fn();
    } catch (e) {
        console.error(`[Flow] Input row for "${row.entry?.source.name}" failed`, e);
    }
}

/**
 * Order (User Flow 4.8c): the focused element's rows first, then the screen's; `stopHere` stops the screen's. Screen
 * rows run in a microtask, after `onAction` element rows the same action fires through the EventBus.
 */
function runOrdered(rows: Row[], inScope: (row: Row) => boolean = (r) => hasFocus(r.opts.scope?.())) {
    const element = rows.filter((r) => r.opts.scope && inScope(r));
    const screen = rows.filter((r) => !r.opts.scope);
    for (const row of element) callRow(row);
    if (element.some((r) => r.opts.stopHere) || screen.length === 0) return;
    queueMicrotask(() => screen.forEach(callRow));
}

function entryFor(nav: NavigationRef, name: string) {
    return navEntries.get(nav)?.get(name);
}

function comboMatched(entry: Entry, row: Row, now: number) {
    const other = entryFor(entry.nav, row.opts.combo!.with.name);
    if (!other) return false;
    return other.down || (!!row.opts.combo!.anyOrder && now - other.lastDownAt <= COMBO_MS);
}

/** The action fired (keyboard: key down; gamepad: on release, as the interaction manager's `press` does). */
function onPress(entry: Entry, fromGamepad: boolean) {
    if (fromGamepad) {
        const reached = entry.gamepadReached;
        clearTimeout(entry.gamepadRelease);
        release(entry);
        if (!reached) return;
    }
    const now = performance.now();
    const rows = [...entry.rows].filter(isPressRow);
    const combos = rows.filter((r) => r.opts.combo);
    const doubles = rows.filter((r) => r.opts.double && !r.opts.combo);
    const plain = rows.filter((r) => !r.opts.combo && !r.opts.double);

    // The most specific input wins: a combo beats the plain button, a double press the single one.
    const matched = combos.filter((r) => comboMatched(entry, r, now));
    if (matched.length) {
        clearTimeout(entry.pending);
        entry.lastPressAt = -Infinity;
        runOrdered(matched);
        return;
    }
    if (doubles.length && now - entry.lastPressAt <= DOUBLE_MS) {
        clearTimeout(entry.pending);
        entry.lastPressAt = -Infinity;
        runOrdered(doubles);
        return;
    }
    entry.lastPressAt = now;
    if (plain.length === 0) return;

    const wait = Math.max(combos.some((r) => r.opts.combo!.anyOrder) ? COMBO_MS : 0, doubles.length ? DOUBLE_MS : 0);
    if (!wait) {
        runOrdered(plain);
        return;
    }
    clearTimeout(entry.pending);
    entry.pending = setTimeout(() => {
        entry.pending = undefined;
        runOrdered(plain);
    }, wait);
}

function press(entry: Entry) {
    if (entry.down) return;
    entry.down = true;
    const now = performance.now();
    entry.lastDownAt = now;

    for (const row of entry.rows) {
        if (isHoldRow(row) && (!row.opts.scope || hasFocus(row.opts.scope()))) startHold(row, row.opts.scope?.());
    }

    // "Any order" combos: the other input went first and this one followed within 100 ms.
    const siblings = navEntries.get(entry.nav);
    if (!siblings) return;
    for (const first of siblings.values()) {
        if (first === entry || now - first.lastPressAt > COMBO_MS) continue;
        const rows = [...first.rows].filter((r) => isPressRow(r) && r.opts.combo?.anyOrder && r.opts.combo.with.name === entry.source.name);
        if (!rows.length) continue;
        clearTimeout(first.pending);
        first.lastPressAt = -Infinity;
        runOrdered(rows);
    }
}

function release(entry: Entry) {
    if (!entry.down) return;
    entry.down = false;
    entry.gamepadReached = false;
    for (const row of entry.rows) if (isHoldRow(row) && !row.mouseDown) stopHold(row);
    runOrdered([...entry.rows].filter(isReleaseRow));
}

// ── Hold progress ───────────────────────────────────────────────────────────────────────────────────────────────

function setHoldProperty(el: HTMLElement | undefined, value: number) {
    el?.style.setProperty('--gf-hold', String(value));
}

/** Hold progress 0..1 every frame, also as `--gf-hold` on the held element; runs the row once it reaches 1. */
function startHold(row: Row, el: HTMLElement | undefined) {
    stopHold(row);
    const ms = Math.max(1, row.opts.holdMs ?? HOLD_DEFAULT_MS);
    const start = performance.now();
    row.holdEl = el;
    row.fired = false;
    const tick = () => {
        const p = Math.min(1, (performance.now() - start) / ms);
        row.setProgress(p);
        setHoldProperty(el, p);
        if (p >= 1) {
            row.holdRaf = undefined;
            if (!row.fired) {
                row.fired = true;
                callRow(row);
            }
            return;
        }
        row.holdRaf = requestAnimationFrame(tick);
    };
    row.holdRaf = requestAnimationFrame(tick);
}

function stopHold(row: Row) {
    if (row.holdRaf !== undefined) cancelAnimationFrame(row.holdRaf);
    row.holdRaf = undefined;
    row.fired = false;
    row.setProgress(0);
    setHoldProperty(row.holdEl, 0);
    row.holdEl = undefined;
}

// ── Registration with Navigation and the interaction manager ────────────────────────────────────────────────────

/**
 * Navigation's updateAction merges into the action it has, so a key left out stays. Every key is spelled, undefined
 * to remove it, so taking an action over and giving it back leaves nothing of the runtime behind.
 */
const fullCfg = (cfg: ActionCfg): ActionCfg => ({ key: undefined, button: undefined, callback: undefined, global: undefined, ...cfg });

/** A copy of an action as Navigation has it, so later updates of its store can't change it. */
const snapshot = (a: ActionCfg): ActionCfg => ({
    ...a,
    key: a.key && { binds: [...a.key.binds], type: a.key.type && [...a.key.type] },
    button: a.button && { binds: [...a.button.binds], type: a.button.type },
});

const AXIS_ALIASES: readonly string[] = GamepadMappings.axisAliases;

/** Standard-mapping button index of a gamepad binding (`face-button-down` → 0), or undefined for a stick. */
function buttonIndex(input: GamepadInput): number | undefined {
    if (typeof input === 'number') return input;
    const name = (GamepadMappings.aliases as Record<string, string>)[input.toLowerCase()];
    return name ? (GamepadMappings as unknown as Record<string, number>)[name] : undefined;
}

/**
 * How far the binding's own buttons are pressed, 0..1. The interaction manager hands hold callbacks every pressed
 * button on the pad, so the value is read from the binding's buttons. Stick bindings count as fully pressed: the
 * interaction manager only reports them past its own threshold.
 */
function bindingValue(binds: GamepadInput[]): number {
    if (binds.some((b) => typeof b === 'string' && AXIS_ALIASES.includes(b.toLowerCase()))) return 1;
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    let value = 0;
    for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (!pad) continue;
        // A binding of several buttons is pressed as far as its least pressed button.
        let padValue = 1;
        for (const input of binds) {
            const index = buttonIndex(input);
            const button = index === undefined ? undefined : pad.buttons[index];
            padValue = Math.min(padValue, button ? (button.value ?? (button.pressed ? 1 : 0)) : 0);
        }
        value = Math.max(value, padValue);
    }
    return value;
}

function attach(entry: Entry) {
    const { nav, source } = entry;
    const r = source.resolve(untrack(platform));
    entry.registered = r;

    const previous = entry.restore?.callback;
    const cfg: ActionCfg = {
        // Always global: GFUI only lets components subscribe (onAction) to global actions.
        global: true,
        callback: (scope, ...args) => {
            previous?.(scope, ...args);
            onPress(entry, Array.isArray(args[0]));
        },
    };
    if (r.key) cfg.key = { binds: r.key, type: ['press'] };
    if (r.button) cfg.button = { binds: r.button, type: 'press' };

    if (r.key || r.button) {
        const existing = nav.getAction(source.name);
        if (existing) {
            if (!entry.restore) entry.restore = snapshot(existing);
            nav.updateAction(source.name, fullCfg({ ...cfg, paused: existing.paused }));
        } else {
            nav.addAction(source.name, cfg);
        }
    }

    // Down and up of the same inputs, for hold, release, combo and double rows.
    const paused = () => nav.isPaused(source.name);
    const keyDown = () => { if (!paused()) press(entry); };
    const keyUp = () => release(entry);
    const padHeld = () => {
        if (paused() || !r.button) return;
        const value = bindingValue(r.button);
        // The lowest threshold of the action's rows, each 0.5 unless it sets its own.
        let threshold = entry.rows.size ? Infinity : DEFAULT_THRESHOLD;
        for (const row of entry.rows) threshold = Math.min(threshold, row.opts.threshold ?? DEFAULT_THRESHOLD);
        if (value < threshold) return;
        entry.gamepadReached = true;
        press(entry);
        clearTimeout(entry.gamepadRelease);
        entry.gamepadRelease = setTimeout(() => release(entry), GAMEPAD_RELEASE_MS);
    };
    if (r.key) {
        keyboard.on({ keys: r.key, callback: keyDown, type: ['press'] });
        keyboard.on({ keys: r.key, callback: keyUp, type: ['lift'] });
    }
    if (r.button) gamepad.on({ actions: r.button as never, type: 'hold', callback: padHeld });

    entry.detachTrackers = () => {
        if (r.key) {
            keyboard.off(r.key, keyDown);
            keyboard.off(r.key, keyUp);
        }
        if (r.button) gamepad.off(r.button, padHeld);
        clearTimeout(entry.gamepadRelease);
        clearTimeout(entry.pending);
        entry.down = false;
    };
}

function detach(entry: Entry) {
    entry.detachTrackers?.();
    entry.detachTrackers = undefined;
    const { nav, source, registered } = entry;
    if (!registered?.key && !registered?.button) return;
    if (!nav.getAction(source.name)) return;
    if (entry.restore) nav.updateAction(source.name, fullCfg({ ...entry.restore, paused: nav.isPaused(source.name) }));
    else nav.removeAction(source.name);
}

function acquire(nav: NavigationRef, source: Source): Entry {
    let entries = navEntries.get(nav);
    if (!entries) navEntries.set(nav, entries = new Map());
    let entry = entries.get(source.name);
    if (entry) {
        entry.refs++;
        return entry;
    }
    entry = {
        nav, source, refs: 1, rows: new Set(), down: false,
        lastDownAt: -Infinity, lastPressAt: -Infinity, gamepadReached: false,
    };
    entries.set(source.name, entry);
    liveEntries.add(entry);
    attach(entry);
    ensurePlatformWatch();
    return entry;
}

function releaseEntry(entry: Entry) {
    if (--entry.refs > 0) return;
    for (const row of entry.rows) stopHold(row);
    detach(entry);
    liveEntries.delete(entry);
    navEntries.get(entry.nav)?.delete(entry.source.name);
}

let platformWatch = false;

/** Re-registers every action whose binding changed with the platform or the player's remapping. */
function ensurePlatformWatch() {
    if (platformWatch) return;
    platformWatch = true;
    createRoot(() => {
        createEffect(on([platform, overrides], ([p]) => {
            for (const entry of [...liveEntries]) {
                const next = entry.source.resolve(p);
                const prev = entry.registered;
                if (prev && sameList(prev.key, next.key) && sameList(prev.button, next.button)) continue;
                detach(entry);
                attach(entry);
            }
        }, { defer: true }));
    });
}

// ── Mouse rows ──────────────────────────────────────────────────────────────────────────────────────────────────

const mouseRows = new Set<Row>();
let mouseListening = false;

const mouseBindings = (row: Row) => [...(row.entry?.registered?.mouse ?? []), ...row.mouse];
const mouseTarget = (row: Row) => row.opts.scope?.() ?? row.flow?.root;

function onMouse(kind: 'click' | 'down' | 'up', e: MouseEvent) {
    const target = e.target as Node | null;
    const binding: MouseBinding = kind === 'click' ? 'click' : 'press';
    const rows = [...mouseRows].filter((r) => mouseBindings(r).includes(binding));
    if (!rows.length) return;

    if (kind === 'up') {
        // Released anywhere ends a press that started on the row's target.
        const pressed = rows.filter((r) => r.mouseDown);
        for (const row of pressed) {
            row.mouseDown = false;
            if (isHoldRow(row)) stopHold(row);
        }
        runOrdered(pressed.filter(isReleaseRow), () => true);
        return;
    }

    const inside = (r: Row) => {
        const el = mouseTarget(r);
        return !!el && !!target && (el === target || el.contains(target));
    };
    const hit = rows.filter(inside);
    if (kind === 'down') {
        for (const row of hit) {
            row.mouseDown = true;
            if (isHoldRow(row)) startHold(row, mouseTarget(row));
        }
        runOrdered(hit.filter(isPressRow), inside);
        return;
    }
    // A click is a press and a release at once.
    runOrdered(hit.filter((r) => isPressRow(r) || isReleaseRow(r)), inside);
}

const onClick = (e: MouseEvent) => onMouse('click', e);
const onMouseDown = (e: MouseEvent) => onMouse('down', e);
const onMouseUp = (e: MouseEvent) => onMouse('up', e);

function addMouseRow(row: Row) {
    if (!mouseBindings(row).length) return;
    mouseRows.add(row);
    if (mouseListening) return;
    mouseListening = true;
    document.addEventListener('click', onClick);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

function removeMouseRow(row: Row) {
    row.mouseDown = false;
    mouseRows.delete(row);
    if (mouseRows.size || !mouseListening) return;
    mouseListening = false;
    document.removeEventListener('click', onClick);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mouseup', onMouseUp);
}

// ── Public helpers ──────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Registers a row in the calling component's owner. Navigation comes from the nearest useFlow once it has mounted
 * (a screen's own `<Navigation ref={f.nav}>`, which an overlay screen has inside its opener's), otherwise from the
 * Navigation context.
 */
function useRow(source: Source | ((nav: NavigationRef) => Source), fn: () => void, opts: InputOptions, extraMouse: MouseBinding[] = []): Accessor<number> {
    const [progress, setProgress] = createSignal(0);
    const flow = findFlow(getOwner());
    const contextNav = useNavigation();
    const row: Row = { fn, opts, mouse: extraMouse, flow, setProgress };
    let disposed = false;
    let releaseRow: (() => void) | undefined;

    const register = (nav: NavigationRef) => {
        if (disposed || releaseRow) return;
        const entry = acquire(nav, typeof source === 'function' ? source(nav) : source);
        const withEntry = opts.combo ? acquire(nav, actionSource(opts.combo.with)) : undefined;
        row.entry = entry;
        entry.rows.add(row);
        addMouseRow(row);
        releaseRow = () => {
            stopHold(row);
            removeMouseRow(row);
            entry.rows.delete(row);
            releaseEntry(entry);
            if (withEntry) releaseEntry(withEntry);
        };
        // Also release with the owner that handed over the Navigation API: a screen's Navigation is cleaned up
        // before the screen's own cleanups run, and its actions must go while it still exists.
        if (getOwner()) onCleanup(dispose);
    };
    const dispose = () => {
        disposed = true;
        cancelWait?.();
        releaseRow?.();
        releaseRow = undefined;
    };

    let cancelWait: (() => void) | undefined;
    if (flow) cancelWait = whenNav(flow, register);
    else if (contextNav) register(contextNav);
    else console.warn('[Flow] An input row has no <Navigation> to register with.');
    onCleanup(dispose);
    return progress;
}

/**
 * Input row (§17.2, §23.4): runs `fn` when the action's binding for the current platform fires. The action is a
 * global Navigation action; it re-registers when the platform or the player's remapping changes. Returns the hold
 * progress (0..1) for hold rows.
 */
export function useInputAction(action: InputAction, fn: () => void, opts: InputOptions = {}): Accessor<number> {
    return useRow(actionSource(action), fn, opts);
}

/** Raw keys (F-247): a row on keyboard keys or gamepad buttons that are not an action. */
export function useInputKeys(keys: InputKeys, fn: () => void, opts: InputOptions = {}): Accessor<number> {
    return useRow(keysSource(keys), fn, opts);
}

/**
 * Held (§17.2): runs `fn` once the element has been held for `ms` (default 1000): the mouse pressed on it, or
 * Confirm (`select`) held while it has focus. Returns the progress 0..1, also set as `--gf-hold` on the element.
 */
export function useHold(el: () => HTMLElement | undefined, fn: () => void, opts: { ms?: number } = {}): Accessor<number> {
    return useRow((nav) => navActionSource(nav, 'select'), fn, { on: 'held', holdMs: opts.ms ?? HOLD_DEFAULT_MS, scope: el }, ['press']);
}

/**
 * Registers every action of `defineInputActions` with a screen's Navigation, so `onAction={{ <action>: fn }}` works
 * on its elements. Called by useFlow when `<Navigation ref={f.nav}>` hands over its API.
 */
export function registerDefinedActions(nav: NavigationRef) {
    const entries = [...definedActions.values()].map((action) => acquire(nav, actionSource(action)));
    if (getOwner()) onCleanup(() => entries.forEach(releaseEntry));
}
