// This is a shim for the solid-js web module. It is used to ensure that the solid-js web module is loaded correctly.

export * from '../../node_modules/@solidjs/web/dist/web.js';
export { addEventListener as addEvent } from '../../node_modules/@solidjs/web/dist/web.js';
