// Checks the `editor` block of every component manifest (D-27) against the component's TypeScript:
// entry files exist, every token resolves on the export it names, every prop named in
// propsOrder / hiddenProps / textProp exists on the props type, and every component that isn't a
// `wrapper` reaches `use:baseComponent` (so `class`, `style` and `attr:*` land on its DOM element).
// Unknown keys are reported as typos.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import type { EditorChildren, EditorSlot, EditorVariant } from './types.ts';
import { COMPONENTS_PATH, ROOT, createComponentProgram, entryFile, exportType as exportTypeOf, findManifests } from './manifests.mts';

const META_KEYS = new Set(['hidden', 'entry', 'icon', 'category', 'wrapper', 'within', 'slots', 'children', 'variants', 'propsOrder', 'hiddenProps', 'sizeProps', 'handles', 'focusable', 'textProp']);
const SLOT_KEYS = new Set(['name', 'token', 'import', 'styleable', 'acceptsChildren', 'repeat', 'wrapper', 'focusable', 'textProp', 'propsOrder', 'hiddenProps', 'slots', 'children']);
const VARIANT_KEYS = new Set(['name', 'token', 'icon', 'propsOrder', 'hiddenProps', 'slots', 'children']);

const errors: string[] = [];

const manifests = findManifests();

const componentNames = new Set(manifests.filter(m => m.manifest.kind !== 'lib').map(m => m.manifest.name));
const checked = manifests.filter(m => m.manifest.kind !== 'lib' && m.manifest.editor && !m.manifest.editor.hidden);

for (const m of manifests) {
    if (m.manifest.kind !== 'lib' && !m.manifest.editor) errors.push(`${m.id}: no "editor" block (use { "hidden": true } for non-placeable entries)`);
}

const entryOf = (m: typeof checked[number]) => entryFile(m.dir, m.manifest);

// Modules named by a slot's `import` may not be reachable from the entry, so they are roots too.
const importFiles = (slots: EditorSlot[] = [], dir: string): string[] => slots.flatMap(s => [
    ...(s.import ? ['.tsx', '.ts'].map(ext => path.join(dir, s.import!.split('#')[0] + ext)) : []),
    ...importFiles(s.slots, dir),
]);
const entryFiles = checked
    .flatMap(m => [
        entryOf(m),
        ...importFiles(m.manifest.editor!.slots, m.dir),
        ...(m.manifest.editor!.variants ?? []).flatMap(v => importFiles(v.slots, m.dir)),
    ])
    .filter(f => fs.existsSync(f));
const { program, checker, options } = createComponentProgram(entryFiles);
const exportType = (file: string, exportName: string) => exportTypeOf(program, checker, file, exportName);

// The base component's own folder is where the directive is defined, so reaching it proves nothing.
const BASE_DIR = path.join(COMPONENTS_PATH, 'BaseComponent') + path.sep;
const forwardsCache = new Map<string, boolean>();
/**
 * True when the file, or a src/components module it imports (transitively), applies `use:baseComponent`.
 * Covers components built on another one (`Row` → `LayoutBase`, `RoundedButton` → `Button`). It can't tell
 * whether that use is on the component's own root, so it catches components that never forward at all.
 */
const reachesBaseComponent = (file: string): boolean => {
    if (!forwardsCache.has(file)) forwardsCache.set(file, searchForBaseComponent(file, new Set()));
    return forwardsCache.get(file)!;
};

/** Module specifiers a file pulls code from: value imports and `export … from` re-exports. */
const codeDependencies = (source: ts.SourceFile): string[] => source.statements.flatMap(stmt => {
    if (ts.isImportDeclaration(stmt) && !stmt.importClause?.isTypeOnly && ts.isStringLiteral(stmt.moduleSpecifier)) return [stmt.moduleSpecifier.text];
    if (ts.isExportDeclaration(stmt) && !stmt.isTypeOnly && stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)) return [stmt.moduleSpecifier.text];
    return [];
});

