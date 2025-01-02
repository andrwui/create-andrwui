import { execSync } from "child_process";
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { fileURLToPath } from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const templatesDir = path.join(__dirname, '..', 'templates')

const init = async () => {

  let projectName = process.argv[2]

  if (!projectName) {
    const { projectName: inputName } = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'project name:',
      initial: 'my-project',
    })
    projectName = inputName
  }

  const { useRouter } = await prompts({
    type: 'select',
    name: 'useRouter',
    message: 'install react router?',
    initial: 1,
    choices: [
      { title: 'yes', value: true },
      { title: 'no', value: false }
    ]
  })

  console.log('creating vite react-swc-ts project...')
  execSync(`pnpm --silent create vite@latest ${projectName} --template react-swc-ts`, { stdio: 'ignore' })
  process.chdir(projectName)

  console.log('installing dependencies...')
  execSync('pnpm install', { stdio: 'ignore' })
  execSync('pnpm add -D tailwindcss postcss autoprefixer eslint eslint-config-prettier eslint-plugin-prettier ', { stdio: 'ignore' })

  if (useRouter) {
    execSync('pnpm --silent add react-router-dom', { stdio: 'ignore' })
  }

  console.log('setting up tailwind...')
  execSync('pnpx tailwindcss init -p', { stdio: 'ignore' })

  console.log('cleaning up defaults...')
  fs.unlinkSync('src/assets/react.svg')
  fs.rmdirSync('src/assets')
  fs.unlinkSync('public/vite.svg')
  fs.unlinkSync('src/App.css')

  const copyTemplate = (templateName, destination) => {
    const content = fs.readFileSync(
      path.join(templatesDir, templateName),
      'utf-8'
    )
    fs.writeFileSync(destination, content)
  }

  console.log('copying template...')
  copyTemplate('App.tsx', 'src/App.tsx')
  copyTemplate(useRouter ? 'main-router.tsx' : 'main.tsx', 'src/main.tsx')
  copyTemplate('eslint.config.js', 'eslint.config.js')
  copyTemplate('tailwind.config.js', 'tailwind.config.js')
  copyTemplate('index.css', 'src/index.css')

  console.log('\nsetup completed.')
  console.log(`\nnow: cd ${projectName}.`)
  console.log(`pnpm run dev.`)

}

init().catch((e) => {
  console.error(e)
})
