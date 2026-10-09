import path from 'node:path';
import { createFilter, type Plugin, type Rollup } from 'vite';
import { IMAGE_EXTENSIONS, scanImages, writeImageTypes } from '../images/image-types.mjs';
import { MaxRectsPacker } from 'maxrects-packer';
import type { Bin, IRectangle } from 'maxrects-packer';
import sharp from 'sharp';

/**
 * Lets any module use `Image.icons.gamepad.xbox.a` for `assets/icons/gamepad/xbox/a.png`,
 * as a JSX tag or as a plain value.
 *
 * `Image.icons...` never exists at runtime. After Solid has compiled the JSX,
 * the module is parsed and every property chain that starts at the imported
 * `Image` is replaced with a real import of what it points at:
 *
 *     <Image.icons.gamepad.xbox.a />          ->  `Image` with `src` written into the props Solid built
 *     const glyphs = { a: Image.icons.gamepad.xbox.a }
 *     Image.icons.gamepad.ps5[key]            ->  every image under `ps5`, as an object of components
 *
 * Because every image a view can show is now a real import, Rollup's module
 * graph knows exactly which images each view uses - printed at the end of a build.
 * A chain that reads a folder with `[key]` pulls in the whole folder, since the
 * build cannot know which key the code will pick.
 *
 * The folder scan comes from `image-types.mjs` in `scripts/images`, which also writes the
 * `Image.<folder>.<image>` types, so the editor and the rewrite always agree on
 * which keys exist. The plugin keeps those types fresh while Vite runs;
 * `npm run gen-images` writes them without it.
 */

// -----------------------------------------------------------------------------
// Options
// -----------------------------------------------------------------------------

export interface ImagesPluginOptions {
    /** Folder whose images are exposed on `Image`, relative to the project root or absolute. */
    assets: string;
    /** File the `ImageTree` types are written to, relative to the project root or absolute. */
    types: string;
    /**
     * Groups of images to pack into sprite sheets, per view. A string is a folder
     * or glob under `assets`, and a bare folder means everything under it. An
     * object adds its own name, excludes and settings. Each image goes to the
     * first group that matches it. Leave it out to build no atlas.
     */
    atlas?: (string | AtlasGroup)[];
    /** Settings every group starts from. A group's own settings win over these. */
    atlasDefaults?: Partial<AtlasConfig>;
}

interface AtlasGroup extends Partial<AtlasConfig> {
    /** Folders or globs under `assets` that this group claims. A bare folder means everything under it. */
    include: string | string[];
    /** Folders or globs to leave out, also written relative to `assets`. */
    exclude?: string | string[];
    /**
     * Name used in sheet file names and the build report. Defaults to the folder
     * part of the first `include`, so `icons/hud` becomes `icons-hud`. Set it
     * when that reads badly, for example with several includes.
     */
    name?: string;
}

interface AtlasConfig {
    /** Widest a sheet may grow, in pixels. @default 2048 */
    maxWidth: PotSize;
    /** Tallest a sheet may grow, in pixels. @default 2048 */
    maxHeight: PotSize;
    /** Transparent gap between sprites, in pixels. @default 2 */
    padding: number;
    /**
     * Rounds every sheet up to a power-of-two size. Keep `maxWidth` and
     * `maxHeight` powers of two with it on, or the real ceiling drops to the
     * power of two below them. @default true
     */
    pot: boolean;
    /**
     * Packs every image into a square cell, centered, so a sprite stretched into
     * a square element looks like `contain` instead of squashed. @default false
     */
    squareCells: boolean;
    /** Images wider or taller than this stay standalone files. @default 2048 */
    maxSpriteSize: PotSize;
    /**
     * Keeps shipping the original files next to the sheet. The way out for images
     * referenced from CSS, which cannot use a sprite. @default false
     */
    keepOriginals: boolean;
}

const POT_VALUES = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192] as const;
type PotValue = (typeof POT_VALUES)[number];
type PotSize = PotValue | (number & {});

const BUILT_IN_OPTIONS: AtlasConfig = {
    maxWidth: 2048,
    maxHeight: 2048,
    padding: 2,
    maxSpriteSize: 2048,
    pot: true, // Power of two
    squareCells: false,
    keepOriginals: false,
};

// -----------------------------------------------------------------------------
// Shared helpers
// -----------------------------------------------------------------------------

const toPosix = (value: string) => value.replace(/\\/g, '/');

