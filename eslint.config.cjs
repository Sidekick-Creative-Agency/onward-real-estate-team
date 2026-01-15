const { defineConfig, globalIgnores } = require('eslint/config')

// const js = require('@eslint/js')

// const { FlatCompat } = require('@eslint/eslintrc')

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
//   allConfig: js.configs.all,
// })

module.exports = defineConfig([
  {
    extends: ['next'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  globalIgnores([
    '**/.tmp',
    '**/.git',
    '**/.hg',
    '**/.pnp.*',
    '**/.svn',
    '**/.yarn/**/*',
    '**/build',
    '**/dist/**/*',
    '**/node_modules',
    '**/temp',
    '**/playwright.config.ts',
    '**/jest.config.js',
  ]),
])