// Only a `true` found inside a walk is cached: a `false` reached through the cycle guard is partial,
// because the file that cut the cycle is still being searched further up.
const searchForBaseComponent = (file: string, seen: Set<string>): boolean => {
    if (forwardsCache.get(file) === true) return true;
    if (seen.has(file)) return false;
    seen.add(file);
    const source = program.getSourceFile(file);
    if (!source) return false;
    if (source.text.includes('use:baseComponent')) {
        forwardsCache.set(file, true);
        return true;
    }
    for (const specifier of codeDependencies(source)) {
        const resolved = ts.resolveModuleName(specifier, file, options, ts.sys).resolvedModule?.resolvedFileName;
        if (!resolved) continue;
        const full = path.resolve(resolved);
        if (!full.startsWith(COMPONENTS_PATH + path.sep) || full.startsWith(BASE_DIR)) continue;
        if (searchForBaseComponent(full, seen)) {
            forwardsCache.set(file, true);
            return true;
        }
    }
    return false;
};

const propertyType = (type: ts.Type, name: string, at: ts.Node): ts.Type | undefined => {
    const prop = checker.getPropertyOfType(type, name);
    return prop && checker.getTypeOfSymbolAtLocation(prop, at);
};

/** Prop names of a component type: the first parameter of its call signature(s). */
const propNames = (type: ts.Type, at: ts.Node): Set<string> | undefined => {
    const signatures = type.getCallSignatures();
    if (!signatures.length) return undefined;
    const names = new Set<string>();
    for (const sig of signatures) {
        const param = sig.getParameters()[0];
        if (!param) continue;
        checker.getApparentType(checker.getTypeOfSymbolAtLocation(param, at)).getProperties().forEach(p => names.add(p.name));
    }
    return names;
};

const checkKeys = (where: string, obj: object, allowed: Set<string>) => {
    for (const key of Object.keys(obj)) if (!allowed.has(key)) errors.push(`${where}: unknown key "${key}"`);
};

const checkProps = (where: string, type: ts.Type | undefined, at: ts.Node, part: { propsOrder?: string[]; hiddenProps?: string[]; sizeProps?: string[]; textProp?: string }) => {
    const named = [...(part.propsOrder ?? []), ...(part.hiddenProps ?? []), ...(part.sizeProps ?? []), ...(part.textProp ? [part.textProp] : [])];
    if (!named.length || !type) return;
    const names = propNames(type, at);
    if (!names) return errors.push(`${where}: can't read the props type to check ${named.join(', ')}`);
    for (const name of named) if (!names.has(name)) errors.push(`${where}: prop "${name}" is not in the props type`);
};

