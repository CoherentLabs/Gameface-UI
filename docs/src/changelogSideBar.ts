import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';

const filePath = path.resolve('./src/content/docs/changelog/index.mdx');
const file = fs.readFileSync(filePath, 'utf-8');

const { content } = matter(file);

const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(content);

type Heading = { label: string; link: string, badge?: { text: string, variant: "note" | "danger" | "success" | "caution" | "tip" | "default" | undefined } };
const headings: Heading[] = [];

function parseHeadingWithBadge(node: any) {
    const text = node.children
        .filter((child: any) => child.type === 'text')
        .map((child: any) => child.value)
        .join('');

    const badgeNode = node.children.find(
        (child: any) =>
            child.type === 'text' &&
            child.value.includes(':badge[')
    );

    let badgeText = '';
    if (badgeNode) {
        const match = badgeNode.value.match(/:badge\[(.*?)\]/);
        if (match) {
            badgeText = match[1];
        }
    }

    const badgeVariantNode = node.children.find(
        (child: any) =>
            child.type === 'mdxTextExpression' &&
            child.value.includes('variant="')
    );

    let badgeVariant: "note" | "danger" | "success" | "caution" | "tip" | "default" | undefined;
    if (badgeVariantNode) {
        const match = badgeVariantNode.value.match(/variant="(.*?)"/);
        if (match) {
            badgeVariant = match[1];
        }
    }

    let badge = null;
    if (badgeText) {
        badge = { text: badgeText, variant: badgeVariant };
    }

    return { text, badge };
}

function slugify(text: string) {
    return text
        .replace(/:badge\[.*?\]/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
}

function walk(node: any) {
    if (node.type === 'heading' && node.depth === 2) {
        const { text, badge } = parseHeadingWithBadge(node);
        const heading: Heading = {
            label: text.replace(/:badge\[.*?\]/g, ''),
            link: `/changelog/#${slugify(text)}`,
        };

        if (badge) {
            heading.badge = {
                text: badge.text,
                variant: badge.variant
            }
        }

        headings.push(heading);
    }

    if (node.children) {
        for (const child of node.children) {
            walk(child);
        }
    }
}

walk(tree);

export default {
    label: 'Changelog',
    items: [
        ...headings
    ]
}