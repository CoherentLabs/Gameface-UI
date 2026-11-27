import { onCleanup } from 'solid-js';
import { whenEngine } from './engine';

/**
 * A field type in Project settings › Game events: `'number'`, `'string'`, `'boolean'`, `'object'`, an array of one
 * of them (`'number[]'`), or the name of a developer type (`'Friend[]'`), which types as `unknown`.
 */
export type GameEventFieldType = 'number' | 'string' | 'boolean' | 'object' | (string & {});

export interface GameEventDef {
    /** The UI sends it, listens for it, or calls it and waits for an answer. */
    direction: 'send' | 'listen' | 'call';
    /** Argument fields in order, with their types. */
    args?: Record<string, GameEventFieldType>;
    /** The answer's type, for `call`. */
    returns?: GameEventFieldType;
}

/** Maps a field type string to its TypeScript type. */
export type GameEventValue<T> =
    T extends 'number' ? number :
    T extends 'string' ? string :
    T extends 'boolean' ? boolean :
    T extends 'object' ? Record<string, unknown> :
    T extends `${infer Item}[]` ? GameEventValue<Item>[] :
    unknown;

declare const gameEventDef: unique symbol;

/** The event's name string, with its definition attached for type checking. */
export type GameEvent<Name extends string = string, Def extends GameEventDef = GameEventDef> = Name & { readonly [gameEventDef]?: Def };

/** Positional arguments of a game event: each one is a value of one of its argument fields. */
export type GameEventArgs<E> =
    E extends { readonly [gameEventDef]?: infer Def }
        ? Def extends { args: infer A }
            ? GameEventValue<A[keyof A]>[]
            : unknown[]
        : unknown[];

/** The type `engine.call` resolves with for a `call` event. */
export type GameEventResult<E> =
    E extends { readonly [gameEventDef]?: infer Def } ? (Def extends { returns: infer R } ? GameEventValue<R> : void) : unknown;

/**
 * The game contract of `src/game/events.ts`, written by the editor from Project settings › Game events (§17.5).
 * Each key becomes its own name string, so `gameEvents.resume === 'resume'`.
 */
export function defineGameEvents<const T extends Record<string, GameEventDef>>(defs: T): { readonly [K in keyof T & string]: GameEvent<K, T[K]> } {
    const events: Record<string, string> = {};
    for (const name of Object.keys(defs)) events[name] = name;
    return events as { readonly [K in keyof T & string]: GameEvent<K, T[K]> };
}

/** The built-in events of the game contract [D-61], listed read-only at the top of Game events. */
export const BUILT_IN_GAME_EVENTS = {
    navigate: { direction: 'send', args: { screen: 'string', params: 'object' } },
    'screen-closing': { direction: 'listen' },
    'screen-closing-ready': { direction: 'send' },
    'play-sound': { direction: 'send', args: { name: 'string' } },
    'style-mode': { direction: 'listen', args: { mode: 'string' } },
    platform: { direction: 'listen', args: { platform: 'string' } },
} as const satisfies Record<string, GameEventDef>;

/**
 * Game event (§17.2): runs `fn` with the event's payload every time the game sends it. Registers in the calling
 * component's owner and stops listening when it is cleaned up.
 */
export function onGameEvent<E extends string>(event: E, fn: (...args: GameEventArgs<E>) => void): void {
    const handler = (...args: unknown[]) => fn(...(args as GameEventArgs<E>));
    let off: (() => void) | undefined;
    const cancel = whenEngine((engine) => {
        engine.on(event, handler);
        off = () => engine.off(event, handler);
    });
    onCleanup(() => {
        cancel();
        off?.();
    });
}
