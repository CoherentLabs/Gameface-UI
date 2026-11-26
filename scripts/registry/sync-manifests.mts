// Keeps component manifests in step with the code, before the registry is built:
// - a folder `<Name>/` with `<Name>.tsx` whose default export is a component, and no manifest in it or
//   above it, gets a new manifest.json (version 1.0.0, empty description, editor block with its slots);
// - a manifest without an `editor` block gets one;
// - every createTokenComponent token on the default export that the editor block doesn't mention yet is
//   added as a slot, under the slot or variant whose tag it extends (`Carousel.Pagination.Item`).
// - eslint-custom-rules/token-parents.json is regenerated from the slot nesting, for the tokens-validator.
// Hand-written fields are never changed or removed. Sub-components that aren't tokens (`Modal.Close`,
// `Column.Four`) can be slots or variants, so they're only reported for the author to place.
import fs from 'node:fs';
import path from 'node:path';
import type { EditorMeta, EditorSlot, EditorVariant, Manifest } from './types.ts';
import {
    COMPONENTS_PATH, ROOT, componentId, createComponentProgram, describedTags, entryFile, exportType,
    exportedParts, findManifests, formatManifest, type ManifestFile,
} from './manifests.mts';

/** `unreadable`: existing components whose default export couldn't be read, so they weren't synced at all. */
export interface SyncResult { changes: string[]; warnings: string[]; unreadable: string[] }

/** `LabelLeft` → `Label left` */
const slotName = (tag: string) => {
    const last = tag.split('.').pop()!;
    return last.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/ ([A-Z])/g, (_, c: string) => ` ${c.toLowerCase()}`);
};

/** Folders that look like components but have no manifest in them or in any folder above them. */
const findNewComponentDirs = (manifests: ManifestFile[]): string[] => {
    const covered = new Set(manifests.map(m => m.dir));
    const found: string[] = [];
    const walk = (dir: string, depth: number) => {
        if (covered.has(dir)) return;              // a manifest owns this folder and everything below it
        if (depth >= 2 && fs.existsSync(path.join(dir, `${path.basename(dir)}.tsx`))) found.push(dir);
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.isDirectory()) walk(path.join(dir, entry.name), depth + 1);
        }
    };
    walk(COMPONENTS_PATH, 0);
    return found;
};

/** Inserts a slot under the deepest slot or variant whose tag the new one extends, else at the top. */
const insertSlot = (meta: EditorMeta, tag: string) => {
    const slot: EditorSlot = { name: slotName(tag), token: tag };
    let best: { holder: { slots?: EditorSlot[] }; depth: number } = { holder: meta, depth: 0 };
    const visit = (holder: EditorSlot | EditorVariant, depth: number) => {
        if (tag.startsWith(holder.token + '.') && depth > best.depth) best = { holder, depth };
        holder.slots?.forEach(s => visit(s, depth + 1));
    };
    meta.slots?.forEach(s => visit(s, 1));
    meta.variants?.forEach(v => visit(v, 1));
    (best.holder.slots ??= []).push(slot);
};

