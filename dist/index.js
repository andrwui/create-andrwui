#!/usr/bin/env bun
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesDir = path.join(__dirname, '..', 'templates')

const baseDeps = [
  '@react-router/fs-routes',
  'tailwind-merge',
]

const devDeps = [
  'eslint',
  '@eslint/js',
  'typescript-eslint',
  'eslint-plugin-prettier',
  'eslint-config-prettier',
  'eslint-plugin-react',
  'prettier',
  'prettier-plugin-tailwindcss',
  '@trivago/prettier-plugin-sort-imports',
]

const optional = [
  { name: 'r3f', value: 'r3f' },
  { name: 'lenis', value: 'lenis' },
  { name: 'motion', value: 'framer-motion' },
  { name: 'gsap', value: 'gsap @gsap/react' },
  { name: 'lucide', value: 'lucide-react' },
  { name: 'zustand', value: 'zustand' },
  { name: 'react-spring', value: '@react-spring/web' },
  { name: 'supabase', value: 'supabase' },
  { name: 'prisma', value: 'prisma' },
]

const r3fDeps = [
  'three',
  '@types/three',
  '@react-three/fiber',
  '@react-three/drei',
  '@react-spring/three',
  '@react-three/postprocessing',
]

const supabaseDeps = [
  '@supabase/supabase-js',
  '@supabase/auth-helpers-remix',
]

const prismaDeps = [
  'prisma',
  '@prisma/client',
]

const exec = (cmd) =>
  execSync(cmd, { stdio: 'pipe', shell: true })

const status = (msg) =>
  process.stdout.write(`\r\x1b[K${msg}`)

const read = (f) =>
  fs.readFileSync(path.join(templatesDir, f), 'utf8')

const write = (target, content) =>
  fs.writeFileSync(target, content)

const projectNamePromptTheme = {
  prefix: '\uf002',
  style: {
    answer: (string) => string,
    message: (string) => string,
    error: (string) => string,
    defaultAnswer: (string) => `\x1b[2m${string}\x1b[0m`,
  },
}

const packageSelectionPromptTheme = {
  prefix: '\uf02d',
  icon: {
    checked: ' \uf0c8',
    unchecked: ' \uf096',
  },
  helpMode: 'never',
  style: {
    answer: (text) => ' ' + text,
    message: (text) => text,
    error: (text) => text,
    defaultAnswer: (text) => text,
    help: () => '',
    highlight: (text) => text,
    key: (text) => text,
    disabledChoice: (text) => text,
    description: (text) => text,
  },
}

const main = async () => {
  const { project } = await inquirer.prompt([
    {
      type: 'input',
      name: 'project',
      message: 'Project name:',
      default: 'andrwui-app',
      theme: projectNamePromptTheme,
    },
  ])

  const { optionalPackages } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'optionalPackages',
      message: 'Pick optional packages:',
      choices: optional,
      theme: packageSelectionPromptTheme,
    },
  ])

  const dir = path.resolve(process.cwd(), project)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  status('creating base app...')
  exec(`bun create react-router@latest ${project} --yes --template remix-run/react-router-templates/cloudflare`)
  process.chdir(dir)

  status('cleaning scaffold...')
  fs.rmSync('app/welcome', { recursive: true, force: true })
  fs.rmSync('public/favicon.ico', { force: true })
  fs.rmSync('app/routes/home.tsx', { force: true })

  status('injecting templates...')
  write('app/root.tsx', read('root.tsx'))
  write('app/routes.ts', read('routes.ts'))
  write('app/routes/_index.tsx', read('_index.tsx'))
  write('app/app.css', read('app.css'))
  write('app/entry.server.tsx', read('entry.server.tsx'))
  write('eslint.config.js', read('eslint.config.js'))

  let deps = [...baseDeps]
  if (optionalPackages.includes('r3f')) deps.push(...r3fDeps)
  if (optionalPackages.includes('supabase')) deps.push(...supabaseDeps)
  if (optionalPackages.includes('prisma')) deps.push(...prismaDeps)
  deps.push(...optionalPackages.filter(v => !['r3f', 'supabase', 'prisma'].includes(v)))

  status('installing base deps...')
  exec(`bun add ${deps.join(' ')}`)

  status('installing dev deps...')
  exec(`bun add -d ${devDeps.join(' ')}`)

  status('done\n')
  console.log(`\ncd ${project}\nbun dev\n`)
}

main()

