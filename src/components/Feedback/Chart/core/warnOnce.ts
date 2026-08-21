const seen = new Set<string>();

/**
 * Logs a development warning the first time it happens.
 *
 * Chart geometry is recomputed on every frame of a tween, so an unguarded
 * warning would flood the console hundreds of times a second.
 */
export const warnOnce = (message: string) => {
    if (!import.meta.env.DEV || seen.has(message)) return;

    seen.add(message);
    console.warn(message);
};

/**
 * Element count past which a chart stops being cheap enough for a HUD.
 *
 * Every mark is an SVG path, and an animation rebuilds all of them on every
 * frame — so this is the point where a chart starts competing with the game for
 * frame time rather than decorating it.
 */
const MARK_BUDGET = 500;

export const warnOnMarkBudget = (displayName: string, marks: number) => {
    if (marks <= MARK_BUDGET) return;

    // Deliberately no count in the message: warnOnce dedupes on the text, and a
    // number that changes every frame would defeat that entirely.
    warnOnce(
        `[${displayName}] More than ${MARK_BUDGET} marks. Each one is an SVG path, and an animation ` +
        'rebuilds all of them every frame. Consider aggregating the data, or dropping `animation`.',
    );
};
