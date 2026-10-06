import type { Plugin } from 'vite';

// Astro's asset pipeline resolves an SVG import to an ImageMetadata object
// ({ src, width, height, format }); the Vite setup the library itself ships with
// resolves it to a plain URL string. Components interpolate `src` straight into
// `url(...)`, so under Astro they receive an object and emit `url([object Object])`
// - invalid CSS, which the browser drops silently, leaving the element blank.
//
// Appending `?url` opts these imports out of Astro's pipeline, so a preview resolves
// assets exactly the way a consuming project does. Two things keep this narrow:
//
//   - Only importers inside the library source match, so the docs' own images keep
//     Astro's handling (and its optimisations).
//   - Only bare `.svg` specifiers match. Every SVG the library imports as a Solid
//     component already carries an explicit `?component-solid` suffix, so those are
//     left alone and still render as inline <svg>.
export function gfuiLibrarySvgUrlPlugin(librarySrc: string): Plugin {
    const root = librarySrc.replace(/\\/g, '/').replace(/\/$/, '');

    return {
        name: 'gfui-library-svg-as-url',
        enforce: 'pre',

        async resolveId(source, importer) {
            if (!importer || !source.endsWith('.svg')) return null;
            if (!importer.replace(/\\/g, '/').startsWith(root)) return null;

            const resolved = await this.resolve(source, importer, { skipSelf: true });
            return resolved ? `${resolved.id}?url` : null;
        },
    };
}
