import { AuthenticatedUserLocalStorageKey } from '@/const'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const authenticatedUser = localStorage.getItem(
      AuthenticatedUserLocalStorageKey,
    )
    if (authenticatedUser) {
      throw redirect({ to: '/users', replace: true })
    } else {
      throw redirect({ to: '/auth/login', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Welcome!!</div>
}
