// Expands a shorthand demo (imports + bare JSX) into the full mount module
// expected by the vite plugin: `export default (root) => render(() => (<jsx>), root)`.
// Only used when the author's snippet has no `export default` of its own.

const IMPORT_RE = /^[ \t]*import\s[^;]*;[ \t]*\r?\n?/gm;

export const APP_COMPONENT_RE = /^\s*(?:const|function)\s+App\s*[=(]/m;

function ensureRenderImport(imports: string[]): string {
    const hasRenderImport = imports.some(
        (i) => /from\s+['"]solid-js\/web['"]/.test(i) && /\brender\b/.test(i),
    );
    return hasRenderImport
        ? imports.join('')
        : `import { render } from 'solid-js/web';\n` + imports.join('');
}

export function wrapShorthandDemo(raw: string): string {
    const imports = raw.match(IMPORT_RE) ?? [];
    const body = raw.replace(IMPORT_RE, '').trim();
    const importBlock = ensureRenderImport(imports);
    return `${importBlock}\nexport default (root) => render(() => (\n${body}\n), root);\n`;
}

export function wrapAppComponentDemo(raw: string): string {
    const imports = raw.match(IMPORT_RE) ?? [];
    const body = raw.replace(IMPORT_RE, '').trim();
    const importBlock = ensureRenderImport(imports);
    return `${importBlock}\n${body}\nexport default (root) => render(() => <App />, root);\n`;
}
