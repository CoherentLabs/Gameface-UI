import fs from 'node:fs';
import ts from 'typescript';
import path from 'node:path';
import crypto from 'node:crypto';

interface Manifest {
    name: string,
    version?: string,
    description?: string
    kind: 'component' | 'lib' | 'recipe',
    'explicit-dependency'?: string[],
}

interface ComponentData extends Partial<Manifest> {
    kind: 'component' | 'lib' | 'recipe';
    files: { path: string; hash: string }[];
    category?: string;
    dependsOn?: string[];
    npmDependencies?: string[];
}

const ROOT = path.join(import.meta.dirname, '..');
const COMPONENTS_PATH = path.join(ROOT, 'src', 'components');
const RECIPE_PATH = path.join(ROOT, 'src', 'recipes');
const GITIGNORE_PATH = path.join(ROOT, '.gitignore');
const gitIgnoreContent = fs.readFileSync(GITIGNORE_PATH, 'utf-8')
    .split(/\r?\n/)          // handle CRLF and LF
    .map(l => l.trim())      // kill stray \r / whitespace
    .filter(l => l && !l.startsWith('#'));

// Only these file types can carry import declarations worth scanning.
const SCAN_EXT = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs']);

const getRelativeFilePath = (item: fs.Dirent<string>) => {
    return path.join(path.relative(ROOT, item.parentPath), item.name).replace(/\\/g, '/');
};

const hashFile = (filePath: string) => {
    const contents = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(contents).digest('hex');

    return hash;
}

const hasManifest = (folderPath: string): boolean => {
    return fs.existsSync(path.join(folderPath, 'manifest.json'));
};

const getComponentId = (folderPath: string, isRecipe: boolean = false) => {
    return path
        .join(
            path.relative(isRecipe ? RECIPE_PATH : COMPONENTS_PATH, path.dirname(folderPath)),
            path.basename(folderPath))
        .replace(/\\/g, '/');
}

const shouldExcludeGitIgnoredFile = (filePath: string) => {
    if (gitIgnoreContent.length === 0) {
        console.log(`⚠ .gitignore file not found at ${GITIGNORE_PATH}. Skipping gitignore check.`);
        return false;
    }

    return existsInGitIgnore(filePath);
}

const existsInGitIgnore = (filePath: string) => gitIgnoreContent.some(pattern => filePath.startsWith(pattern));

const populateFilesArray = (file: fs.Dirent<string>, files: { path: string; hash: string }[]) => {
    const relativeFilePath = getRelativeFilePath(file);
    if (shouldExcludeGitIgnoredFile(relativeFilePath)) return; // Check if the file is git-ignored and skip if necessary
    const hash = hashFile(path.join(file.parentPath, file.name));

    files.push({ path: relativeFilePath, hash });
}

const walk = (folderPath: string) => {
    // COMPONENT: collect its files, emit one entry, then STOP.
    if (hasManifest(folderPath)) {
        const isRecipe = folderPath.startsWith(RECIPE_PATH);
        const id = getComponentId(folderPath, isRecipe);
        let manifest;

        let files: { path: string; hash: string }[] = [];
        //Basic/Accordion/Accordion.module.scss
        for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
            if (entry.name === 'manifest.json') {
                manifest = JSON.parse(fs.readFileSync(path.join(folderPath, entry.name), 'utf-8')) as Manifest;
                continue;
            }

            // Nested directories: like Keybinds/utils
            if (entry.isDirectory()) {
                fs.readdirSync(path.join(entry.parentPath, entry.name), { withFileTypes: true, recursive: true }).forEach((file) => {
                    if (file.isDirectory()) return; // Skip directories, we only want files

                    populateFilesArray(file, files);
                })
                continue
            }

            populateFilesArray(entry, files);
        }

        // Pull in explicitly-declared external files (e.g. Icon's gen-icons script).
        // Delivered with the entry but flagged so the import scanner skips them.
        for (const dep of (manifest?.['explicit-dependency'] ?? [])) {
            const absDep = path.join(ROOT, dep);
            if (fs.statSync(absDep).isDirectory()) {
                fs.readdirSync(absDep, { withFileTypes: true, recursive: true }).forEach((file) => {
                    if (file.isDirectory()) return;
                    const rel = getRelativeFilePath(file);
                    files.push({ path: rel, hash: hashFile(path.join(file.parentPath, file.name)) });
                    EXTERNAL_FILES.add(rel);
                });
            } else {
                const rel = dep.replace(/\\/g, '/');
                files.push({ path: rel, hash: hashFile(absDep) });
                EXTERNAL_FILES.add(rel);
            }
        }

        REGISTRY.set(id, {
            ...manifest,
            kind: isRecipe ? 'recipe' : (manifest?.kind ?? 'component'),
            category: !isRecipe && (manifest?.kind ?? 'component') === 'component' ? id.split('/')[0] : undefined,
            files,
        })

        return;
    }

    // If no manifest.json - it's either a lib or nested folder which may contain a component
    for (const child of fs.readdirSync(folderPath, { withFileTypes: true })) {
        if (child.isDirectory()) {
            walk(path.join(folderPath, child.name));
        } else {
            const id = path
                .join(
                    path.relative(COMPONENTS_PATH, path.dirname(path.join(child.parentPath, child.name))),
                    path.basename(child.name, path.extname(child.name)))
                .replace(/\.d/, '')
                .replace(/\\/g, '/');

            const relativeFilePath = getRelativeFilePath(child);
            const hash = hashFile(path.join(child.parentPath, child.name));
            const files = [{ path: relativeFilePath, hash }];

            REGISTRY.set(id, {
                kind: 'lib',
                files,
            })
        }
    }
};

