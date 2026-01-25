import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard-layout/users/$userId"!</div>
}
