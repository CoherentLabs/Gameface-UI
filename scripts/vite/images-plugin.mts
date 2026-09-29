import path from 'node:path';
import { createFilter, type Plugin } from 'vite';
import { IMAGE_EXTENSIONS, scanImages, writeImageTypes } from '../images/image-types.mjs';
import { MaxRectsPacker } from 'maxrects-packer';
import type { IRectangle } from 'maxrects-packer';
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
    /** List of folders to include in the atlas. */
    atlas?: (string | AtlasGroup)[];
    atlasDefaults?: Partial<AtlasConfig>;
    /** Adds every sprite's place on its sheet to the build report. */
    verbose?: boolean;
}

interface AtlasGroup extends Partial<AtlasConfig> {
    include: string | string[];
    exclude?: string | string[];
    name?: string;          // sheet file name; defaults to the group index
}

interface AtlasConfig {
    maxWidth: PotSize;       // 2048
    maxHeight: PotSize;      // 2048
    padding: number;        // 2
    pot: boolean;           // false
    squareCells: boolean;   // the contain/center behaviour
    maxSpriteSize: PotSize;  // bigger than this -> not atlassed
    keepOriginals: boolean; // whether to keep original images in the bundle
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
}

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
 * The props object of `createComponent(Image.a.b, { class: 'big' })` when `node`
 * is the component argument, so `src` can be written straight into it. Solid
 * imports `createComponent` under a prefixed name, hence the loose match.
 */