const REGISTRY = new Map<string, ComponentData>();
const filePathToId = new Map<string, string>();
// Files pulled in via `explicit-dependency` — delivered, but not import-scanned.
const EXTERNAL_FILES = new Set<string>();

// Populate the REGISTRY by walking through the components directory
for (const rootDir of fs.readdirSync(COMPONENTS_PATH, { withFileTypes: true })) {
    walk(path.join(COMPONENTS_PATH, rootDir.name));
}

// Populate the REGISTRY by walking through the recipes directory
for (const rootDir of fs.readdirSync(RECIPE_PATH, { withFileTypes: true })) {
    walk(path.join(RECIPE_PATH, rootDir.name));
}

// Populate the filePathToId map for quick lookup of component IDs based on file paths
REGISTRY.forEach((data, id) => {
    data.files.forEach((file) => filePathToId.set(file.path.split('.')[0], id));
})

REGISTRY.forEach((data, id) => {
    const depsOn: Set<string> = new Set();
    const npmDeps: Set<string> = new Set();

    data.files.forEach((file) => {
        // Explicit-dependency tools/assets are delivered, not scanned.
        if (EXTERNAL_FILES.has(file.path)) return;
        // Only TS/JS-family files can carry import declarations.
        if (!SCAN_EXT.has(path.extname(file.path))) return;

        const src = fs.readFileSync(path.join(ROOT, file.path), { encoding: 'utf8' });
        const sourceFile = ts.createSourceFile(file.path, src, ts.ScriptTarget.Latest, true);

        sourceFile.forEachChild(node => {
            if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) return;
            const importPath = node.moduleSpecifier.text;

            if (importPath.startsWith('@components/') || importPath.startsWith('.')) {
                const resolvedPath = importPath.startsWith('@components/')
                    ? path.join('src', 'components', importPath.replace('@components/', '')).split('.')[0].replace(/\\/g, '/')
                    : path.join(path.dirname(file.path), importPath).split('.')[0].replace(/\\/g, '/');

                const depId = filePathToId.get(resolvedPath) ?? filePathToId.get(resolvedPath + '/index');

                if (!depId) {
                    existsInGitIgnore(file.path) && console.warn(`⚠ Unresolved import "${importPath}" in ${file.path}`);
                } else if (depId !== id && !depsOn.has(depId)) {
                    depsOn.add(depId);
                }
            } else {
                const pkg = importPath.startsWith('@')
                    ? importPath.split('/').slice(0, 2).join('/')  // @solid-primitives/jsx-tokenizer
                    : importPath.split('/')[0];                    // solid-js/store → solid-js
                npmDeps.add(pkg);
            }
        });
    })

    data.dependsOn = Array.from(depsOn);
    data.npmDependencies = Array.from(npmDeps);
})

const registryTestPath = path.join(ROOT, 'registry.json');
const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8')).version;
const output = {
    schemaVersion: 1,
    name: 'gameface-ui',
    repo: 'CoherentLabs/Gameface-UI',
    version: version,
    tag: `v${version}`,
    generatedAt: new Date().toISOString(),
    entries: Object.fromEntries(REGISTRY),
};

fs.writeFileSync(
    registryTestPath,
    JSON.stringify(output, null, 2),
    'utf-8'
);

const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

pkg['gameface-ui-components'] = Object.fromEntries(
    [...REGISTRY.values()]
        .filter((entry) => entry.kind === 'component' && entry.name && entry.version)
        .map((entry) => [entry.name!, entry.version!])
);

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');