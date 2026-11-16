import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.next', 'public', '.playwright-mcp', 'scripts']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // react-three-fiber scenes mutate three.js objects (textures, uniforms, materials) by design
    files: [
      'src/lab/**/*.{js,jsx}',
      'src/home/Studio.jsx',
      'src/home/DotField.jsx',
      'src/home/Keychains.jsx',
      'src/machine/**/*.{js,jsx}',
      'src/worlds/ride/**/*.{js,jsx}',
      'src/worlds/longhorn/**/*.{js,jsx}',
      'src/worlds/album/**/*.{js,jsx}',
    ],
    rules: { 'react-hooks/immutability': 'off' },
  },
])
