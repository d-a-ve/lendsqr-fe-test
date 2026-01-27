import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/Dropdown'
import { ErrorState } from '@/components/ErrorState'
import {
  NpLoanIcon,
  NpMoneyIcon,
  NpUserCheckIcon,
  NpUserGroupIcon,
  NpUsersIcon,
} from '@/components/Icons'
import { Pagination } from '@/components/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import { Skeleton } from '@/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { UserStatusValues } from '@/const'
import { usersQueryOptions } from '@/lib/query'
import {
  UserFilterPopover,
  type UserFilters,
} from '@/routes/_dashboard/-components/UserFilterPopover'
import { formatCompactNumber, formatDateJoined, statusVariant } from '@/utils'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { Eye, MoreVertical, UserX } from 'lucide-react'
import z from 'zod'
import styles from './users.index.module.scss'

const usersSearchSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  filters: z
    .object({
      organization: z.string().optional(),
      username: z.string().optional(),
      email: z.string().optional(),
      phoneNumber: z.string().optional(),
      dateJoined: z.string().optional(),
      status: z.enum(UserStatusValues).optional(),
    })
    .optional(),
})

export const Route = createFileRoute('/_dashboard/users/')({
  component: RouteComponent,
  validateSearch: zodValidator(usersSearchSchema),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      usersQueryOptions({ page: 1, pageSize: 20, filters: undefined }),
    ),
  pendingComponent: () => (
    <div className={styles.page}>
      <Skeleton heightInPx={48} widthInPx={100} />

      <section className={styles.stats} aria-label="User summary">
        <Skeleton heightInPx={150} />
        <Skeleton heightInPx={150} />
        <Skeleton heightInPx={150} />
        <Skeleton heightInPx={150} />
      </section>

      <Skeleton heightInPx={740} />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className={styles.page}>
      <ErrorState
        variant="generic"
        title="Failed to load users"
        description="We couldn't retrieve the user list. This might be a temporary issue with the server or your connection."
        errorCode={error.message}
      />
    </div>
  ),
})

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'purple' | 'blue' | 'orange' | 'pink'
}) {
  return (
    <div className={styles.statCard} aria-label={label}>
      <div className={styles.statIcon} data-tone={tone}>
        {icon}
      </div>
      <h3 className={styles.statLabel}>{label}</h3>
      <p className={styles.statValue}>{value}</p>
    </div>
  )
}

function RouteComponent() {
  const router = useRouter()
  const searchParams = Route.useSearch()

  const { data, isFetching } = useQuery({
    ...usersQueryOptions({
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      filters: searchParams.filters,
    }),
    placeholderData: keepPreviousData,
  })

  const {
    organizations = [],
    filteredUsers = [],
    totalPages = 1,
    pageUsers = [],
  } = data ?? {}

  const clampPage = (nextPage: number) =>
    Math.min(Math.max(nextPage, 1), totalPages)

  const onPageChange = (nextPage: number) => {
    router.navigate({
      to: '/users',
      search: {
        ...searchParams,
        page: clampPage(nextPage),
      },
    })
  }

  const onPageSizeChange = (size: number) => {
    router.navigate({
      to: '/users',
      search: {
        ...searchParams,
        pageSize: size,
        page: 1,
      },
    })
  }

  const resetFilters = () => {
    router.navigate({
      to: '/users',
      search: {
        ...searchParams,
        page: 1,
        filters: undefined,
      },
    })
  }

  const handleFilter = (filters: UserFilters) => {
    router.navigate({
      to: '/users',
      search: {
        ...searchParams,
        filters,
        page: 1,
      },
    })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Users</h1>
      </header>

      <section className={styles.stats} aria-label="User summary">
        <StatCard
          icon={<NpUsersIcon aria-hidden="true" />}
          label="Users"
          value="2,453"
          tone="purple"
        />
        <StatCard
          icon={<NpUserGroupIcon aria-hidden="true" />}
          label="Active Users"
          value="2,453"
          tone="blue"
        />
        <StatCard
          icon={<NpLoanIcon aria-hidden="true" />}
          label="Users with loans"
          value="12,453"
          tone="orange"
        />
        <StatCard
          icon={<NpMoneyIcon aria-hidden="true" />}
          label="Users with savings"
          value="102,453"
          tone="pink"
        />
      </section>

      <section
        className={styles.tableCard}
        aria-label="Users table"
        data-loading={isFetching}
        data-empty={pageUsers.length === 0}
      >
        <Table>
          <TableHeader>
            <TableHead>
              <span>Organization</span>
              <UserFilterPopover
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </TableHead>

            <TableHead>
              <span>Username</span>
              <UserFilterPopover
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </TableHead>

            <TableHead>
              <span>Email</span>
              <UserFilterPopover
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </TableHead>

            <TableHead>
              <span>Phone Number</span>
              <UserFilterPopover
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </TableHead>

            <TableHead>
              <span>Date Joined</span>
              <UserFilterPopover
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </TableHead>

            <TableHead>
              <span>Status</span>
              <UserFilterPopover
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </TableHead>

            <TableHead>
              <span className={styles.srOnly}>Actions</span>
            </TableHead>
          </TableHeader>

          <TableBody>
            {pageUsers.length > 0 &&
              pageUsers.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => {
                    router.navigate({
                      to: '/users/$userId',
                      params: { userId: user.id },
                    })
                  }}
                  className={styles.row}
                >
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>{formatDateJoined(user.dateJoined)}</TableCell>
                  <TableCell>
                    <Badge status={statusVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={styles.actionsCell}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={styles.kebabButton}
                        aria-label="Row actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className={styles.rowMenu}
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            router.navigate({
                              to: '/users/$userId',
                              params: { userId: user.id },
                            })
                          }}
                        >
                          <Eye aria-hidden="true" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            // updateUserStatus(user.id, 'Blacklisted')
                            e.stopPropagation()
                          }}
                        >
                          <UserX aria-hidden="true" />
                          Blacklist User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            // updateUserStatus(user.id, 'Active')
                            e.stopPropagation()
                          }}
                        >
                          <NpUserCheckIcon aria-hidden="true" />
                          Activate User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {pageUsers.length === 0 && (
          <div className={styles.emptyTableContent}>
            <p className={styles.noUsersFound}>
              No users found matching your filters.
            </p>
            <p className={styles.noUsersFoundDescription}>
              Try adjusting your filters or clearing them to see all users.
            </p>
            <div>
              <UserFilterPopover
                trigger={
                  <Button variant="primary" size="sm">
                    Change Filters
                  </Button>
                }
                filters={searchParams.filters}
                organizations={organizations}
                onFilter={handleFilter}
                onReset={resetFilters}
              />
            </div>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerText}>Showing</span>
          <Select
            value={searchParams.pageSize.toString()}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger size="sm" className={styles.selectTrigger}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {[10, 20, 50, 100].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className={styles.footerText}>
            out of {formatCompactNumber(filteredUsers.length)}
          </span>
        </div>

        <Pagination
          currentPage={searchParams.page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </footer>
    </div>
  )
}
