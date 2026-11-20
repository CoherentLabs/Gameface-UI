import { defineConfig } from 'eslint/config';
import tokensValidator from './eslint-custom-rules/tokens-validator.js';
import noUnknownNamespaces from './eslint-custom-rules/no-unknown-namespaces.mjs';
import gameface from 'eslint-plugin-gameface';
import solidV2 from 'eslint-plugin-solid/configs/v2';

export default defineConfig([
    {
        ignores: ['**/node_modules/**', 'dist/**', 'docs/**', 'tests/**', '**/**.html'],
    },
    ...gameface.configs['flat/recommended'],
    // Solid 2 rules (removed 1.x APIs, single-arg createEffect, writes in
    // computations, destructured props, ...). The TS parser comes from the
    // gameface config above.
    {
        ...solidV2,
        files: ['src/**/*.{ts,tsx}'],
    },
    // Same rule, but `attr:*` on components is allowed: BaseComponent applies it to the root element.
    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: {
            'gameface-ui': { rules: { 'no-unknown-namespaces': noUnknownNamespaces } },
        },
        rules: {
            'solid/no-unknown-namespaces': 'off',
            'gameface-ui/no-unknown-namespaces': solidV2.rules['solid/no-unknown-namespaces'],
        },
    },
    {
        files: ['**/*.tsx'],
        plugins: {
            custom: {
                rules: {
                    'tokens-validator': tokensValidator,
                },
            },
        },
        rules: {
            'custom/tokens-validator': 'warn',
        },
    },
]);
