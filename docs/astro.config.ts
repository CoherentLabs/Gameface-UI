import starlight from '@astrojs/starlight';
import solid from '@astrojs/solid-js';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import coherentTheme from 'coherent-docs-theme'
import starlightSidebarTopics from 'starlight-sidebar-topics';
import coherentTheme, { generateDocsChangelog, generateVersionWithPackageJSON } from 'coherent-docs-theme';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { componentSidebarItems, recipesSidebarItems } from './src/config/sidebarItems';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sidebarTopics = [
  {
    id: 'documentation',
    label: 'Documentation',
    link: '/docs/',
    items: [
      {
        label: 'Getting Started',
        autogenerate: { directory: 'docs/getting-started' },
      },
      {
        label: 'Concepts',
        autogenerate: { directory: 'docs/concepts' },
      },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    link: '/components/',
    items: componentSidebarItems(),
  },
  {
    id: 'recipes',
    label: 'Community Recipes',
    link: '/recipes/',
    items: recipesSidebarItems(),
  },
  {
    id: 'changelog',
    label: 'Changelog',
    link: '/changelog/',
    items: []
  },
  {
    id: 'submit-recipe',
    label: 'Submit Recipe',
    link: '/submit-recipe/',
    items: []
  },
];

import { gfuiDemoPlugin } from './src/components/CodePreviewGFUI/plugins/vite-plugin-gfui-demo';
import { remarkGfuiDemo } from './src/components/CodePreviewGFUI/plugins/remark-gfui-demo';

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default defineConfig({
  vite: {
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@components': path.join(__dirname, "src", "components"),
      }
    }
  },
  integrations: [
    starlight({
      expressiveCode: {
        plugins: [pluginCollapsibleSections()],
      },
      components: {
        Sidebar: '@components/CustomSidebar.astro',
      },
      favicon: '/favicon-32x32.png',
      credits: false,
      customCss: ['./src/styles/custom.css'],
      plugins: [
        ...coherentTheme({
          documentationSearchTag: "Gameface UI"
        }),
        starlightSidebarTopics(sidebarTopics, {
          exclude: ['/'],
          topics: {
            recipes: ['/recipes', '/recipes/**'],
          },
        }),
        starlightLinksValidator(),
      ],
      social: [
    markdown: {
        remarkPlugins: [remarkGfuiDemo],
    },
    vite: {
        plugins: [gfuiDemoPlugin()],
        build: {
            cssCodeSplit: true,
            minify: false, // for easier debugging of emitted demo chunks and manifest
        },
        {
          icon: 'seti:github',
          label: 'Git',
          href: 'https://github.com/CoherentLabs/Gameface-UI',
        resolve: {
            preserveSymlinks: true,
            dedupe: ['solid-js', 'solid-js/web', 'solid-js/store'], // ensure singletons of Solid packages
            alias: {
                '@components': path.resolve(__dirname, '../src/components'),
                '@custom-components': path.resolve(__dirname, '../src/custom-components'),
                '@assets': path.resolve(__dirname, '../src/assets'),
            },
        },
        {
          icon: 'laptop',
          label: 'Site',
          href: 'https://coherent-labs.com/',
        },
        {
          icon: 'email',
          label: 'Email',
          href: 'https://coherent-labs.com/get-in-touch'
        },
      ],
      title: 'GamefaceUI',
    }),
  ],
  site: 'https://gameface-ui.coherent-labs.com',
})
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
          @use '@assets/scss/variables' as *;
        `,
                    api: 'modern',
                },
            },
        },
    },
    integrations: [
        starlight({
            expressiveCode: {
                plugins: [pluginCollapsibleSections()],
            },
            favicon: '/favicon-32x32.png',
            credits: false,
            customCss: ['./src/styles/custom.css'],
            plugins: [
                ...coherentTheme({
                    documentationSearchTag: 'Gameface UI',
                }),
                starlightLinksValidator(),
            ],
            sidebar: [
                await generateVersionWithPackageJSON('../package.json', 'https://github.com/CoherentLabs/Gameface-UI'),
                {
                    label: 'Getting Started',
                    autogenerate: { directory: 'getting-started' },
                },
                {
                    label: 'Concepts',
                    autogenerate: { directory: 'concepts' },
                },
                {
                    label: 'Components',
                    collapsed: true,
                    autogenerate: { directory: 'components', collapsed: false },
                },
                generateDocsChangelog(path.join(__dirname, `./src/content/docs/changelog/index.mdx`)),
            ],
            social: [
                {
                    icon: 'laptop',
                    label: 'Site',
                    href: 'https://coherent-labs.com/',
                },
                {
                    icon: 'email',
                    label: 'Email',
                    href: 'https://coherent-labs.com/get-in-touch',
                },
            ],
            title: 'GamefaceUI',
        }),
        solid(),
    ],
    site: 'https://gameface-ui.coherent-labs.com',
});