export const syncManifests = ({ write }: { write: boolean }): SyncResult => {
    const changes: string[] = [];
    const warnings: string[] = [];
    const unreadable: string[] = [];
    const tokenTags = new Set<string>();
    const synced: { rootTag: string; editor: EditorMeta }[] = [];
    const manifests = findManifests();

    const candidates: ManifestFile[] = findNewComponentDirs(manifests).map(dir => ({
        id: componentId(dir),
        dir,
        file: path.join(dir, 'manifest.json'),
        manifest: { name: path.basename(dir), version: '1.0.0', description: '' },
    }));

    const targets = [...manifests.filter(m => m.manifest.kind !== 'lib'), ...candidates];
    const { program, checker } = createComponentProgram(targets.map(m => entryFile(m.dir, m.manifest)));

    for (const target of targets) {
        const isNew = candidates.includes(target);
        const before = isNew ? '' : formatManifest(target.manifest);
        const manifest: Manifest = structuredClone(target.manifest);
        if (manifest.editor?.hidden) continue;

        const entry = entryFile(target.dir, manifest);
        const source = program.getSourceFile(entry);
        const rootType = source && exportType(program, checker, entry);
        if (!source || !rootType || !rootType.getCallSignatures().length) {
            if (!isNew) unreadable.push(`${target.id}: can't read the default export of ${path.basename(entry)}, so it wasn't synced (a missing generated file such as ImageTypes.ts? run "npm run gen-images" first)`);
            continue;                              // a new folder without a component default export isn't a component
        }

        const added: string[] = [];
        if (!manifest.editor) {
            manifest.editor = {};
            added.push('editor block');
        }
        const rootTag = path.basename(entry, path.extname(entry));
        const known = describedTags(manifest.editor);
        const parts = exportedParts(checker, rootType, rootTag, source);
        parts.filter(p => p.token).forEach(p => tokenTags.add(p.tag));
        synced.push({ rootTag, editor: manifest.editor });
        for (const part of parts) {
            if (known.has(part.tag)) continue;
            if (part.token) {
                insertSlot(manifest.editor, part.tag);
                known.add(part.tag);
                added.push(`slot ${part.tag}`);
            } else {
                warnings.push(`${target.id}: ${part.tag} isn't described; add it as a slot or a variant in the editor block`);
            }
        }

        const after = formatManifest(manifest);
        if (after === before) continue;
        changes.push(isNew
            ? `${target.id}: created manifest.json${added.length > 1 ? ` with ${added.slice(1).join(', ')}` : ''} (fill in description, icon and category)`
            : `${target.id}: added ${added.join(', ')}`);
        if (write) fs.writeFileSync(target.file, after);
    }

    // The ESLint tokens-validator reads which parent each token must sit directly under from this file.
    const parentsText = formatTokenParents(tokenParents(synced, tokenTags));
    // Compared without line endings: with core.autocrlf a Windows checkout has CRLF, which isn't a change.
    const current = fs.existsSync(TOKEN_PARENTS_FILE) ? fs.readFileSync(TOKEN_PARENTS_FILE, 'utf8') : '';
    if (parentsText !== current.replace(/\r\n/g, '\n')) {
        changes.push(`${path.relative(ROOT, TOKEN_PARENTS_FILE).split(path.sep).join('/')}: regenerated from the manifests`);
        if (write) fs.writeFileSync(TOKEN_PARENTS_FILE, parentsText);
    }

    return { changes, warnings, unreadable };
};

export const TOKEN_PARENTS_FILE = path.join(ROOT, 'eslint-custom-rules', 'token-parents.json');

/**
 * Token tag → the tags it may sit directly under, from the slot nesting in the manifests. Only real
 * createTokenComponent tokens are listed: other sub-components (`Modal.Close`, `Navigation.Area`) are
 * components in their own right and may sit deeper. `repeatable` tokens may also be rendered by `<For>`/`.map`.
 */
const tokenParents = (synced: { rootTag: string; editor: EditorMeta }[], tokenTags: Set<string>) => {
    const parents = new Map<string, Set<string>>();
    const repeatable = new Set<string>();
    const visit = (holderTag: string, slots: EditorSlot[] = []) => {
        for (const slot of slots) {
            if (tokenTags.has(slot.token)) {
                if (!parents.has(slot.token)) parents.set(slot.token, new Set());
                parents.get(slot.token)!.add(holderTag);
                if (slot.repeat) repeatable.add(slot.token);
            }
            visit(slot.token, slot.slots);
        }
    };
    for (const { rootTag, editor } of synced) {
        visit(rootTag, editor.slots);
        for (const variant of editor.variants ?? []) visit(variant.token, variant.slots);
    }
    const sorted = [...parents.keys()].sort();
    return {
        parents: Object.fromEntries(sorted.map(tag => [tag, [...parents.get(tag)!].sort()])),
        repeatable: [...repeatable].sort(),
    };
};

const formatTokenParents = (data: ReturnType<typeof tokenParents>) => JSON.stringify({
    $comment: 'Generated by `npm run gen-registry` from the editor blocks in src/components/**/manifest.json. Do not edit.',
    ...data,
}, null, 2)
    .replace(/\[\s*\n((?:\s*"[^"\n]*",?\s*\n)+)\s*\]/g, (_, body: string) => '[' + body.split('\n').map(s => s.trim()).filter(Boolean).join(' ') + ']') + '\n';

if (import.meta.filename === process.argv[1]) {
    const check = process.argv.includes('--check');
    const { changes, warnings, unreadable } = syncManifests({ write: !check });
    warnings.forEach(w => console.log(`⚠ ${w}`));
    unreadable.forEach(u => console.log(`${check ? '✗' : '⚠'} ${u}`));
    changes.forEach(c => console.log(`${check ? '✗' : '✎'} ${c}`));
    if (check && (changes.length || unreadable.length)) process.exit(1);
}
