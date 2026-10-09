/**
 * Types for `image-types.mjs`. The implementation is plain JavaScript so that
 * `generate-image-types.mjs` can run under plain `node`; this file keeps it
 * typed where the Vite plugin imports it.
 */

export declare const IMAGE_EXTENSIONS: string[];

/**
 * Every image under `assetsDir`, keyed the way it is written after `Image.`:
 * `icons.gamepad.a` -> absolute path of `icons/gamepad/a.png`.
 *
 * @throws If a file name yields no usable key.
 */
export declare function scanImages(assetsDir: string): Map<string, string>;

/**
 * Writes the `ImageTree` interface for `images` to `typesFile`, only when it changed.
 *
 * @throws If an image and a folder share a name.
 */
export declare function writeImageTypes(images: Map<string, string>, typesFile: string): void;
