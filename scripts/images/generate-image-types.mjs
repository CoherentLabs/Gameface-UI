// Writes the `Image.<folder>.<image>` types without starting Vite - for a fresh
// clone or a type check. While the dev server runs, the images plugin keeps them
// up to date on its own.
import { scanImages, writeImageTypes } from './image-types.mjs';

// Keep in sync with the `gamefaceImages` options in vite.config.mts.
const ASSETS_DIR = 'src/assets';
const TYPES_FILE = 'src/components/Media/Image/ImageTypes.ts';

writeImageTypes(scanImages(ASSETS_DIR), TYPES_FILE);
console.log(`✅ Image types generated at ${TYPES_FILE}`);
