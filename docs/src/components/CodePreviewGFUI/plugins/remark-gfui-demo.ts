import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import { demoRegistry, hashDemo } from './gfui-demo-registry';
import { GFUI_DEMO_DIR } from './gfui-demo-paths';

function getAttr(node: { attributes?: any[] }, name: string): string | undefined {
  const attr = node.attributes?.find(
    (a: { type?: string; name?: string }) => a.type === 'mdxJsxAttribute' && a.name === name,
  );
  if (!attr) return undefined;
  if (typeof attr.value === 'string') return attr.value;
  return undefined;
}

export function remarkGfuiDemo() {
  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], (node: any) => {
      if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') {
        return;
      }
      if (node.name !== 'CodePreviewGFUI') return;

      const codeNode = (node.children ?? []).find((c: { type?: string }) => c.type === 'code');
      if (!codeNode) return;

      const code = codeNode.value as string;
      const hash = hashDemo(code);
      const lang = getAttr(node, 'lang') ?? codeNode.lang ?? 'tsx';

      demoRegistry.set(hash, code);
      fs.mkdirSync(GFUI_DEMO_DIR, { recursive: true });

      if (lang === 'html') {
        fs.writeFileSync(path.join(GFUI_DEMO_DIR, `${hash}.html`), code, 'utf-8');
      } else {
        fs.writeFileSync(path.join(GFUI_DEMO_DIR, `${hash}.tsx`), code, 'utf-8');
      }

      node.attributes = node.attributes ?? [];

      const setAttr = (name: string, value: string) => {
        const existing = node.attributes.find(
          (a: { type?: string; name?: string }) => a.type === 'mdxJsxAttribute' && a.name === name,
        );
        if (existing) {
          existing.value = value;
        } else {
          node.attributes.push({ type: 'mdxJsxAttribute', name, value });
        }
      };

      setAttr('hash', hash);
      setAttr('code', code);
      setAttr('lang', lang);

      node.children = [];
    });
  };
}
