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

const manifestPath = (id: string, kind: string) => 
  kind === 'lib'
    ? null
    :
  kind === 'recipe' 
    ? `src/recipes/${id}/manifest.json`
    : `src/components/${id}/manifest.json`;

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
    
// must-bump = touched + all dependents
const mustBump = new Set<string>();
const stack = [...touched];
while (stack.length) {
  const id = stack.pop()!;
  if (mustBump.has(id)) continue;
  mustBump.add(id);
  for (const d of dependents.get(id) ?? []) stack.push(d);
}

// Check whether the manifest has been bumped
const violations: { id: string, oldVer: string, newVer: string }[] = [];

for (const id of mustBump) {
  const data = entries[id];
  const manifest = manifestPath(id, data.kind); 
  const oldVer = manifest ? baseVersion(manifest) : null;
  const newVer = entries[id].version as string;

  if (oldVer === null) continue;                              // new entry, nothing to bump against
  if (compareVersions(newVer, oldVer) <= 0) {
    violations.push({id, oldVer, newVer })
  }
}

console.log('Changed files :', changed.length);
console.log('Edited entries:', [...touched]);

if (violations.length) {
  for (const v of violations) {
    const manifest = manifestPath(v.id, entries[v.id].kind);   // points the annotation at the manifest
    console.log(`::error file=${manifest},line=1,title=Version bump required::${v.id} changed (via dependency) but wasn't bumped - still ${v.newVer}, base is ${v.oldVer}`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = violations.map(v => `| \`${v.id}\` | ${v.oldVer} | ${v.newVer} |`).join('\n');
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
      `## ❌ Version bumps required\n\n` +
      `These entries changed directly or through a dependency but weren't bumped:\n\n` +
      `| Entry | base version | your PR |\n|---|---|---|\n${rows}\n`
    );
  }

  process.exit(1);
}