import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/content-types/$entity/create')({
  component: () => <div>Hello /content-types/$entity/create!</div>
})