const cleanUrl = (url: string) => url.replace(/[?#].*$/, '');

/** Adds `value` to the set kept under `key`, starting one if there is none yet. */
function addTo(map: Map<string, Set<string>>, key: string, value: string) {
    const set = map.get(key);
    if (set) set.add(value);
    else map.set(key, new Set([value]));
}

// -----------------------------------------------------------------------------
// Image.* rewrite, used by `transform`
// -----------------------------------------------------------------------------

const SCRIPT_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/;

/** Import specifiers that point at the Image component, with or without an extension. */
const IMAGE_COMPONENT = /(?:^|\/)Media\/Image\/Image(?:\.[jt]sx?)?$/;

const COMPONENT_PATH = "Media/Image/Image";

/** The parts of the ESTree nodes from `this.parse` that this plugin reads. */
interface AstNode {
    type: string;
    start: number;
    end: number;
    [key: string]: any;
}

interface Chain {
    /** Where the chain starts - the `Image` identifier. */
    start: number;
    /** Names written with a dot, up to the first `[key]`: `['icons', 'gamepad', 'ps5']`. */
    names: string[];
    /** Where each of those names ends in the code, so `ends[i]` closes `names[i]`. */
    ends: number[];
    /** Every member expression of the chain, outermost last. */
    members: AstNode[];
}

/** Swap `code` from `start` to `end` for `text`. With `start === end` it is a plain insert. */
interface Replacement {
    start: number;
    end: number;
    text: string;
}

/** Calls `visit` for every node in the tree, parents before their children. */
function walk(node: AstNode, visit: (node: AstNode, parent: AstNode | null) => void, parent: AstNode | null = null) {
    visit(node, parent);

    for (const value of Object.values(node)) {
        for (const child of Array.isArray(value) ? value : [value]) {
            if (child && typeof child.type === 'string') walk(child, visit, node);
        }
    }
}

/** Local name of `import Image from '.../Media/Image/Image'`, or null when the module does not import it. */
function findImageImport(program: AstNode) {
    for (const statement of program.body) {
        if (statement.type !== 'ImportDeclaration' || !IMAGE_COMPONENT.test(statement.source.value)) continue;

        const specifier = statement.specifiers.find((s: AstNode) => s.type === 'ImportDefaultSpecifier');
        if (specifier) return specifier.local.name as string;
    }

    return null;
}

/** Reads `Image.icons.gamepad.ps5[key]` from its outermost member expression, or null if it does not start at `local`. */
function readChain(node: AstNode, local: string): Chain | null {
    const members: AstNode[] = [];
    let current = node;

    while (current.type === 'MemberExpression') {
        members.unshift(current);
        current = current.object;
    }

    if (current.type !== 'Identifier' || current.name !== local) return null;

    const names: string[] = [];
    const ends: number[] = [];

    for (const member of members) {
        if (member.computed || member.property.type !== 'Identifier') break;
        names.push(member.property.name);
        ends.push(member.end);
    }

    return names.length ? { start: current.start, names, ends, members } : null;
}

/**
 * Whether `node` is the component argument of `createComponent(Image.a.b, props)`,
 * which is what `<Image.a.b ... />` compiles to. Solid imports `createComponent`
 * under a prefixed name, hence the loose match.
 */
function isComponentTagSite(node: AstNode, parent: AstNode | null) {
    if (parent?.type !== 'CallExpression' || parent.arguments[0] !== node) return false;
    return parent.callee.type === 'Identifier' && parent.callee.name.endsWith('createComponent');
}

/**
 * The props object of a tag site, so `src` can be written straight into it. Null
 * when the props are not an object literal: a spread compiles to a bare identifier
 * or a `mergeProps(...)` call, neither of which can be written into.
 */
function propsOfComponentCall(node: AstNode, parent: AstNode | null) {
    if (!isComponentTagSite(node, parent)) return null;

    const props = parent!.arguments[1];
    return props?.type === 'ObjectExpression' ? (props as AstNode) : null;
}

/**
 * The name a prop is written under, or null when it cannot be read.
 * Solid compiles even a plain `class={...}` to a computed *literal* key, so
 * `computed` on its own says nothing - only a computed key that is an expression
 * is genuinely unknown.
 */
function propName(property: AstNode) {
    if (property.computed) return property.key.type === 'Literal' ? String(property.key.value) : null;
    return property.key.type === 'Identifier' ? property.key.name : String(property.key.value);
}

/**
 * Whether this call site might be passing `options`. Anything unreadable counts
 * as a yes: an image that loses its sprite still renders, one that keeps a sprite
 * while `options` overwrite the background position shows a slice of the sheet.
 */
function mayHaveOptions(props: AstNode) {
    return props.properties.some((property: AstNode) => {
        if (property.type === 'SpreadElement') return true;   // {...rest} could carry options
        const name = propName(property);
        return name === null || name === 'options';
    });
}

/** `{ a: '__x', sub: { b: '__y' } }` -> the same object as JavaScript source. */
function renderObject(tree: { [key: string]: any }): string {
    const entries = Object.entries(tree).map(([key, value]) =>
        `${key}: ${typeof value === 'string' ? value : renderObject(value)}`);

    return `{ ${entries.join(', ')} }`;
}

/**
 * `code` with every replacement applied. Positions all point into the original
 * `code`, so they are applied back to front: editing the end first leaves the
 * positions of everything before it untouched.
 */
function applyReplacements(code: string, replacements: Replacement[]) {
    let output = code;
    for (const { start, end, text } of [...replacements].sort((a, b) => b.start - a.start)) {
        output = output.slice(0, start) + text + output.slice(end);
    }

    return output;
}

/** Import specifier for `file`, written relative to the folder of the importing module. */
function importSpecifier(importerDir: string, file: string) {
    const relative = toPosix(path.relative(importerDir, file));
    return relative.startsWith('.') ? relative : `./${relative}`;
}

// -----------------------------------------------------------------------------
// Atlas, used by `generateBundle`
// -----------------------------------------------------------------------------

interface AtlasData {
    /**
     * The original's hashed file name, the key of its entry in `window.__GF_ATLAS__`.
     * Has to match what the Image component looks up: the last segment of its `src`.
     */
    spriteKey: string;
    file: string;
    /** The image's real size. The rect the packer places is a square around it. */
    imageWidth: number;
    imageHeight: number;
    /** Size of the standalone file this sprite replaces, for the build report. */
    bytes: number;
}

interface AtlasRect extends IRectangle {
    data: AtlasData;
}

interface AtlasSpriteData {
    image: string;
    position: string;
    size: string;
}

/** An atlas group with its patterns compiled and its config filled in from the defaults. */
interface ReadyGroup {
    name: string;
    match: (id: string) => boolean;
    config: AtlasConfig;
}

interface ViewImage {
    /** Path on disk. */
    source: string;
    /** Size of the standalone file, for the report. */
    bytes: number;
}

interface ViewData {
    /** The view's folder name, taken from its entry chunk. */
    name: string;
    /** dist name -> the image behind it. */
    images: Map<string, ViewImage>;
    /** Every module in the view's chunks, to tell which call sites the view contains. */
    moduleIds: Set<string>;
}

/**
 * What every view writes into and the cleanup after the view loop reads.
 *
 * An image lives in one shared bundle but is decided per view, so every view's
 * verdict has to be collected before anything can be deleted: dropping a file
 * one view still points at would break that view.
 */
interface BuildState {
    /** dist name -> views that atlassed it and allow the original to go. */
    atlassedIn: Map<string, Set<string>>;
    /** dist name -> views that still need the standalone file. */
    notAtlassedIn: Map<string, Set<string>>;
    /** dist name -> path on disk. Build-wide, so messages still work after the view loop. */
    imageSources: Map<string, string>;
    /** Path on disk -> image size, so an image several views reach is measured once. */
    sizes: Map<string, { width: number; height: number }>;
    /**
     * Groups whose patterns claimed at least one image somewhere, even one that was
     * then skipped - the report explains those. The rest are probably typos.
     */
    matched: Set<string>;
    skipped: SkipReport[];
    /** Packed images that a spread tag site renders - reported, never vetoed. */
    spread: SpreadReport[];
    sheets: SheetReport[];
}

/** Globs for `createFilter`. A bare folder means everything under it: `icons/hud` becomes `icons/hud/**`. */
const toPatterns = (value?: string | string[]) =>
    value === undefined ? null
        : [value].flat().map((p) => (/[*.]/.test(p) ? p : `${p.replace(/\/$/, '')}/**`));

/**
 * A group's name when it sets none: the folder part of its first pattern, so
 * `icons/hud/**` becomes `icons-hud` and `**` becomes `all`. Anything outside
 * `a-z0-9` turns into a dash, so a pattern cannot put odd characters in a file name.
 */
const defaultGroupName = (pattern: string) => {
    const head = pattern.split(/[*?[]/)[0];           // text before the first glob char
    const folder = head.slice(0, head.lastIndexOf('/')); // drop the trailing partial segment
    return folder.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'all';
};

const isPowerOfTwo = (value: number) => (value & (value - 1)) === 0;

/** Warns about groups whose sheet size cannot be honoured with `pot` on, once per build. */
function warnNonPotDimensions(atlasGroups: ReadyGroup[], warn: (message: string) => void) {
    for (const group of atlasGroups) {
        const { pot, maxWidth, maxHeight } = group.config;
        if (!pot) continue;

        for (const [label, max] of [['maxWidth', maxWidth], ['maxHeight', maxHeight]] as const) {
            if (isPowerOfTwo(max)) continue;
            const ceiling = 2 ** Math.floor(Math.log2(max));
            warn(
                `atlas "${group.name}": pot is on and ${label} is ${max}, which is not a power of two - ` +
                `sheets are capped at ${ceiling}, not ${max}.`,
            );
        }
    }
}

/** Empty build-wide state, one per build. */
function createBuildState(): BuildState {
    return {
        atlassedIn: new Map<string, Set<string>>(),
        notAtlassedIn: new Map<string, Set<string>>(),
        imageSources: new Map<string, string>(),
        sizes: new Map<string, { width: number; height: number }>(),
        matched: new Set<string>(),
        skipped: [],
        spread: [],
        sheets: [],
    };
}

/** The image's size in pixels, read once and then served from `sizes`. */
async function sizeOf(file: string, sizes: Map<string, { width: number; height: number }>) {
    let size = sizes.get(file);
    if (!size) {
        const { width, height } = await sharp(file).metadata();
        sizes.set(file, size = { width, height });
    }
    return size;
}

/**
 * The PNG for one packed bin: a transparent sheet with every sprite drawn at its
 * place. With `squareCells`, each image is centered inside its square cell.
 */
function composeSheet(bin: Bin<AtlasRect>, squareCells: boolean) {
    const parts = bin.rects.map((rect) => ({
        input: rect.data.file,
        left: squareCells ? rect.x + Math.floor((rect.width - rect.data.imageWidth) / 2) : rect.x,
        top: squareCells ? rect.y + Math.floor((rect.height - rect.data.imageHeight) / 2) : rect.y,
    }));

    return sharp({
        create: {
            width: bin.width,
            height: bin.height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite(parts)
        .png()
        .toBuffer();
}

/**
 * The CSS that shows `rect` out of `sheet`, in percentages so the sprite scales
 * with the element it is drawn into. A percentage position is measured against
 * the room the sheet has to move, which is the sheet minus the sprite.
 */
function spriteStyle(rect: AtlasRect, sheet: { width: number; height: number }, url: string): AtlasSpriteData {
    const freeX = sheet.width - rect.width;
    const freeY = sheet.height - rect.height;

    return {
        image: `url(${url})`,
        size: `${sheet.width / rect.width * 100}% ${sheet.height / rect.height * 100}%`,
        position: `${freeX ? rect.x / freeX * 100 : 0}% ${freeY ? rect.y / freeY * 100 : 0}%`,
    };
}

// -----------------------------------------------------------------------------
// Build report, printed at the end of `generateBundle`
// -----------------------------------------------------------------------------

/** One sheet that was written, as the build report needs it. */
interface SheetReport {
    view: string;
    group: string;
    /** Where the sheet was written, relative to the cwd, so the terminal can link it. */
    file: string;
    width: number;
    height: number;
    bytes: number;
    /** Bytes of the standalone files this sheet replaces. */
    originalBytes: number;
    keptOriginals: boolean;
    rects: AtlasRect[];
}

/** An image that was left alone, and why. */
interface SkipReport {
    view: string;
    name: string;
    reason: string;
}

/** An image that was packed although a tag site renders it with a spread. */
interface SpreadReport {
    view: string;
    name: string;
    group: string;
}

const byteLength = (source: string | Uint8Array) =>
    typeof source === 'string' ? Buffer.byteLength(source) : source.length;

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * What a texture costs on the GPU once decoded: every pixel is RGBA8, so the
 * transparent padding costs exactly as much as the sprites. An estimate - the
 * engine may pick another format - but the right order of magnitude, and the
 * reason `% used` matters more than the KB on disk.
 */
const vram = (width: number, height: number) => width * height * 4;

/** View names come from folder names, so they read better capitalised in a report. */
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * The build report: one line per sheet, then what was left alone and why.
 * `withSprites` adds every sprite's place on its sheet, for when one renders wrong.
 */
function renderReport(sheets: SheetReport[], skipped: SkipReport[], spread: SpreadReport[], withSprites: boolean) {
    const files = sheets.reduce((total, sheet) => total + sheet.rects.length, 0);
    const before = sheets.reduce((total, sheet) => total + sheet.originalBytes, 0);
    const after = sheets.reduce((total, sheet) => total + sheet.bytes, 0);

    const gpuBefore = sheets.reduce((total, sheet) => total +
        sheet.rects.reduce((sum, rect) => sum + vram(rect.data.imageWidth, rect.data.imageHeight), 0), 0);
    const gpuAfter = sheets.reduce((total, sheet) => total + vram(sheet.width, sheet.height), 0);

    const lines = [
        `${sheets.length} sheet(s), ${files} sprite(s)  ·  ${files} files ${kb(before)} -> ` +
        `${sheets.length} files ${kb(after)}  ·  GPU ${mb(gpuBefore)} -> ${mb(gpuAfter)}`,
        `(...) = texture memory, RGBA8 estimate - transparent padding costs the same as a sprite`,
    ];

    const views = [...new Set([...sheets, ...skipped, ...spread].map((item) => item.view))];

    for (const view of views) {
        lines.push('', capitalize(view));

        for (const sheet of sheets.filter((s) => s.view === view)) {
            const covered = sheet.rects.reduce((total, rect) => total + rect.width * rect.height, 0);
            const used = Math.round(covered / (sheet.width * sheet.height) * 100);

            const gpu = sheet.rects.reduce((total, rect) =>
                total + vram(rect.data.imageWidth, rect.data.imageHeight), 0);

            lines.push(
                `  ${sheet.group.padEnd(16)} ${`${sheet.width}x${sheet.height}`.padEnd(12)}` +
                `${`${kb(sheet.bytes)} (${mb(vram(sheet.width, sheet.height))})`.padStart(20)}   ` +
                `${String(sheet.rects.length).padStart(3)} ` +
                `${sheet.rects.length === 1 ? 'sprite ' : 'sprites'}   ` +
                `${String(used).padStart(3)}% used   was ${kb(sheet.originalBytes)} (${mb(gpu)})` +
                (sheet.keptOriginals ? '   (originals kept)' : ''),
                `    ${sheet.file}`,
            );

            if (!withSprites) continue;

            for (const rect of sheet.rects) {
                lines.push(
                    `      ${rect.data.spriteKey.padEnd(34)} ${`${rect.data.imageWidth}x${rect.data.imageHeight}`.padEnd(12)}` +
                    `at ${rect.x},${rect.y}`,
                );
            }
        }

        for (const skip of skipped.filter((s) => s.view === view)) {
            lines.push(`  skipped  ${skip.name.padEnd(34)} ${skip.reason}`);
        }

        for (const item of spread.filter((s) => s.view === view)) {
            lines.push(
                `  spread   ${item.name.padEnd(34)} packed ("${item.group}"), but rendered with {...props} - ` +
                `options passed that way break it (keepOriginals to be safe)`,
            );
        }
    }

    return lines.join('\n');
}

// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------

export default function gamefaceImages(options: ImagesPluginOptions): Plugin {
    const { assets, types, atlas, atlasDefaults } = options;
    const assetsDir = path.resolve(assets);
    const typesFile = path.resolve(types);

    const takenNames = new Set<string>();

    const atlasGroups = atlas?.map((entry, index): ReadyGroup => {
        const { include, exclude, name, ...overrides } =
            typeof entry === 'string' ? { include: entry } as AtlasGroup : entry;

        // Derived from the normalized pattern, so a bare `icons/hud` is already
        // `icons/hud/**` and keeps its last segment.
        const baseName = name ?? defaultGroupName(toPatterns(include)![0]);

        // Sheets are collected per group name, so two groups sharing one would be
        // packed together twice. The later group gets its index appended.
        let uniqueName = baseName;
        for (let n = index; takenNames.has(uniqueName); n++) uniqueName = `${baseName}-${n}`;
        takenNames.add(uniqueName);

        return {
            name: uniqueName,
            match: createFilter(toPatterns(include), toPatterns(exclude), { resolve: assetsDir }),
            config: { ...BUILT_IN_OPTIONS, ...atlasDefaults, ...overrides },
        };
    });

    // `originalFileNames` are written relative to the Vite root, not to the cwd.
    let root = process.cwd();

    /** Vite's `build.assetsDir`, where the sheets are written next to every other asset. */
    let assetsDirName = 'assets';

    /** Absolute `build.outDir`, so the report can print where each sheet landed. */
    let outDir = path.resolve('dist');

    /** `icons.gamepad.a` -> absolute path of `icons/gamepad/a.png`. */
    let images = new Map<string, string>();

    /** The short report, held until `closeBundle` so it prints after Vite's own build output. */
    let terminalReport: string | null = null;

    /**
     * Image path -> modules that render it through `Image.*`. Only these images can
     * be atlassed, because the sprite lookup lives in the Image component.
     */
    const usedViaImage = new Map<string, Set<string>>();

    /**
     * Image path -> modules that render it with `options`. `options` set
     * `background-size` and `background-position`, which is exactly what a sprite
     * needs them for, so those images cannot be atlassed. A veto rather than an
     * omission: another call site without options would otherwise put the same
     * image back into `usedViaImage`.
     */
    const usedWithOptions = new Map<string, Set<string>>();

    /**
     * Image path -> modules that render it as a tag whose props Solid did not build
     * as an object literal, which is what `{...props}` compiles to. The props cannot
     * be read, so `options` hiding in the spread go unnoticed and the image is packed
     * anyway. Recorded only so the build report can point at it.
     */
    const usedWithSpread = new Map<string, Set<string>>();

    const scan = () => images = scanImages(assetsDir);

    const writeTypes = () => writeImageTypes(images, typesFile);

    const isFolder = (key: string) => [...images.keys()].some((image) => image.startsWith(`${key}.`));

    /**
     * What a chain of names points at. An image ends the chain - anything written
     * after it is a property of the component, not part of the path.
     */
    const resolveNames = (names: string[]) => {
        for (let length = 1; length <= names.length; length++) {
            const key = names.slice(0, length).join('.');
            const file = images.get(key);
            if (file) return { key, file, length };
        }

        const key = names.join('.');
        return isFolder(key) ? { key, file: null, length: names.length } : null;
    };

    const isImageInAssets = (moduleId: string) => {
        const file = cleanUrl(moduleId);
        const relative = path.relative(assetsDir, file);
        const extension = path.extname(file).slice(1).toLowerCase();

        return !relative.startsWith('..') && !path.isAbsolute(relative) && IMAGE_EXTENSIONS.includes(extension);
    };

    /**
     * Every image from the assets folder that a view can reach, found by walking its chunk imports.
     * Dynamic imports count too, so images behind a `lazy()` component are packed into the
     * view's sheet - and, more importantly, keep their original alive if they are not.
     */
    function collectViewImages(bundle: Rollup.OutputBundle, entry: Rollup.OutputChunk): ViewData {
        const viewImages = new Map<string, ViewImage>();
        const seen = new Set<string>();
        const moduleIds = new Set<string>();

        const visit = (fileName: string) => {
            const chunk = bundle[fileName];
            if (seen.has(fileName) || chunk?.type !== 'chunk') return;
            seen.add(fileName);

            chunk.moduleIds.forEach((id) => moduleIds.add(id));

            for (const asset of chunk.viteMetadata?.importedAssets ?? []) {
                const output = bundle[asset];
                if (output?.type !== 'asset' || !output.originalFileNames[0]) continue;

                const source = path.resolve(root, output.originalFileNames[0]);
                if (!isImageInAssets(source)) continue;

                viewImages.set(asset, { source, bytes: byteLength(output.source) });
            }

            [...chunk.imports, ...chunk.dynamicImports].forEach(visit);
        };

        visit(entry.fileName);

        return {
            images: viewImages,
            moduleIds,
            name: entry.name.split('/')[0],
        };
    }

    /**
     * The view's images that go on a sheet, as packer rects per group name. Every
     * image left out is recorded in `state` with the reason why.
     */
    async function groupViewImages(view: ViewData, state: BuildState) {
        const byGroup = new Map<string, AtlasRect[]>();

        for (const [fileName, { source, bytes }] of view.images) {
            const name = path.basename(source);

            /** Keeps this image as a standalone file in this view, with the reason for the report. */
            const skip = (reason: string) => {
                state.skipped.push({ view: view.name, name, reason });
                addTo(state.notAtlassedIn, fileName, view.name);
            };

            const group = atlasGroups!.find(g => g.match(source));

            if (!group) {
                skip('matched no group');
                continue;
            }

            // The patterns claimed an image, so they are not a typo, even if the
            // checks below keep it off the sheet.
            state.matched.add(group.name);

            // Checked before `usedViaImage`, so one call site passing `options`
            // keeps the image out of the sheet even when another renders it plainly.
            const withOptions = usedWithOptions.get(source);

            if (withOptions && [...withOptions].some((id) => view.moduleIds.has(id))) {
                skip(`used with options ("${group.name}")`);
                continue;
            }

            const registeredBy = usedViaImage.get(source);

            if (!registeredBy || ![...registeredBy].some((id) => view.moduleIds.has(id))) {
                skip(`imported directly, not written as Image.* ("${group.name}")`);
                continue;
            }

            const { maxSpriteSize, squareCells } = group.config;
            const { width, height } = await sizeOf(source, state.sizes);

            if (width > maxSpriteSize || height > maxSpriteSize) {
                skip(`${width}x${height} > maxSpriteSize ${maxSpriteSize} ("${group.name}")`);
                continue;
            }

            // Each image gets a square cell, so stretching the cell into a square
            // element looks like `contain` + center instead of squashing the image.
            const side = Math.max(width, height);

            const rect = {
                width: squareCells ? side : width,
                height: squareCells ? side : height,
                x: 0, // will be set by the packer later
                y: 0, // will be set by the packer later
                data: {
                    spriteKey: fileName.split('/').pop()!,
                    file: source,
                    imageWidth: width,
                    imageHeight: height,
                    bytes,
                },
            };

            // Packed regardless - the props of a spread tag site cannot be read, so
            // vetoing here would cost every such image its sprite. With `keepOriginals`
            // the original still ships, so there is nothing to warn about.
            const withSpread = usedWithSpread.get(source);

            if (withSpread && !group.config.keepOriginals && [...withSpread].some((id) => view.moduleIds.has(id))) {
                state.spread.push({ view: view.name, name, group: group.name });
            }

            const items = byGroup.get(group.name) ?? [];
            items.push(rect); 
            byGroup.set(group.name, items);
            if (!group.config.keepOriginals) addTo(state.atlassedIn, fileName, view.name);
        }

        return byGroup;
    }

    /**
     * Packs each group's rects into sheets and emits them as PNGs. Returns the
     * sprite table the view's entry is given: dist name -> the CSS that shows it.
     */
    async function emitSheets(
        context: Rollup.PluginContext,
        entry: Rollup.OutputChunk,
        view: ViewData,
        byGroup: Map<string, AtlasRect[]>,
        state: BuildState,
    ) {
        const sprites: Record<string, AtlasSpriteData> = {};

        for (const group of atlasGroups!) {
            const atlasItems = byGroup.get(group.name) ?? [];
            if (atlasItems.length === 0) continue;

            const { maxWidth, maxHeight, padding, pot, squareCells } = group.config;
            const packer = new MaxRectsPacker<AtlasRect>(maxWidth, maxHeight, padding, { pot });
            packer.addArray(atlasItems);

            for (const [index, bin] of packer.bins.entries()) {
                // The group name, with the bin index only when the group needed more than one sheet.
                const sheetName = packer.bins.length > 1 ? `${group.name}-${index}` : group.name;
                const buffer = await composeSheet(bin, squareCells);

                // Emitted under `fileName` rather than `name`, so Rollup writes it exactly
                // here and adds no hash: the integration registers sheets by path to preload
                // them, and a hash that changes with the sheet's content would leave that
                // registration pointing at nothing. `fileName` also skips the pattern that
                // puts assets in `assetsDir`, so the folder is added here instead.
                const sheetFile = path.posix.join(assetsDirName, `atlas-${view.name}-${sheetName}.png`);
                context.emitFile({ type: 'asset', fileName: sheetFile, source: buffer });

                const atlasUrl = path.posix.relative(path.posix.dirname(entry.fileName), sheetFile);

                for (const rect of bin.rects) {
                    sprites[rect.data.spriteKey] = spriteStyle(rect, bin, atlasUrl);
                }

                state.sheets.push({
                    view: view.name,
                    group: sheetName,
                    file: toPosix(path.relative(process.cwd(), path.resolve(outDir, sheetFile))),
                    width: bin.width,
                    height: bin.height,
                    bytes: buffer.length,
                    originalBytes: bin.rects.reduce((total, rect) => total + rect.data.bytes, 0),
                    keptOriginals: group.config.keepOriginals,
                    rects: bin.rects,
                });
            }
        }

        return sprites;
    }

    /**
     * Deletes each atlassed original that no view still needs as a standalone
     * file, and warns about the ones that have to ship next to their sprite.
     */
    function dropAtlassedOriginals(bundle: Rollup.OutputBundle, state: BuildState, warn: (message: string) => void) {
        for (const [fileName, atlasViews] of state.atlassedIn) {
            const loose = state.notAtlassedIn.get(fileName);
            if (!loose) {
                delete bundle[fileName];
                continue;
            }

            const name = path.relative(assetsDir, state.imageSources.get(fileName) ?? fileName);
            const list = (views: Set<string>) => [...views].map((view) => `"${capitalize(view)}"`).join(', ');

            warn(
                `${toPosix(name)} is atlassed in ${list(atlasViews)} but used outside Image in ` +
                `${list(loose)} - shipping both. Use Image there, or exclude it from the atlas.`,
            );
        }
    }

    return {
        name: 'gameface-images',
        // Runs after esbuild and Solid, so every module is plain JavaScript that
        // `this.parse` understands and `<Image.a.b />` has become `Image.a.b`.
        enforce: 'post',

        configResolved(config) {
            root = config.root;
            assetsDirName = config.build.assetsDir;
            outDir = path.resolve(config.root, config.build.outDir);
        },

        buildStart() {
            scan();
            writeTypes();
        },

        configureServer(server) {
            // The Vite root is the views folder, so the assets folder is not watched by default.
            server.watcher.add(assetsDir);

            const onAddOrRemove = (file: string) => {
                if (!isImageInAssets(file)) return;

                // A badly named image must not take the dev server down with it.
                try {
                    scan();
                    writeTypes();
                } catch (error) {
                    server.config.logger.error(String(error));
                }
            };

            server.watcher.on('add', onAddOrRemove);
            server.watcher.on('unlink', onAddOrRemove);
        },

        transform(code, id) {
            const file = cleanUrl(id);
            if (id.startsWith('\0') || file.includes('/node_modules/') || !SCRIPT_FILE.test(file)) return null;
            if (!code.includes(COMPONENT_PATH)) return null;

            const program = this.parse(code) as unknown as AstNode;
            const local = findImageImport(program);
            if (!local) return null;

            const importerDir = path.dirname(file);
            const imports: string[] = [];
            const declarations: string[] = [];
            const replacements: Replacement[] = [];

            /** Absolute image path -> name of its import in this module. */
            const importNames = new Map<string, string>();
            /** Image or folder key -> name of the constant holding it in this module. */
            const valueNames = new Map<string, string>();
            /** Inner member expressions of chains already replaced. */
            const handled = new Set<AstNode>();

            /** Name of the import holding the URL of `imageFile` in this module. */
            const importImage = (imageFile: string) => {
                let name = importNames.get(imageFile);
                if (!name) {
                    name = `__imageSrc${importNames.size}`;
                    imports.push(`import ${name} from '${importSpecifier(importerDir, imageFile)}';`);
                    importNames.set(imageFile, name);
                    addTo(usedViaImage, imageFile, id);
                }

                return name;
            };

            /** Set once any chain needs `wrapImage`, so the header defines `__withSrc`. */
            let usesWrapper = false;

            /** A component rendering `imageFile`, for the places that need a component rather than a call. */
            const wrapImage = (imageFile: string) => {
                usesWrapper = true;
                // Marked pure so Rollup can still drop it if the code that uses it is dropped.
                return `/*#__PURE__*/ __withSrc(${importImage(imageFile)})`;
            };

            /** Every image under `folderKey`, nested the same way as the folders. */
            const folderObject = (folderKey: string) => {
                const tree: { [key: string]: any } = {};

                for (const [key, imageFile] of images) {
                    if (!key.startsWith(`${folderKey}.`)) continue;

                    const parts = key.slice(folderKey.length + 1).split('.');
                    const name = parts.pop()!;

                    let level = tree;
                    for (const part of parts) level = level[part] ??= {};
                    level[name] = wrapImage(imageFile);
                }

                return renderObject(tree);
            };

            walk(program, (node, parent) => {
                if (node.type !== 'MemberExpression' || handled.has(node)) return;

                const chain = readChain(node, local);
                if (!chain) return;
                chain.members.forEach((member) => handled.add(member));

                // Rescans on a miss, so images added while the dev server runs are picked up.
                let target = resolveNames(chain.names);
                if (!target) {
                    scan();
                    target = resolveNames(chain.names);
                }

                if (!target) {
                    return this.error(`${local}.${chain.names.join('.')} has no matching image or folder in ${assetsDir}.`, chain.start);
                }

                const end = chain.ends[target.length - 1];
                const isTagSite = !!target.file && isComponentTagSite(node, parent);
                const props = isTagSite ? propsOfComponentCall(node, parent) : null;

                // Rendered right here, so the component stays `Image` and `src` joins
                // the props Solid already wrote. No wrapper and no merging at runtime.
                if (props) {
                    // Recorded alongside the normal import - `generateBundle` checks this
                    // first, so one call site with options keeps the image out of the sheet.
                    if (mayHaveOptions(props)) addTo(usedWithOptions, target.file!, id);

                    replacements.push({ start: chain.start, end, text: local });
                    replacements.push({ start: props.start + 1, end: props.start + 1, text: ` src: ${importImage(target.file!)},` });
                    return;
                }

                // A tag site all the same, but with props built from a spread. It takes
                // the value path below; the report flags it, since `options` could be in
                // there and nothing here can tell.
                if (isTagSite) addTo(usedWithSpread, target.file!, id);

                // Handed out as a value instead - a map entry, a `Dynamic`, a folder.
                let name = valueNames.get(target.key);
                if (!name) {
                    name = `__image${valueNames.size}`;
                    declarations.push(`const ${name} = ${target.file ? wrapImage(target.file) : folderObject(target.key)};`);
                    valueNames.set(target.key, name);
                }

                replacements.push({ start: chain.start, end, text: name });
            });

            if (replacements.length === 0) return null;

            const output = applyReplacements(code, replacements);

            const header = [
                ...imports,
                ...(usesWrapper ? [
                    `import { createComponent as __createComponent, mergeProps as __mergeProps } from 'solid-js';`,
                    `const __withSrc = (src) => (props) => __createComponent(${local}, __mergeProps(props, { src }));`,
                ] : []),
                ...declarations,
            ];

            // Everything added sits on the first line and replacements never add
            // lines, so `map: null` keeps the previous source map's lines valid.
            return { code: `${header.join(' ')} ${output}`, map: null };
        },

        async generateBundle(_, bundle) {
            // Skip processing if there are no atlas groups defined.
            if (!atlasGroups) return;

            // Config that cannot do what it says, reported once rather than per view.
            warnNonPotDimensions(atlasGroups, (message) => this.warn(message));
            const state = createBuildState();

            // For every view
            for (const entry of Object.values(bundle)) {
                if (entry.type !== 'chunk' || !entry.isEntry) continue;

                const view = collectViewImages(bundle, entry);
                view.images.forEach(({ source }, fileName) => state.imageSources.set(fileName, source));

                const byGroup = await groupViewImages(view, state);
                const sprites = await emitSheets(this, entry, view, byGroup, state);

                entry.code = `window.__GF_ATLAS__ = ${JSON.stringify(sprites)};\n` + entry.code;
            }

            // An atlassed original can only go once *every* view that reaches it
            // atlassed it. One view using it outside `Image` keeps the file alive for
            // all of them - the sprite still works, the raw image just ships as well.
            dropAtlassedOriginals(bundle, state, (message) => this.warn(message));

            for (const group of atlasGroups) {
                if (state.matched.has(group.name)) continue;
                this.warn(`atlas "${group.name}" matched no image in any view - check its include/exclude patterns.`);
            }

            if (state.sheets.length) {
                // The file has every sprite's place; the terminal gets the summary and a link to it.
                const reportFile = 'atlas-report.txt';
                this.emitFile({
                    type: 'asset',
                    fileName: reportFile,
                    source: renderReport(state.sheets, state.skipped, state.spread, true),
                });

                const reportPath = toPosix(path.relative(process.cwd(), path.resolve(outDir, reportFile)));
                terminalReport = `${renderReport(state.sheets, state.skipped, state.spread, false)}\n\nFull report: ${reportPath}`;
            }
        },

        // Runs after Vite has listed the written files and logged "built in", so the report is the last thing
        // printed. Also runs on a failed build and when the dev server closes, hence the guard.
        closeBundle() {
            if (!terminalReport) return;

            this.info(`\n${terminalReport}\n`);
            terminalReport = null;
        },
    };
}
