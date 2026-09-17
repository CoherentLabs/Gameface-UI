import path from 'node:path';
import type { Plugin } from 'vite';
import { IMAGE_EXTENSIONS, scanImages, writeImageTypes } from './image-types.mjs';

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
 * The folder scan comes from `image-types.mjs` next to this file, which also writes the
 * `Image.<folder>.<image>` types, so the editor and the rewrite always agree on
 * which keys exist. The plugin keeps those types fresh while Vite runs;
 * `npm run gen-images` writes them without it.
 */

const SCRIPT_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/;

/** Import specifiers that point at the Image component, with or without an extension. */
const IMAGE_COMPONENT = /(?:^|\/)Media\/Image\/Image(?:\.[jt]sx?)?$/;

const toPosix = (value: string) => value.replace(/\\/g, '/');

const cleanUrl = (url: string) => url.replace(/[?#].*$/, '');

/** Import specifier for `file`, written relative to the folder of the importing module. */
function importSpecifier(importerDir: string, file: string) {
    const relative = toPosix(path.relative(importerDir, file));
    return relative.startsWith('.') ? relative : `./${relative}`;
}

/** The parts of the ESTree nodes from `this.parse` that this plugin reads. */
interface AstNode {
    type: string;
    start: number;
    end: number;
    [key: string]: any;
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

/** Local name of `import Image from '.../Media/Image/Image'`, or null when the module does not import it. */
function findImageImport(program: AstNode) {
    for (const statement of program.body) {
        if (statement.type !== 'ImportDeclaration' || !IMAGE_COMPONENT.test(statement.source.value)) continue;

        const specifier = statement.specifiers.find((s: AstNode) => s.type === 'ImportDefaultSpecifier');
        if (specifier) return specifier.local.name as string;
    }

    return null;
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

/** `{ a: '__x', sub: { b: '__y' } }` -> the same object as JavaScript source. */
function renderObject(tree: { [key: string]: any }): string {
    const entries = Object.entries(tree).map(([key, value]) =>
        `${key}: ${typeof value === 'string' ? value : renderObject(value)}`);

    return `{ ${entries.join(', ')} }`;
}

export interface ImagesPluginOptions {
    /** Folder whose images are exposed on `Image`, relative to the project root or absolute. */
    assets: string;
    /** File the `ImageTree` types are written to, relative to the project root or absolute. */
    types: string;
}

export default function gamefaceImages({ assets, types }: ImagesPluginOptions): Plugin {
    const assetsDir = path.resolve(assets);
    const typesFile = path.resolve(types);

    /** `icons.gamepad.a` -> absolute path of `icons/gamepad/a.png`. */
    let images = new Map<string, string>();

    const scan = () => {
        images = scanImages(assetsDir);
    };

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

    // `originalFileNames` are written relative to the Vite root, not to the cwd.
    let root = process.cwd();

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
            if (!code.includes('Media/Image/Image')) return null;

            const program = this.parse(code) as unknown as AstNode;
            const local = findImageImport(program);
            if (!local) return null;

            const importerDir = path.dirname(file);
            const imports: string[] = [];
            const declarations: string[] = [];
            const replacements: { start: number; end: number; text: string }[] = [];

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

            // Back to front, so the positions of the replacements still to come stay valid.
            let output = code;
            for (const { start, end, text } of replacements.sort((a, b) => b.start - a.start)) {
                output = output.slice(0, start) + text + output.slice(end);
            }

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

        generateBundle(_, bundle) {
            for (const entry of Object.values(bundle)) {
                if (entry.type !== 'chunk' || !entry.isEntry) continue;

                // Images this view can still show: those referenced by its own chunk
                // and by every shared chunk it imports, after Rollup dropped the rest.
                // Keyed by the emitted file name, which is what the component sees in
                // `src`, and pointing at the file on disk, which is what a packer reads.
                const used = new Map<string, string>();
                const seen = new Set<string>();

                const visit = (fileName: string) => {
                    const chunk = bundle[fileName];
                    if (seen.has(fileName) || chunk?.type !== 'chunk') return;
                    seen.add(fileName);

                    for (const asset of chunk.viteMetadata?.importedAssets ?? []) {
                        const original = (bundle[asset] as { originalFileNames?: string[] })?.originalFileNames?.[0];
                        if (!original) continue;

                        const source = path.resolve(root, original);
                        if (isImageInAssets(source)) used.set(asset, source);
                    }

                    chunk.imports.forEach(visit);
                };

                visit(entry.fileName);

                console.log(`\n🖼️  ${entry.name} uses ${used.size} image(s)`);
                used.forEach((source) => console.log(`   ${toPosix(path.relative(assetsDir, source))}`));

                // ask claudi what the fuk is happening here and try to plug in the atlas yourself
            }
        },
    };
}
