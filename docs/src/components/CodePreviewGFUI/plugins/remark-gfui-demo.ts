import { visit } from 'unist-util-visit';
import { demoRegistry, hashDemo } from './gfui-demo-registry'; // adjust path

// Remark plugin: finds <CodePreviewGFUI> nodes containing a fenced code block,
// extracts the code, registers it in the demoRegistry, and sets `hash`/`code`
// attributes on the node so PreviewIsland can load + display it.
console.log('[remark] module loaded');
export function remarkGfuiDemo() {
    console.log('[remark] plugin factory called');
    return (tree: any) => {
        visit(tree, (node: any) => {
            // MDX JSX elements appear as mdxJsxFlowElement / mdxJsxTextElement
            if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') {
                return;
            }
            if (node.name !== 'CodePreviewGFUI') return;

            // Find a fenced code child (```tsx ... ```)
            const codeNode = (node.children ?? []).find((c: any) => c.type === 'code');
            if (!codeNode) return;

            const code = codeNode.value as string;
            const hash = hashDemo(code);
            demoRegistry.set(hash, code);

            // Ensure attributes array exists
            node.attributes = node.attributes ?? [];

            const setAttr = (name: string, value: string) => {
                const existing = node.attributes.find((a: any) => a.type === 'mdxJsxAttribute' && a.name === name);
                if (existing) {
                    existing.value = value;
                } else {
                    node.attributes.push({ type: 'mdxJsxAttribute', name, value });
                }
            };

            setAttr('hash', hash);
            console.log('[remark] registered demo:', hash);
            setAttr('code', code); // raw source for the code-display panel

            // Remove the fenced code from rendered output (we don't want it printed twice)
            node.children = [];
        });
    };
}
