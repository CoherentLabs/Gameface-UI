import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightLinksValidator from 'starlight-links-validator';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import coherentTheme from 'coherent-docs-theme'
import starlightSidebarTopics from 'starlight-sidebar-topics';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { componentSidebarItems } from './src/config/componentSidebarItems';
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
    label: 'Community Recipes',
    link: '/recipes/',
  },
  {
    id: 'changelog',
    label: 'Changelog',
    link: '/changelog/',
    items: []
  },
];

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
        }),
        starlightLinksValidator()
      ],
      social: [
        {
          icon: 'seti:github',
          label: 'Git',
          href: 'https://github.com/CoherentLabs/Gameface-UI',
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
