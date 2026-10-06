/**
 * Types for `normalizeIconKey.mjs`. The implementation is plain JavaScript so
 * that the icon generation script can run under plain `node`; this file keeps
 * it fully typed everywhere it is imported from TypeScript.
 *
 * @param name The file or folder name to normalize.
 * @param file The icon path, used only for error messages.
 * @throws If the name yields no usable key, or one starting with a digit.
 */
declare function normalizeIconKey(name: string, file: string): string;

export default normalizeIconKey;
