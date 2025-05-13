import type { Route } from './+types/_index'

export function meta() {
  return [{ title: 'andrwui' }, { name: 'description', content: "andrwui's create template" }]
}

export function loader() {
  return { message: 'hello andrwui' }
}

export default function({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.message}</div>
}
