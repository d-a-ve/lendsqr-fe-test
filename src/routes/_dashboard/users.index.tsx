import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Users Index</h1>
    </div>
  )
}
