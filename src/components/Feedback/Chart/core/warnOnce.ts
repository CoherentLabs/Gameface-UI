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