for (const m of checked) {
    const meta = m.manifest.editor!;
    const where = m.id;
    checkKeys(where, meta, META_KEYS);

    const entry = entryOf(m);
    if (!fs.existsSync(entry)) {
        errors.push(`${where}: entry file ${path.relative(ROOT, entry)} not found (set "entry")`);
        continue;
    }
    const source = program.getSourceFile(entry)!;
    const rootName = path.basename(m.dir) === path.basename(entry, path.extname(entry)) ? path.basename(m.dir) : path.basename(entry, path.extname(entry));
    const rootType = exportType(entry, 'default');
    if (!rootType) {
        errors.push(`${where}: ${path.relative(ROOT, entry)} has no default export`);
        continue;
    }
    if (!meta.wrapper && !reachesBaseComponent(path.resolve(entry))) {
        errors.push(`${where}: never applies use:baseComponent, so class, style and attr:* (data-gf-id) don't reach the DOM; apply it, or mark the component "wrapper": true if it renders no element of its own`);
    }

    /** Resolves a tag like `Dropdown.Option` (or `Match` with import `./State#Match`) to its type. */
    const resolveTag = (tag: string, importSpec?: string): ts.Type | undefined => {
        const [head, ...rest] = tag.split('.');
        let type: ts.Type | undefined;
        if (importSpec) {
            const [file, name = 'default'] = importSpec.split('#');
            const resolved = ['.tsx', '.ts'].map(ext => path.join(m.dir, file + ext)).find(f => fs.existsSync(f));
            if (!resolved) return undefined;
            if (!program.getSourceFile(resolved)) return undefined;
            type = exportType(resolved, name);
        } else if (head === rootName) {
            type = rootType;
        } else {
            return undefined;
        }
        for (const part of rest) {
            if (!type) return undefined;
            type = propertyType(type, part, source);
        }
        return type;
    };

    const checkChildren = (at: string, children: EditorChildren | undefined, ownTokens: Set<string>) => {
        if (!children) return;
        checkKeys(`${at}.children`, children, new Set(['accepts', 'addLabel']));
        if (!Array.isArray(children.accepts) || !children.accepts.length) {
            errors.push(`${at}: children.accepts is required and must list at least one tag ("*" for any element)`);
            return;
        }
        for (const tag of children.accepts) {
            if (tag === '*' || ownTokens.has(tag) || componentNames.has(tag)) continue;
            errors.push(`${at}: children.accepts "${tag}" is neither a slot of this component nor a library component`);
        }
    };

    /**
     * Checks a holder's slots (component root, slot or variant). A `repeat` slot is added with the Layers +
     * action, which only offers tags from the holder's `children.accepts`, so it must be listed there.
     */
    const checkSlots = (at: string, slots: EditorSlot[] | undefined, holderChildren: EditorChildren | undefined): Set<string> => {
        const tokens = new Set<string>();
        for (const slot of slots ?? []) {
            const slotWhere = `${at} › ${slot.name ?? slot.token}`;
            checkKeys(slotWhere, slot, SLOT_KEYS);
            if (!slot.name || !slot.token) {
                errors.push(`${slotWhere}: "name" and "token" are required`);
                continue;
            }
            tokens.add(slot.token);
            const type = resolveTag(slot.token, slot.import);
            if (!type) errors.push(`${slotWhere}: token "${slot.token}" doesn't resolve${slot.import ? ` in ${slot.import}` : ` on the default export of ${path.basename(entry)}`}`);
            if (slot.repeat && !holderChildren?.accepts?.includes(slot.token)) {
                errors.push(`${slotWhere}: repeat slot "${slot.token}" must be in children.accepts of the slot or component that holds it, or the Layers + action can't add it`);
            }
            checkProps(slotWhere, type, source, slot);
            const nested = checkSlots(slotWhere, slot.slots, slot.children);
            checkChildren(slotWhere, slot.children, nested);
        }
        return tokens;
    };

    checkProps(where, rootType, source, meta);
    const own = checkSlots(where, meta.slots, meta.children);
    for (const variant of meta.variants ?? [] as EditorVariant[]) {
        const vWhere = `${where} › ${variant.name ?? variant.token}`;
        checkKeys(vWhere, variant, VARIANT_KEYS);
        if (!variant.name || !variant.token) {
            errors.push(`${vWhere}: variant "name" and "token" are required`);
            continue;
        }
        const variantType = resolveTag(variant.token);
        if (!variantType) errors.push(`${vWhere}: variant token "${variant.token}" doesn't resolve`);
        checkProps(vWhere, variantType, source, variant);
        checkChildren(vWhere, variant.children, checkSlots(vWhere, variant.slots, variant.children));
    }
    checkChildren(where, meta.children, own);
    for (const parent of meta.within ?? []) {
        if (!componentNames.has(parent)) errors.push(`${where}: within "${parent}" is not a library component`);
    }
}

if (errors.length) {
    for (const e of errors) console.log(`::error title=Editor metadata::${e}`);
    console.log(`\n✗ ${errors.length} editor metadata problem(s)`);
    process.exit(1);
}
console.log(`✓ Editor metadata checked for ${checked.length} components`);
