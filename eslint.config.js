// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist/**', '.astro/**', 'node_modules/**']),
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginAstro.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
]);
