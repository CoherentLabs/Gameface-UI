// Replaces vite-plugin-solid-svg's own types: they use solid-js's ComponentProps<'svg'>, which is `never` in Solid 2
// (element types moved to @solidjs/web). Plain `.svg` imports stay URLs, typed by vite/client.
declare module '*.svg?component-solid' {
    import type { Component } from 'solid-js';
    import type { ComponentProps } from '@solidjs/web';
    const component: Component<ComponentProps<'svg'>>;
    export default component;
}
