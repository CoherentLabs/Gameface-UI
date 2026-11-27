let pending = false;

/**
 * Gameface binds `data-bind-*` on elements that mount after the first render only on the next
 * `engine.synchronizeModels()`. Anything that mounts elements at runtime (state changes, overlays,
 * late document roots) calls this; every call in the same tick ends in one sync.
 *
 * Not `hasEngine()`: that checks `engine.on`, which needs cohtml.js; `synchronizeModels` is native and exists without it.
 */
export function scheduleModelSync() {
    if (pending) return;
    pending = true;

    queueMicrotask(() => {
        pending = false;
        const engine = (globalThis as { engine?: { synchronizeModels?: () => void } }).engine;
        if (typeof engine?.synchronizeModels !== 'function') return;

        try {
            engine.synchronizeModels();
        } catch (e) {
            console.warn('[Flow] engine.synchronizeModels failed', e);
        }
    });
}
