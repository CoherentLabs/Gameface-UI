/**
 * Turns an icon file or folder name into the key it is exposed under on the
 * `Icon` component - `round-star` becomes `roundStar`, so `<Icon.roundStar />`.
 *
 * Plain ESM JavaScript on purpose: `scripts/generate-icon-types.mjs` runs under
 * plain `node`, which cannot load TypeScript before Node 22.18. The types live
 * in `normalizeIconKey.d.ts` next to this file, so `Icon.tsx` still sees them.
 *
 * @param {string} name The file or folder name to normalize.
 * @param {string} file The icon path, used only for error messages.
 * @returns {string} The normalized, camelCased key.
 */
function normalizeIconKey(name, file) {
    const key = name
        .replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
        .replace(/^[A-Z]/, (c) => c.toLowerCase());

    if (key === '') {
        throw new Error(
            `Icon "${file}" has no usable name: it contains no letters or digits. ` +
            `Rename it to something like "myIcon.svg".`
        );
    }

    if (/^[0-9]/.test(key)) {
        throw new Error(
            `Icon "${file}" produces the key "${key}", which starts with a digit — ` +
            `<Icon.${key} /> is not valid syntax. Rename it to start with a letter, e.g. "icon${key}.svg".`
        );
    }
    return key;
}

export default normalizeIconKey;
