import { NotFound } from '@/components/NotFound'
import { AuthenticatedUserLocalStorageKey } from '@/const'
import { DashboardHeader } from '@/routes/_dashboard/-components/DashboardHeader'
import { DashboardSidebar } from '@/routes/_dashboard/-components/DashboardSidebar'
import { SidebarProvider } from '@/routes/_dashboard/-components/SidebarContext'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import styles from './DashboardLayout.module.scss'

export const Route = createFileRoute('/_dashboard')({
  beforeLoad: ({ location }) => {
    const authenticatedUser = localStorage.getItem(
      AuthenticatedUserLocalStorageKey,
    )

    if (!authenticatedUser) {
      throw redirect({
        to: '/auth/login',
        replace: true,
        search: { redirect: location.href },
      })
    }
  },
  component: RouteComponent,
  notFoundComponent: () => (
    <NotFound homeLinkText="Go to Users" homeUrl="/users" />
  ),
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className={styles.layout}>
        <DashboardHeader />
        <div className={styles.body}>
          <DashboardSidebar />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
