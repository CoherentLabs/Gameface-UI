import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightLinksValidator from 'starlight-links-validator';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import coherentTheme, { generateDocsChangelog, generateVersionWithPackageJSON } from 'coherent-docs-theme'
import path from 'node:path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default defineConfig({
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
          documentationSearchTag: "Gameface UI"
        }),
        starlightLinksValidator()
      ],
      sidebar: [
        await generateVersionWithPackageJSON(
          '../package.json',
          'https://github.com/CoherentLabs/Gameface-UI'
        ), {
          label: 'Gettings Started',
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
          href: 'https://coherent-labs.com/get-in-touch'
        },
      ],
      title: 'GamefaceUI',
    }),
  ],
  site: 'https://gameface-ui.coherent-labs.com',
})
