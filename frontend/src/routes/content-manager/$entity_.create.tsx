import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/content-manager/$entity/create')({
  component: () => <div>Hello /content-manager/$entity/create!</div>
})