import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-confusing-void-expression': 0,
      '@typescript-eslint/no-floating-promises': 0,
      '@typescript-eslint/strict-boolean-expressions': 0,
      'react/react-in-jsx-scope': 0,
      '': 0,

      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          endOfLine: 'lf',
          semi: false,
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'all',
          bracketSpacing: true,
          jsxBracketSameLine: false,
          arrowParens: 'always',
          singleAttributePerLine: true,
        },
      ],
    },
  },
]
