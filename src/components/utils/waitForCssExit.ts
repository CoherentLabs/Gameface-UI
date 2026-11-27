/**
 * Frames to wait for an exit animation to start. Gameface fires `animationstart` about 2 frames
 * after the class change, and can fire it after a 2-frame wait has already given up.
 */
const START_FRAMES = 3;
/**
 * From this frame on, computed styles reflect the class change (Gameface syncs them back to JS
 * 2 to 3 frames after a change), so a counted animation that is no longer applied was replaced.
 */
const PRUNE_FROM_FRAME = 6;

/** The CSS animation names currently applied to an element ('none' left out). */
function appliedAnimations(element: Element): Set<string> {
    const value = getComputedStyle(element).animationName || '';
    return new Set(value.split(',').map((name) => name.trim()).filter((name) => name && name !== 'none'));
}

export interface CssExitWait {
    /** Resolves when every exit animation has ended, when none started, or when cancelled. */
    promise: Promise<void>;
    /** Stops waiting: removes the listeners and resolves `promise`. Call it when the caller's own timeout fires. */
    cancel: () => void;
}

export interface CssExitOptions {
    /** Also count animations that start on descendants of `elements`. Default false. */
    subtree?: boolean;
}

/**
 * Waits for the CSS exit animations of `elements`.
 *
 * Call it right before applying the class or attribute that starts the exit animation. The wait
 * collects the animations that fire `animationstart` from then on, and resolves once each has fired
 * `animationend`, or after about 3 frames when none started.
 *
 * Gameface fires `animationstart` and `animationend` (since 1.27.0.2). Give the exit its own
 * `@keyframes`: re-applying the `animation-name` an element already has (e.g. the show animation
 * with `animation-direction: reverse`) may not restart it, and then nothing is waited for. Callers should
 * cap the wait with their own timeout and call `cancel` when it fires: an animation cut short
 * (e.g. by `display: none`) may never fire `animationend`.
 */
export function waitForCssExit(elements: (Element | null | undefined)[], options: CssExitOptions = {}): CssExitWait {
    const targets = elements.filter(Boolean) as Element[];
    let cancel = () => {};

    const promise = new Promise<void>((resolve) => {
        if (targets.length === 0) return resolve();

        /** Running animation names per animated element. */
        const running = new Map<EventTarget, Set<string>>();
        /** With `subtree` and nested targets, one bubbling event reaches several listeners. */
        const seen = new WeakSet<Event>();
        let started = false;
        let settled = false;
        let frame = 0;

        const counts = (event: Event) => {
            if (seen.has(event)) return false;
            seen.add(event);
            const target = event.target as Node;
            return options.subtree
                ? targets.some((el) => el === target || el.contains(target))
                : targets.includes(target as Element);
        };

        const finish = () => {
            if (settled) return;
            settled = true;
            cancelAnimationFrame(frame);
            targets.forEach((el) => {
                el.removeEventListener('animationstart', onStart as EventListener);
                el.removeEventListener('animationend', onEnd as EventListener);
            });
            resolve();
        };

        const onStart = (event: AnimationEvent) => {
            if (!counts(event)) return;
            started = true;
            const names = running.get(event.target!) ?? new Set<string>();
            names.add(event.animationName);
            running.set(event.target!, names);
        };

        const onEnd = (event: AnimationEvent) => {
            if (!counts(event)) return;
            const names = running.get(event.target!);
            if (!names?.delete(event.animationName)) return;
            if (names.size === 0) running.delete(event.target!);
            if (running.size === 0) finish();
        };

        targets.forEach((el) => {
            el.addEventListener('animationstart', onStart as EventListener);
            el.addEventListener('animationend', onEnd as EventListener);
        });

        /**
         * Drops counted animations that are no longer applied. A show animation whose
         * `animationstart` arrives after the wait began (a hide right after a show) is counted,
         * then replaced by the exit animation without an `animationend`.
         */
        const prune = () => {
            running.forEach((names, target) => {
                const applied = appliedAnimations(target as Element);
                names.forEach((name) => {
                    if (!applied.has(name)) names.delete(name);
                });
                if (names.size === 0) running.delete(target);
            });
            if (running.size === 0) finish();
        };

        let frames = 0;
        const check = () => {
            if (settled) return;
            frames++;
            if (frames >= START_FRAMES && !started) return finish();
            if (frames >= PRUNE_FROM_FRAME) prune();
            if (!settled) frame = requestAnimationFrame(check);
        };
        frame = requestAnimationFrame(check);

        cancel = finish;
    });

    return { promise, cancel: () => cancel() };
}
