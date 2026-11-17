import { defineConfig } from 'eslint/config';
import tokensValidator from './eslint-custom-rules/tokens-validator.js';
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
