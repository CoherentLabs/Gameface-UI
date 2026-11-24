import { waitForFrames } from './waitForFrames';

/** Gameface syncs computed styles back to JS 2 to 3 frames after a change. */
const COMPUTED_STYLE_FRAMES = 3;

/** The CSS animation names currently applied to an element ('none' left out). */
function animationNames(element: Element): Set<string> {
    const value = getComputedStyle(element).animationName || '';
    return new Set(
        value
            .split(',')
            .map((name) => name.trim())
            .filter((name) => name && name !== 'none')
    );
}

/**
 * Prepares to wait for the exit animations of `elements`.
 *
 * Call it **before** applying the class or attribute that starts the exit animation, then call
 * the returned function right after applying it. That function resolves once every CSS animation
 * that started because of the change has fired `animationend`, or about 3 frames later when none
 * started.
 *
 * Gameface has no `animationstart` event, so a new animation is detected by comparing
 * `animation-name` before and after the change. An exit animation with the same name as an
 * animation already applied to the element is not detected.
 * Only animations on the given elements themselves count, not on their descendants.
 * Callers should cap the wait with their own timeout.
 */
export function prepareCssExit(elements: Element[]): () => Promise<void> {
    const targets = elements.filter(Boolean);
    const before = targets.map(animationNames);

    return () =>
        new Promise<void>((resolve) => {
            if (targets.length === 0) return resolve();

            // Listen right away: an exit shorter than the computed-style delay
            // ends before the new names can be read.
            const ended = targets.map(() => new Set<string>());
            let pending: Set<string>[] | null = null;
            let settled = false;

            const finish = () => {
                if (settled) return;
                settled = true;
                targets.forEach((el) => el.removeEventListener('animationend', onEnd as EventListener));
                resolve();
            };

            const allEnded = () => pending!.every((names) => names.size === 0);

            const onEnd = (event: AnimationEvent) => {
                const index = targets.indexOf(event.target as Element);
                if (index === -1) return; // bubbled up from a descendant
                if (!pending) {
                    ended[index].add(event.animationName);
                    return;
                }
                pending[index].delete(event.animationName);
                if (allEnded()) finish();
            };

            targets.forEach((el) => el.addEventListener('animationend', onEnd as EventListener));

            waitForFrames(() => {
                if (settled) return;
                pending = targets.map((el, i) => {
                    const added = new Set<string>();
                    animationNames(el).forEach((name) => {
                        if (!before[i].has(name) && !ended[i].has(name)) added.add(name);
                    });
                    return added;
                });
                if (allEnded()) finish();
            }, COMPUTED_STYLE_FRAMES);
        });
}
