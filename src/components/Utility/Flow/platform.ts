import { createSignal } from 'solid-js';
import { whenEngine } from './engine';

/** Platforms the game reports with `engine.trigger('platform', name)`. Glyph sets live in `src/assets/glyphs/<platform>/`. */
export type Platform = 'xbox' | 'playstation' | 'switch' | 'pc';
/** The device the player used last. Input hints show its glyph. */
export type InputDevice = 'gamepad' | 'keyboard' | 'mouse';

export const PLATFORMS: readonly Platform[] = ['xbox', 'playstation', 'switch', 'pc'];

const [platform, setPlatformSignal] = createSignal<Platform>('pc');
const [inputDevice, setInputDeviceSignal] = createSignal<InputDevice>('keyboard');
const [styleMode, setStyleModeSignal] = createSignal('');

export { platform, inputDevice, styleMode };

/**
 * Sets the platform (`engine.on('platform', …)`, or the editor's canvas toolbar). Input actions re-register with the
 * platform's gamepad binding and glyphs switch to its set. The device follows: gamepad on a console, keyboard on PC.
 */
export function setPlatform(name: Platform) {
    if (!PLATFORMS.includes(name)) {
        console.warn(`[Flow] Unknown platform "${name}". Expected one of ${PLATFORMS.join(', ')}.`);
        return;
    }
    setPlatformSignal(name);
    setInputDeviceSignal(name === 'pc' ? 'keyboard' : 'gamepad');
}

/** Sets the input device input hints show. The runtime tracks it on its own while something listens (§23.4). */
export function setInputDevice(device: InputDevice) {
    setInputDeviceSignal(device);
}

/**
 * Switches the style mode (§11): sets the mode's class on `<html>` and removes the previous one. `''` goes back to the
 * default mode. Called by the game (`engine.on('style-mode', …)`) and by the editor's canvas toolbar.
 */
export function setStyleMode(name: string) {
    const root = document.documentElement;
    const previous = styleMode();
    if (previous === name) return;
    if (previous) root.classList.remove(previous);
    if (name) root.classList.add(name);
    setStyleModeSignal(name);
}

/** The gamepad bindings an action uses on a platform: PC uses the Xbox layout. */
export function gamepadPlatform(p: Platform): Exclude<Platform, 'pc'> {
    return p === 'pc' ? 'xbox' : p;
}

// ── Device tracking ─────────────────────────────────────────────────────────────────────────────────────────────

const GAMEPAD_POLL_MS = 200;
const AXIS_DEADZONE = 0.5;
let trackers = 0;
let stopTracking: (() => void) | undefined;

function startTracking() {
    let lastX = -1;
    let lastY = -1;
    const onKey = () => setInputDeviceSignal('keyboard');
    const onMouseDown = () => setInputDeviceSignal('mouse');
    const onMouseMove = (e: MouseEvent) => {
        // Gameface can send a mousemove without movement; only a real move switches to the mouse.
        if (lastX !== -1 && (e.clientX !== lastX || e.clientY !== lastY)) setInputDeviceSignal('mouse');
        lastX = e.clientX;
        lastY = e.clientY;
    };
    const poll = setInterval(() => {
        const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < pads.length; i++) {
            const pad = pads[i];
            if (!pad) continue;
            const pressed = pad.buttons.some((b) => b.pressed);
            const moved = pad.axes.some((a) => Math.abs(a) > AXIS_DEADZONE);
            if (pressed || moved) {
                setInputDeviceSignal('gamepad');
                return;
            }
        }
    }, GAMEPAD_POLL_MS);

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
        clearInterval(poll);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
    };
}

/** Starts tracking the device the player uses; returns the function that stops it. Ref-counted. */
export function trackInputDevice(): () => void {
    if (trackers++ === 0) stopTracking = startTracking();
    let released = false;
    return () => {
        if (released) return;
        released = true;
        if (--trackers === 0) {
            stopTracking?.();
            stopTracking = undefined;
        }
    };
}

// ── Game subscriptions ──────────────────────────────────────────────────────────────────────────────────────────

let subscribed = false;

/** Subscribes `engine.on('style-mode')` and `engine.on('platform')` once per page. */
export function subscribePlatformEvents() {
    if (subscribed) return;
    subscribed = true;
    whenEngine((engine) => {
        engine.on('style-mode', (name: string) => setStyleMode(name ?? ''));
        engine.on('platform', (name: Platform) => setPlatform(name));
    });
}
