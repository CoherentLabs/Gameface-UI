import { createEffect, getOwner, on, onCleanup, onMount } from 'solid-js';
import eventBus from '@components/Utility/EventBus';
import { findFlow, hideScreens } from './registry';
import { getEngine, triggerGame, whenEngine } from './engine';
import { inputDevice, trackInputDevice } from './platform';
import type { InputDevice } from './platform';

/**
 * Register project types with the runtime through declaration merging. The sound names of `src/utils/sounds.ts`:
 *
 * ```ts
 * declare module '@components/Utility/Flow/Flow' {
 *     interface FlowRegister { sounds: typeof sounds[number] }
 * }
 * ```
 */
export interface FlowRegister {}

/** The names `playSound` accepts: the project's `@gfSounds` list once registered, otherwise any string. */
export type SoundName = FlowRegister extends { sounds: infer S extends string } ? S : string;

// ── Events ──────────────────────────────────────────────────────────────────────────────────────────────────────

/** Screen shows (§17.2): runs after the intro, once the screen's root has mounted. */
export function onScreenShow(fn: () => void): void {
    const flow = findFlow(getOwner());
    if (!flow) {
        onMount(fn);
        return;
    }
    if (flow.shown) return;
    flow.showHandlers.add(fn);
    onCleanup(() => flow.showHandlers.delete(fn));
}

/** Screen hides (§17.2): runs before the outro, when the UI navigates away or the game closes the screen. */
export function onScreenHide(fn: () => void): void {
    const flow = findFlow(getOwner());
    if (!flow) {
        console.warn('[Flow] onScreenHide needs useFlow in this component or one above it.');
        return;
    }
    flow.hideHandlers.add(fn);
    onCleanup(() => flow.hideHandlers.delete(fn));
}

/** Input device changed (§17.2): runs with the new device every time the player switches. */
export function onInputDevice(fn: (device: InputDevice) => void): void {
    onCleanup(trackInputDevice());
    createEffect(on(inputDevice, (device) => fn(device), { defer: true }));
}

/** UI event (§17.2): a GFUI EventBus event another part of the UI emits. */
export function onUIEvent(name: string, fn: (data: unknown) => void): void {
    const handler = (data: unknown) => fn(data);
    eventBus.on(name, handler);
    onCleanup(() => eventBus.off(name, handler));
}

/** Timer (§17.2): runs `fn` once after `ms`. Cancelled when the component is cleaned up. */
export function after(ms: number, fn: () => void): void {
    const id = setTimeout(fn, ms);
    onCleanup(() => clearTimeout(id));
}

/** Timer (§17.2): runs `fn` every `ms`. Stopped when the component is cleaned up. */
export function every(ms: number, fn: () => void): void {
    const id = setInterval(fn, ms);
    onCleanup(() => clearInterval(id));
}

let closingSubscribed = false;

/**
 * The game closes the screen (§15): the game triggers `screen-closing`, the runtime runs the onScreenHide handlers
 * (and the outro, once there is one) and answers `screen-closing-ready`. Subscribed once per page by useFlow.
 */
export function subscribeScreenClosing() {
    if (closingSubscribed) return;
    closingSubscribed = true;
    whenEngine((engine) => {
        engine.on('screen-closing', () => {
            hideScreens();
            engine.trigger('screen-closing-ready');
        });
    });
}

// ── Steps ───────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Go to screen (§17.2): runs the onScreenHide handlers (then the outro, once there is one), then tells the game
 * `engine.trigger('navigate', screen, params)` [D-61]. The game loads the screen.
 */
export function navigate(screen: string, params?: Record<string, unknown>): Promise<void> {
    hideScreens();
    if (params === undefined) triggerGame('navigate', screen);
    else triggerGame('navigate', screen, params);
    return Promise.resolve();
}

/** Play sound (§17.4): Gameface plays no audio, so this asks the game with `engine.trigger('play-sound', name)`. */
export function playSound(name: SoundName): void {
    triggerGame('play-sound', name);
}

/**
 * Set language (§17.2): asks the game to switch the localization language (`ChangeLanguage`) and to set the custom
 * media feature `language` (`SetCustomMediaFeature`) [D-13], then re-resolves `data-l10n-id` texts.
 */
export function setLanguage(lang: string): void {
    triggerGame('ChangeLanguage', lang);
    triggerGame('SetCustomMediaFeature', 'language', lang);
    getEngine()?.reloadLocalization?.();
}

/** Wait (§17.2): `await delay(500)`. */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Do once (§17.2): `fn` runs the first time only; later calls return its first result. */
export function once<F extends (...a: any[]) => any>(fn: F): F {
    let done = false;
    let result: ReturnType<F>;
    return function (this: unknown, ...args: Parameters<F>) {
        if (!done) {
            done = true;
            result = fn.apply(this, args);
        }
        return result;
    } as F;
}

/** Debounce (§17.2): `fn` runs `ms` after the last call. A pending call is dropped when the component is cleaned up. */
export function debounce<F extends (...a: any[]) => any>(fn: F, ms: number): F {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (getOwner()) onCleanup(() => clearTimeout(timer));
    return function (this: unknown, ...args: Parameters<F>) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    } as F;
}

/** Throttle (§17.2): `fn` runs at most once every `ms`; the first call runs right away. */
export function throttle<F extends (...a: any[]) => any>(fn: F, ms: number): F {
    let last = -Infinity;
    return function (this: unknown, ...args: Parameters<F>) {
        const now = performance.now();
        if (now - last < ms) return undefined;
        last = now;
        return fn.apply(this, args);
    } as F;
}