function propsOfComponentCall(node: AstNode, parent: AstNode | null) {
    if (parent?.type !== 'CallExpression' || parent.arguments[0] !== node) return null;
    if (parent.callee.type !== 'Identifier' || !parent.callee.name.endsWith('createComponent')) return null;

    const props = parent.arguments[1];
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
    name: string;
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

const toPatterns = (value?: string | string[]) =>
    value === undefined ? null
        : [value].flat().map((p) => (/[*.]/.test(p) ? p : `${p.replace(/\/$/, '')}/**`));

const derive = (pattern: string) => {
    const head = pattern.split(/[*?[]/)[0];        // text before the first glob char
    return head.slice(0, head.lastIndexOf('/'))    // drop the trailing partial segment
               .replace(/\//g, '-') || 'all';
};

const isPowerOfTwo = (value: number) => (value & (value - 1)) === 0;

// -----------------------------------------------------------------------------
// Build report, printed at the end of `generateBundle`
// -----------------------------------------------------------------------------

/** One sheet that was written, as the build report needs it. */
interface SheetReport {
    view: string;
    group: string;
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
 * `verbose` adds every sprite's place on its sheet, for when one renders wrong.
 */
function renderReport(sheets: SheetReport[], skipped: SkipReport[], verbose: boolean) {
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

    const views = [...new Set([...sheets, ...skipped].map((item) => item.view))];

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
            );

            if (!verbose) continue;

            for (const rect of sheet.rects) {
                lines.push(
                    `      ${rect.data.name.padEnd(34)} ${`${rect.data.imageWidth}x${rect.data.imageHeight}`.padEnd(12)}` +
                    `at ${rect.x},${rect.y}`,
                );
            }
        }

        for (const skip of skipped.filter((s) => s.view === view)) {
            lines.push(`  skipped  ${skip.name.padEnd(34)} ${skip.reason}`);
        }
    }

    return lines.join('\n');
}

// -----------------------------------------------------------------------------
// Plugin
// -----------------------------------------------------------------------------

export default function gamefaceImages(options: ImagesPluginOptions): Plugin {
    const { assets, types, atlas, atlasDefaults, verbose = false } = options;
    const assetsDir = path.resolve(assets);
    const typesFile = path.resolve(types);

    const atlasGroups = atlas?.map((entry, index) => {
        const { include, exclude, name, ...overrides } = 
            typeof entry === 'string' 
            ? { include: entry } as AtlasGroup 
            : entry;

        return {
            // Derived from the normalized pattern, so a bare `icons/hud` is already
            // `icons/hud/**` and keeps its last segment.
            name: name ?? derive(toPatterns(include)![0]),
            match: createFilter(toPatterns(include), toPatterns(exclude), { resolve: assetsDir }),
            config: { ...BUILT_IN_OPTIONS, ...atlasDefaults, ...overrides },
        };
    });

    // `originalFileNames` are written relative to the Vite root, not to the cwd.
    let root = process.cwd();

    /** `icons.gamepad.a` -> absolute path of `icons/gamepad/a.png`. */
    let images = new Map<string, string>();

    /** Images that pass through the Image component pipeline recorded for later atlassing */
    // Map<imageAbsPath, Set<moduleId>
    const pipelineImages = new Map<string, Set<string>>();

    /**
     * Images rendered with `options` somewhere. `options` set `background-size` and
     * `background-position`, which is exactly what a sprite needs them for, so those
     * images cannot be atlassed. A veto rather than an omission: another call site
     * without options would otherwise put the same image back into `pipelineImages`.
     */
    // Map<imageAbsPath, Set<moduleId>>
    const optionsImages = new Map<string, Set<string>>();

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

    return {
        name: 'gameface-images',
        // Runs after esbuild and Solid, so every module is plain JavaScript that
        // `this.parse` understands and `<Image.a.b />` has become `Image.a.b`.
        enforce: 'post',

        configResolved(config) {
            root = config.root;
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

                    if (pipelineImages.has(imageFile)) {
                        pipelineImages.get(imageFile)!.add(id);
                    } else {
                        pipelineImages.set(imageFile, new Set([id]));
                    }
                }

                return name;
            };

            /** A component rendering `imageFile`, for the places that need a component rather than a call. */
            let usesWrapper = false;
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
                const props = target.file && propsOfComponentCall(node, parent);

                // Rendered right here, so the component stays `Image` and `src` joins
                // the props Solid already wrote. No wrapper and no merging at runtime.
                if (props) {
                    // Recorded alongside the normal import - `generateBundle` checks this
                    // first, so one call site with options keeps the image out of the sheet.
                    if (mayHaveOptions(props)) addTo(optionsImages, target.file!, id);

                    replacements.push({ start: chain.start, end, text: local });
                    replacements.push({ start: props.start + 1, end: props.start + 1, text: ` src: ${importImage(target.file!)},` });
                    return;
                }

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

            // An image lives in one shared bundle but is decided per view, so both
            // sides have to be collected before anything can be deleted:
            // dropping a file one view still points at would break that view.

            /** dist name -> views that atlassed it and allow the original to go. */
            const atlassedIn = new Map<string, Set<string>>();
            /** dist name -> views that still need the standalone file. */
            const notAtlassedIn = new Map<string, Set<string>>();
            /** dist name -> path on disk. Build-wide, so messages still work after the view loop. */
            const imageSources = new Map<string, string>();

            const sizes = new Map<string, { width: number; height: number }>();

            const sheets: SheetReport[] = [];
            const skipped: SkipReport[] = [];
            /** Groups that claimed at least one image somewhere - the rest are probably typos. */
            const matched = new Set<string>();

            // Config that cannot do what it says, reported once rather than per view.
            for (const group of atlasGroups) {
                const { pot, maxWidth, maxHeight } = group.config;
                if (!pot) continue;

                for (const [label, max] of [['maxWidth', maxWidth], ['maxHeight', maxHeight]] as const) {
                    if (isPowerOfTwo(max)) continue;
                    const ceiling = 2 ** Math.floor(Math.log2(max));
                    this.warn(
                        `atlas "${group.name}": pot is on and ${label} is ${max}, which is not a power of two - ` +
                        `sheets are capped at ${ceiling}, not ${max}.`,
                    );
                }
            }

            const sizeOf = async (file: string) => {
                let size = sizes.get(file);
                if (!size) {
                    const { width, height } = await sharp(file).metadata();
                    sizes.set(file, size = { width, height });
                }
                return size;
            };

            for (const entry of Object.values(bundle)) {
                if (entry.type !== 'chunk' || !entry.isEntry) continue;

                /** dist names of every image this view can reach. Paths live in `imageSources`. */
                const viewImages = new Set<string>();
                const seen = new Set<string>();
                const moduleIds = new Set<string>();

                const visit = (fileName: string) => {
                    const chunk = bundle[fileName];
                    if (seen.has(fileName) || chunk?.type !== 'chunk') return;
                    seen.add(fileName);

                    chunk.moduleIds.forEach((id) => moduleIds.add(id));

                    for (const asset of chunk.viteMetadata?.importedAssets ?? []) {
                        const original = (bundle[asset] as { originalFileNames?: string[] })?.originalFileNames?.[0];
                        if (!original) continue;

                        const source = path.resolve(root, original);
                        if (!isImageInAssets(source)) continue;

                        viewImages.add(asset);
                        imageSources.set(asset, source);
                    }

                    chunk.imports.forEach(visit);
                };

                visit(entry.fileName);

                const sprites: Record<string, AtlasSpriteData> = {};
                const byGroup = new Map<string, AtlasRect[]>();

                const viewName = entry.name.split('/')[0];

                for (const fileName of viewImages) {
                    const source = imageSources.get(fileName)!;
                    const name = path.basename(source);
                    const group = atlasGroups.find(g => g.match(source));
    
                    if (!group) {
                        skipped.push({ view: viewName, name, reason: 'matched no group' });
                        addTo(notAtlassedIn, fileName, viewName);
                        continue;
                    }

                    // Checked before the pipeline test, so one call site passing `options`
                    // keeps the image out of the sheet even when another renders it plainly.
                    const withOptions = optionsImages.get(source);

                    if (withOptions && [...withOptions].some((id) => moduleIds.has(id))) {
                        skipped.push({ view: viewName, name, reason: `used with options ("${group.name}")` });
                        addTo(notAtlassedIn, fileName, viewName);
                        continue;
                    }

                    const registeredBy = pipelineImages.get(source);

                    if (!registeredBy || ![...registeredBy].some((id) => moduleIds.has(id))) {
                        skipped.push({ view: viewName, name, reason: `imported directly, not written as Image.* ("${group.name}")` });
                        addTo(notAtlassedIn, fileName, viewName);
                        continue;
                    }
                    
                    matched.add(group.name);

                    const { maxSpriteSize, squareCells } = group.config;
                    const {width, height} = await sizeOf(source);
                    
                    // Image dimensions exceed max sprite size -> exclude
                    if (width > maxSpriteSize || height > maxSpriteSize) {
                        skipped.push({
                            view: viewName,
                            name,
                            reason: `${width}x${height} > maxSpriteSize ${maxSpriteSize} ("${group.name}")`,
                        });
                        addTo(notAtlassedIn, fileName, viewName);
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
                            name: fileName.split('/').pop()!,
                            file: source,
                            imageWidth: width,
                            imageHeight: height,
                            bytes: byteLength((bundle[fileName] as { source: string | Uint8Array }).source),
                        },
                    };

                    const items = byGroup.get(group.name) ?? [];
                    items.push(rect); 
                    byGroup.set(group.name, items);
                    if (!group.config.keepOriginals) addTo(atlassedIn, fileName, viewName);
                }

                for (const group of atlasGroups) {
                    const atlasItems = byGroup.get(group.name) ?? [];
                    if (atlasItems.length === 0) continue;

                    const { maxWidth, maxHeight, padding, pot, squareCells } = group.config;
                    const packer = new MaxRectsPacker<AtlasRect>(maxWidth, maxHeight, padding, {pot});
                    packer.addArray(atlasItems);
                
                    for (const bin of packer.bins) {
                        const parts = bin.rects.map((rect) => ({
                            input: rect.data.file,
                            // Centered inside its square cell if squareCells is true.
                            left: squareCells ? rect.x + Math.floor((rect.width - rect.data.imageWidth) / 2) : rect.x,
                            top: squareCells ? rect.y + Math.floor((rect.height - rect.data.imageHeight) / 2) : rect.y,
                        }));
                    
                        const buffer = await sharp({ 
                            create: { 
                                width: bin.width, 
                                height: bin.height, 
                                channels: 4,
                                background: { r: 0, g: 0, b: 0, alpha: 0 } 
                            }
                        })
                        .composite(parts)
                        .png()
                        .toBuffer();

                        const binIndex = packer.bins.length > 1 ? packer.bins.indexOf(bin) : undefined;
                        // atlas-{view}-{group}[-{bin}]-{hash}.png
                        const atlasName = 
                            `atlas-${viewName}-${group.name}${binIndex === undefined ?  '' : `-${binIndex}`}.png`;

                        const ref = this.emitFile({
                            type: 'asset',
                            name: atlasName,
                            source: buffer,
                        });

                        const atlasFile = this.getFileName(ref);
                        const atlasUrl = path.posix.relative(path.posix.dirname(entry.fileName), atlasFile); 
                    
                        // and remember where each one landed, for the CSS later
                        for (const rect of bin.rects) {
                            const atlasW = bin.width;
                            const atlasH = bin.height;
                            const freeX = atlasW - rect.width, freeY = atlasH - rect.height;

                            sprites[rect.data.name] = { 
                                image: `url(${atlasUrl})`,
                                size: `${atlasW / rect.width * 100}% ${atlasH / rect.height * 100}%`,
                                position: `${freeX ? rect.x / freeX * 100 : 0}% ${freeY ? rect.y / freeY * 100 : 0}%`,
                            };
                        }

                        sheets.push({
                            view: viewName,
                            group: group.name + (binIndex === undefined ? '' : `-${binIndex}`),
                            width: bin.width,
                            height: bin.height,
                            bytes: buffer.length,
                            originalBytes: bin.rects.reduce((total, rect) => total + rect.data.bytes, 0),
                            keptOriginals: group.config.keepOriginals,
                            rects: bin.rects,
                        });
                    }

                }
                entry.code = `window.__GF_ATLAS__ = ${JSON.stringify(sprites)};\n` + entry.code;
            }
            
            // An atlassed original can only go once *every* view that reaches it
            // atlassed it. One view using it outside `Image` keeps the file alive for
            // all of them - the sprite still works, the raw image just ships as well.
            for (const [fileName, atlasViews] of atlassedIn) {
                const loose = notAtlassedIn.get(fileName);
                if (!loose) {
                    delete bundle[fileName];
                    continue;
                }

                const name = path.relative(assetsDir, imageSources.get(fileName) ?? fileName);
                const list = (views: Set<string>) => [...views].map((view) => `"${capitalize(view)}"`).join(', ');

                this.warn(
                    `${toPosix(name)} is atlassed in ${list(atlasViews)} but used outside Image in ` +
                    `${list(loose)} - shipping both. Use Image there, or exclude it from the atlas.`,
                );
            }

            for (const group of atlasGroups) {
                if (matched.has(group.name)) continue;
                this.warn(`atlas "${group.name}" matched no image in any view - check its include/exclude patterns.`);
            }

            if (sheets.length) this.info(`\n${renderReport(sheets, skipped, verbose)}\n`);
        },
    };
}
