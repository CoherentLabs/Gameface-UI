import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

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

function getPublishedRecipeSlugs(): string[] {
  return fs
    .readdirSync(recipesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((folderName) => {
      const indexPath = path.join(recipesDir, folderName, 'index.mdx');
      if (!fs.existsSync(indexPath)) return false;

      const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
      if (data.draft === true) return false;
      return Boolean(data.recipe);
    })
    .sort()
    .map((name) => `recipes/${name}`);
}

export function recipesSidebarItems() {
  return getPublishedRecipeSlugs();
}
