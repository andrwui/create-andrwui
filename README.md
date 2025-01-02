# andrwui's project starter

this is the repository for create-andrwui, my personal project starter. 
it sets custom settings and installs my regular packages for a react app.

> powered by [vite](https://vite.dev/).

> check the package in [npm](https://www.npmjs.com/package/create-andrwui).

> [!IMPORTANT]
> pnpm MUST be installed to use this project starter.


## what's being installed?

- SWC
- React 
- TypeScript
- Eslint (_with prettier_)
- Tailwind CSS
- React Router (_optional_)

## usage

you just need to run the following command:

`pnpm create andrwui@latest <project_name>`
> [!NOTE]
> <project_name> is optional and can be entered on the cli.

you will then recieve a prompt on if you want react router to be installed.
if `yes` is selected, this will add a `<BrowserRouter>` wrapper to your `main.tsx` file.

now your project is created, the last thing you should do is:

`cd <project_name>` and `pnpm run dev`
