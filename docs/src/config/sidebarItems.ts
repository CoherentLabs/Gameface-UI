import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.join(__dirname, '../content/docs/components');
const recipesDir = path.join(__dirname, '../content/docs/recipes');

export function componentSidebarItems() {
  const subfolders = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return [
    ...subfolders.map((name) => ({
      label: name,
      autogenerate: { directory: `components/${name}`, collapsed: false },
    })),
  ];
}

export function recipesSidebarItems() {
  const subfolders = fs
    .readdirSync(recipesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  return [
    // Use slug entries to avoid nested groups (folder -> index.mdx)
    // Each folder is expected to have `index.mdx` and the slug becomes `recipes/<folder>`.
    ...subfolders.map((name) => `recipes/${name}`),
  ];
}
