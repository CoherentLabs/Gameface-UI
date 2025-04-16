import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeRapide from 'starlight-theme-rapide'
import starlightLinksValidator from 'starlight-links-validator';
import starlightHeadingBadges from 'starlight-heading-badges'

export default defineConfig({
  integrations: [
    starlight({
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
        {
          label: 'Changelog',
          collapsed: true,
          autogenerate: { directory: 'changelog', collapsed: false },
        },
      ],
      social: {
        email: 'https://coherent-labs.com/get-in-touch',
        github: 'https://github.com/CoherentLabs/Gameface-UI',
      },
      title: 'GamefaceUI',
    }),
  ],
  site: 'https://gameface-ui.coherent-labs.com',
})
