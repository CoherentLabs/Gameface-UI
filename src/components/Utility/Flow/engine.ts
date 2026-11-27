/** The parts of Gameface's `engine` global the Flow runtime uses. Absent in a plain browser without cohtml.js. */
export interface GamefaceEngine {
    on(name: string, fn: (...args: any[]) => void, context?: unknown): void;
    off(name: string, fn: (...args: any[]) => void, context?: unknown): void;
    trigger(name: string, ...args: unknown[]): void;
    call?(name: string, ...args: unknown[]): Promise<unknown>;
    reloadLocalization?(): void;
}

export function getEngine(): GamefaceEngine | undefined {
    return (globalThis as { engine?: GamefaceEngine }).engine;
}

const ENGINE_POLL_MS = 250;
const engineWaiters = new Set<(engine: GamefaceEngine) => void>();
let enginePoll: ReturnType<typeof setInterval> | undefined;

/**
 * Runs `fn` with the engine as soon as it exists: right away in a game that loaded cohtml.js first, otherwise once
 * it is loaded (a page that adds it later, or the e2e harness). Returns a function that cancels the wait.
 */
export function whenEngine(fn: (engine: GamefaceEngine) => void): () => void {
    const engine = getEngine();
    if (engine?.on) {
        fn(engine);
        return () => {};
    }
    engineWaiters.add(fn);
    enginePoll ??= setInterval(() => {
        const found = getEngine();
        if (!found?.on) return;
        clearInterval(enginePoll);
        enginePoll = undefined;
        const waiters = [...engineWaiters];
        engineWaiters.clear();
        for (const waiter of waiters) waiter(found);
    }, ENGINE_POLL_MS);
    return () => engineWaiters.delete(fn);
}

/** `engine.trigger`, or a console warning when there is no engine (a plain browser). */
export function triggerGame(name: string, ...args: unknown[]) {
    const engine = getEngine();
    if (!engine?.trigger) {
        console.warn(`[Flow] No engine: "${name}" was not sent to the game.`);
        return;
    }
    engine.trigger(name, ...args);
}
