// Shared helpers for reading, writing and type-checking component manifests.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import type { EditorMeta, EditorSlot, Manifest } from './types.ts';

export const ROOT = path.join(import.meta.dirname, '..', '..');
export const COMPONENTS_PATH = path.join(ROOT, 'src', 'components');

export interface ManifestFile { id: string; dir: string; file: string; manifest: Manifest }

export const componentId = (dir: string) => path.relative(COMPONENTS_PATH, dir).split(path.sep).join('/');

export const findManifests = (): ManifestFile[] => {
    const found: ManifestFile[] = [];
    const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name === 'manifest.json') {
                found.push({ id: componentId(dir), dir, file: full, manifest: JSON.parse(fs.readFileSync(full, 'utf8')) });
            }
        }
    };
    walk(COMPONENTS_PATH);
    return found;
};

const KEY_ORDER = ['name', 'kind', 'version', 'description', 'explicit-dependency', 'editor'];

/** 2-space JSON with known keys first and arrays of plain values kept on one line. */
export const formatManifest = (manifest: Manifest): string => {
    const rank = (k: string) => KEY_ORDER.indexOf(k) + 1 || KEY_ORDER.length + 1;
    const ordered = Object.fromEntries(Object.keys(manifest).sort((a, b) => rank(a) - rank(b)).map(k => [k, (manifest as any)[k]]));
    return JSON.stringify(ordered, null, 2)
        .replace(/\[\s*\n((?:\s*(?:"[^"\n]*"|-?\d[\d.]*|true|false|null),?\s*\n)+)\s*\]/g,
            (_, body: string) => '[' + body.split('\n').map(s => s.trim()).filter(Boolean).join(' ') + ']') + '\n';
};

export const entryFile = (dir: string, manifest: Manifest) =>
    path.join(dir, manifest.editor?.entry ?? `${path.basename(dir)}.tsx`);

export const createComponentProgram = (rootFiles: string[]) => {
    const configPath = path.join(ROOT, 'tsconfig.json');
    const config = ts.parseJsonConfigFileContent(ts.readConfigFile(configPath, ts.sys.readFile).config, ts.sys, ROOT);
    const options = { ...config.options, noEmit: true, skipLibCheck: true };
    const program = ts.createProgram(rootFiles.filter(f => fs.existsSync(f)), options);
    return { program, checker: program.getTypeChecker(), options };
};

export const exportType = (program: ts.Program, checker: ts.TypeChecker, file: string, exportName = 'default'): ts.Type | undefined => {
    const source = program.getSourceFile(file);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);
    if (!moduleSymbol) return undefined;
    const symbol = checker.getExportsOfModule(moduleSymbol).find(s => s.escapedName === exportName);
    return symbol && checker.getTypeOfSymbol(symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);
};

/** A `createToken` / `createTokenComponent` result carries jsx-tokenizer's `$TYPE` marker property. */
export const isToken = (checker: ts.TypeChecker, type: ts.Type) =>
    checker.getPropertiesOfType(type).some(p => String(p.escapedName).startsWith('__@$TYPE'));

const fromObjectAssign = (symbol: ts.Symbol) => (symbol.declarations ?? []).some(d =>
    (ts.isPropertyAssignment(d) || ts.isShorthandPropertyAssignment(d))
    && ts.isObjectLiteralExpression(d.parent)
    && ts.isCallExpression(d.parent.parent)
    && d.parent.parent.expression.getText() === 'Object.assign');

export interface ExportedPart { tag: string; token: boolean }

/**
 * The parts a component attaches with `Object.assign(Component, { … })`, nested (`Carousel.Pagination.Item`).
 * Only Object.assign keys count, so typed extras like Image's generated asset tree are ignored.
 */
export const exportedParts = (checker: ts.TypeChecker, type: ts.Type, rootTag: string, at: ts.Node, depth = 0): ExportedPart[] => {
    if (depth > 3) return [];
    return checker.getPropertiesOfType(type).filter(fromObjectAssign).flatMap(symbol => {
        const partType = checker.getTypeOfSymbolAtLocation(symbol, at);
        if (!partType.getCallSignatures().length) return [];
        const tag = `${rootTag}.${symbol.name}`;
        return [{ tag, token: isToken(checker, partType) }, ...exportedParts(checker, partType, tag, at, depth + 1)];
    });
};

/** Every tag a block already describes: slots (nested), variants and their slots, accepted children. */
export const describedTags = (meta: EditorMeta): Set<string> => {
    const tags = new Set<string>();
    const addSlots = (slots: EditorSlot[] = []) => slots.forEach(s => {
        tags.add(s.token);
        addSlots(s.slots);
        s.children?.accepts?.forEach(t => tags.add(t));
    });
    addSlots(meta.slots);
    meta.children?.accepts?.forEach(t => tags.add(t));
    for (const v of meta.variants ?? []) {
        tags.add(v.token);
        addSlots(v.slots);
        v.children?.accepts?.forEach(t => tags.add(t));
    }
    return tags;
};
