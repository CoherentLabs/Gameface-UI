import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = path.resolve(__dirname, '../../../..');

export const GFUI_DEMO_DIR = path.join(DOCS_ROOT, '.gfui-demos');
