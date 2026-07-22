import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import tokensValidator from './eslint-custom-rules/tokens-validator.js';
import gameface from 'eslint-plugin-gameface';

export default defineConfig([
    {
        ignores: ['**/node_modules/**', 'dist/**', 'docs/**', 'tests/**', '**/**.html'],
    },
    ...gameface.configs['flat/recommended'],
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
    tseslint.configs.base,
]);
