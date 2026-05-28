import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const componentsDir = path.join(__dirname, '../content/docs/components');

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
