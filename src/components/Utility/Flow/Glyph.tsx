import { Component, createMemo, createSignal, For, onCleanup, Show } from 'solid-js';
import { gamepadPlatform, inputDevice, platform, trackInputDevice } from './platform';
import type { Platform } from './platform';
import { bindingFor } from './input';
import type { InputAction } from './input';
import styles from './Glyph.module.scss';

/**
 * Glyph sets from Assets › Input glyphs: `src/assets/glyphs/<platform>/<name>.<ext>`. Gamepad glyphs are named after
 * the button position (`face-button-down.png`), keyboard glyphs after the key in lower case (`pc/enter.png`), mouse
 * glyphs `pc/mouse-click.png`. The folder is resolved from this file, so it is the project's own `src/assets`.
 */
const bundled = import.meta.glob('../../../assets/glyphs/*/*.*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function bundledGlyphs() {
    const map: Record<string, string> = {};
    for (const [path, url] of Object.entries(bundled)) {
        const match = /glyphs\/([^/]+)\/([^/]+)\.[^./]+$/.exec(path);
        if (match) map[`${match[1]}/${match[2].toLowerCase()}`] = url;
    }
    return map;
}

const [glyphs, setGlyphs] = createSignal<Record<string, string>>(bundledGlyphs());
const warned = new Set<string>();

/** Adds or replaces glyph images, keyed `<platform>/<name>` (`'xbox/face-button-down'`). */
export function registerGlyphs(map: Record<string, string>) {
    const normalized: Record<string, string> = {};
    for (const [key, url] of Object.entries(map)) normalized[key.toLowerCase()] = url;
    setGlyphs((all) => ({ ...all, ...normalized }));
}

/** The image URL for a glyph, or undefined when the set has none. Reactive. */
export function glyphUrl(p: Platform, name: string): string | undefined {
    return glyphs()[`${p}/${name.toLowerCase()}`];
}

/**
 * The image for `name` from the current platform's glyph set (`setPlatform`, default PC). `platform` picks a set
 * explicitly; InputHint uses it to show keyboard glyphs on a console.
 */
export const Glyph: Component<{ name: string; class?: string; platform?: Platform }> = (props) => {
    const set = () => props.platform ?? platform();
    const key = () => `${set()}/${props.name.toLowerCase()}`;
    const url = createMemo(() => {
        const found = glyphUrl(set(), props.name);
        if (!found && !warned.has(key())) {
            warned.add(key());
            console.warn(`[Flow] No glyph "${key()}" in src/assets/glyphs.`);
        }
        return found;
    });
    return (
        <Show when={url()} fallback={<span class={props.class} data-glyph={key()} />}>
            <img class={`${styles.glyph}${props.class ? ` ${props.class}` : ''}`} src={url()} data-glyph={key()} />
        </Show>
    );
};

/**
 * Input hint (F-246): the action's glyph for the current device and platform, and its label. The label is a localized
 * text prop: `labelKey` (preset by the editor to `input.<action>`) resolves through `data-l10n-id`, `label` is the
 * text shown until it does.
 */
export const InputHint: Component<{ action: InputAction; label?: string; labelKey?: string; class?: string }> = (props) => {
    onCleanup(trackInputDevice());

    const shown = createMemo(() => {
        const p = platform();
        const device = inputDevice();
        const keyboardHint = () => {
            const keys = bindingFor(props.action, 'keyboard', p);
            return keys && { set: 'pc' as Platform, names: keys, device: 'keyboard' };
        };
        const gamepadHint = () => {
            const buttons = bindingFor(props.action, 'gamepad', p);
            return buttons && { set: gamepadPlatform(p) as Platform, names: buttons, device: 'gamepad' };
        };
        const mouseHint = () => {
            const mouse = bindingFor(props.action, 'mouse', p);
            return mouse && { set: 'pc' as Platform, names: [`mouse-${mouse[0]}`], device: 'mouse' };
        };
        const order = device === 'gamepad' ? [gamepadHint, keyboardHint] : device === 'mouse' ? [mouseHint, keyboardHint, gamepadHint] : [keyboardHint, gamepadHint];
        for (const pick of order) {
            const hint = pick();
            if (hint) return hint;
        }
        return undefined;
    });

    return (
        <div
            class={`${styles.hint}${props.class ? ` ${props.class}` : ''}`}
            data-input-hint={props.action.name}
            data-input-device={shown()?.device ?? ''}
        >
            <div class={styles.glyphs}>
                <For each={shown()?.names ?? []}>
                    {(name) => <Glyph name={name} platform={shown()!.set} />}
                </For>
            </div>
            <span data-l10n-id={props.labelKey}>{props.label ?? props.action.name}</span>
        </div>
    );
};
