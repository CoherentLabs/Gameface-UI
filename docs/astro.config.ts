import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeRapide from 'starlight-theme-rapide'
import starlightLinksValidator from 'starlight-links-validator';
import starlightHeadingBadges from 'starlight-heading-badges'
import changelogSidebar from './src/changelogSideBar';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default defineConfig({
  integrations: [
    starlight({
      expressiveCode: {
        plugins: [pluginCollapsibleSections()],
      },
      favicon: '/favicon-32x32.png',
      logo: {
        dark: './src/assets/gameface-ui-header-dark.svg',
        light: './src/assets/gameface-ui-header-light.svg',
        replacesTitle: true
      },
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
      },
      credits: false,
      customCss: ['./src/styles/custom.css'],
      plugins: [starlightThemeRapide(), starlightLinksValidator(), starlightHeadingBadges()],
      sidebar: [
        {
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
        changelogSidebar,
      ],
      social: [
        {
          icon: 'open-book',
          label: 'Documentation',
          href: 'https://coherent-labs.com/documentation',
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
