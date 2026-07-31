import fs, { Dir } from 'node:fs';
import ts from 'typescript';
import path from 'node:path';
import crypto from 'node:crypto';

interface Manifest {
    name: string,
    version?: string,
    description?: string
    kind: 'component' | 'lib',
}

interface ComponentData extends Partial<Manifest> {
    kind: 'component' | 'lib';
    files: { path: string; hash: string }[];
    category?: string;
    dependsOn?: string[];
    npmDependencies?: string[];
}

const ROOT = path.join(import.meta.dirname, '..');
const COMPONENTS_PATH = path.join(ROOT, 'src', 'components');

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

const getComponentId = (folderPath: string) => {
    return path
        .join(
            path.relative(COMPONENTS_PATH, path.dirname(folderPath)), 
            path.basename(folderPath))
        .replace(/\\/g, '/');
}

const walk = (folderPath: string) => {
// COMPONENT: collect its files, emit one entry, then STOP.
  if (hasManifest(folderPath)) {
    const id = getComponentId(folderPath);
    let manifest;
    
    let files = [];
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

                const relativeFilePath = getRelativeFilePath(file);
                const hash = hashFile(path.join(file.parentPath, file.name));

                files.push({ path: relativeFilePath, hash });
            })
            continue
        }

        const relativeFilePath = getRelativeFilePath(entry);
        const hash = hashFile(path.join(folderPath, entry.name));

        files.push({ path: relativeFilePath, hash });
    }

    REGISTRY.set(id, {
        kind: 'component',
        ...manifest,
        category: (manifest?.kind ?? 'component') === 'component' ? id.split('/')[0] : undefined,
        files,
    })
    return;
  }

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

// Populate the REGISTRY by walking through the components directory
for (const rootDir of fs.readdirSync(COMPONENTS_PATH, { withFileTypes: true })) {
    walk(path.join(COMPONENTS_PATH, rootDir.name));
}

// Populate the filePathToId map for quick lookup of component IDs based on file paths
REGISTRY.forEach((data, id) => {
    data.files.forEach((file) => filePathToId.set((file.path.split('.')[0]).replace(/\\/g, '/'), id));
})

REGISTRY.forEach((data, id) => {
    const depsOn: Set<string> = new Set();
    const npmDeps: Set<string> = new Set();

    data.files.forEach((file) => {
        // Parse file
        const src = fs.readFileSync(path.join(ROOT, file.path), {encoding: 'utf8' })
        const sourceFile = ts.createSourceFile(file.path, src, ts.ScriptTarget.Latest, true);

        sourceFile.forEachChild(node => {
            if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
                const importPath = node.moduleSpecifier.text;
                
                if (importPath.startsWith('@components/')) {
                    // append src/components/ to the import path to get the relative path
                    const relativePath = importPath.replace('@components/', '');
                    const resolvedPath = path.join('src', 'components', relativePath).split('.')[0].replace(/\\/g, '/');
                    const depId = filePathToId.has(resolvedPath) ? filePathToId.get(resolvedPath) : filePathToId.get(resolvedPath.concat('/index'));

                    if (depId && depId !== id && !depsOn.has(depId)) {
                        depsOn.add(depId);
                    }
                } else if (importPath.startsWith('.')) {
                    const resolvedPath = path.join(path.dirname(file.path), importPath).split('.')[0].replace(/\\/g, '/');
                    const depId = filePathToId.has(resolvedPath) ? filePathToId.get(resolvedPath) : filePathToId.get(resolvedPath.concat('/index'));

                    if (depId && depId !== id && !depsOn.has(depId)) {
                        depsOn.add(depId);
                    }
                } else {
                    const pkg = importPath.startsWith('@')
                        ? importPath.split('/').slice(0, 2).join('/')  // @solid-primitives/jsx-tokenizer
                        : importPath.split('/')[0];                    // solid-js/store → solid-js
                    npmDeps.add(pkg);
                }
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
    JSON.stringify(output, null, 2), // null, 2 = pretty-printed with 2-space indent
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