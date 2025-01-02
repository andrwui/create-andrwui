#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import prompts from 'prompts'

const projectName = process.argv[2] || 'my-vite-project'

async function init() {

  const { projectName: inputProjectName } = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    initial: 'my-project'
  })

  const projectName = inputProjectName || 'my-project'

  const { useRouter } = await prompts({
    type: 'confirm',
    name: 'useRouter',
    message: 'Do you want to add React Router?',
    initial: false
  })

  console.log('Creating Vite project...')
  execSync(`pnpm --silent create vite@latest ${projectName} --template react-swc-ts`, { stdio: 'ignore' })

  process.chdir(projectName)

  console.log('Installing dependencies...')
  execSync('pnpm --silent install', { stdio: 'ignore' })
  execSync('pnpm --silent install -D tailwindcss postcss autoprefixer eslint eslint-config-prettier eslint-plugin-prettier', { stdio: 'ignore' })

  if (useRouter) {
    console.log('Installing React Router...')
    execSync('pnpm --silent install react-router-dom', { stdio: 'ignore' })
  }

  console.log('Setting up Tailwind...')
  execSync('npx tailwindcss init -p', { stdio: 'ignore' })

  console.log('Cleaning up default assets...')
  fs.unlinkSync('src/assets/react.svg')
  fs.rmdirSync('src/assets')
  fs.unlinkSync('public/vite.svg')
  fs.unlinkSync('src/App.css')

  const simpleApp = `function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">Hello World!</h1>
    </div>
  )
}

export default App`

  fs.writeFileSync('src/App.tsx', simpleApp)

  const mainContent = useRouter
    ? `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)`
    : `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)`

  fs.writeFileSync('src/main.tsx', mainContent)

  const eslintConfig = `import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
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
]`

  // Tailwind config
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`

  fs.writeFileSync('eslint.config.js', eslintConfig)
  fs.writeFileSync('tailwind.config.js', tailwindConfig)

  const tailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`
  fs.writeFileSync('src/index.css', tailwindCss)

  console.log('\nSetup complete.')
}

init().catch((e) => {
  console.error(e)
})
