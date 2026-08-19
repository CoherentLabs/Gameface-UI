import { execSync } from 'node:child_process';
import fs from 'node:fs';
import type { ComponentData } from './types.ts';

const base = process.env.BASE_REF ?? 'master';

function baseVersion(manifestPath: string): string | null {
  try {
    const json = execSync(`git show origin/${base}:${manifestPath}`, { encoding: 'utf8' });
    return JSON.parse(json).version ?? null;
  } catch {
    return null;   // file didn't exist on base → brand-new entry
  }
}

const manifestPath = (id: string, kind: string) => {
  switch (kind) {
    case 'lib':
      return null;
    case 'recipe':
      return `src/recipes/${id}/manifest.json`;
    case 'component':
      return `src/components/${id}/manifest.json`;
    default:
      return null;
  }
};

function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const na = partsA[i] || 0;
    const nb = partsB[i] || 0;
    if (na !== nb) return na - nb; // negative: a < b, positive: a > b
  }
  return 0; // equal
}

const changed = execSync(`git diff --name-only origin/${base}...HEAD`, { encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean);

const { entries } = JSON.parse(fs.readFileSync('registry.json', 'utf8')) as { entries: Record<string, ComponentData> };
const fileToEntry = new Map<string, string>();
for (const [id, data] of Object.entries(entries)) {
  for (const f of data.files) fileToEntry.set(f.path, id);
}

// which entries did this PR touch?
const touched = new Set<string>();
for (const file of changed) {
  const owner = fileToEntry.get(file);
  if (owner) touched.add(owner);
}

// entry → its direct dependents
const dependents = new Map<string, string[]>();
for (const [id, data] of Object.entries<any>(entries)) {
  for (const dep of data.dependsOn ?? []) {
    if (!dependents.has(dep)) dependents.set(dep, []);
    dependents.get(dep)!.push(id);
  }
}

// must-bump = touched + all dependents. The edited entry is carried along the walk so the
// summary can name which change pulled each dependent in.
const mustBump = new Set<string>();
const causedBy = new Map<string, string>();
const stack = [...touched].map(id => ({ id, root: id }));
while (stack.length) {
  const { id, root } = stack.pop()!;
  if (mustBump.has(id)) continue;
  mustBump.add(id);
  if (!touched.has(id)) causedBy.set(id, root);   // an entry edited in this PR has no "via"
  for (const d of dependents.get(id) ?? []) stack.push({ id: d, root });
}

// Check whether the manifest has been bumped
const violations: { id: string, oldVer: string, newVer: string }[] = [];
let verified = 0;   // entries that existed on base and were actually compared

for (const id of mustBump) {
  const data = entries[id];
  const manifest = manifestPath(id, data.kind);
  const oldVer = manifest ? baseVersion(manifest) : null;
  const newVer = data.version ?? "1.0.0";

  if (oldVer === null) continue;                              // new entry, nothing to bump against
  verified++;
  if (compareVersions(newVer, oldVer) <= 0) {
    violations.push({id, oldVer, newVer })
  }
}

console.log('Changed files :', changed.length);
console.log('Edited entries:', [...touched]);

if (violations.length) {
  for (const v of violations) {
    const manifest = manifestPath(v.id, entries[v.id].kind);   // points the annotation at the manifest
    const cause = touched.has(v.id) ? 'was edited' : 'changed via a dependency';
    // Both versions are equal in the usual case, so printing them both just repeats itself.
    // They only differ when someone lowered the version, which is worth spelling out.
    const state = compareVersions(v.newVer, v.oldVer) < 0
      ? `its version went backwards (${v.oldVer} on ${base}, ${v.newVer} here)`
      : `is still on ${v.newVer}`;
    console.log(`::error file=${manifest},line=1,title=Version bump required::${v.id} ${cause} and ${state} - please bump it.`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = violations.map(v => {
      const cause = causedBy.get(v.id);
      const why = touched.has(v.id) ? 'edited directly'
        : cause ? `via \`${cause}\``
        : 'a dependency changed';
      return `| \`${v.id}\` | ${why} | ${v.newVer} |`;
    }).join('\n');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `## ❌ Version bumps required\n\n` +
      `These entries changed directly or through a dependency but weren't bumped:\n\n` +
      `| Entry | Why | Version |\n|---|---|---|\n${rows}\n`
    );
  }

  process.exit(1);
}

console.log(`✓ Version check passed — ${verified} bumped, ${mustBump.size - verified} skipped (new entry or lib)`);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `## ✅ Version bumps OK\n\nEvery entry this PR affects is bumped (${verified} checked).\n`
  );
}