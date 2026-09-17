/**
 * Types for `normalizeIconKey.mjs`. The implementation is plain JavaScript so
 * that the icon generation script can run under plain `node`; this file keeps
 * it fully typed everywhere it is imported from TypeScript, including with
 * the explicit `.mjs` extension (which TypeScript only pairs with `.d.mts`,
 * not `.d.ts` — see `normalizeIconKey.d.ts` for the extensionless import).
 *
 * @param name The file or folder name to normalize.
 * @param file The icon path, used only for error messages.
 * @throws If the name yields no usable key, or one starting with a digit.
 */
declare function normalizeIconKey(name: string, file: string): string;

export default normalizeIconKey;
