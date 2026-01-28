import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/Dropdown'
import { NpUserCheckIcon } from '@/components/Icons'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { updateUserStatusMutationOptions } from '@/lib/query'
import type { UserFilters } from '@/routes/_dashboard/-components/UserFilterPopover'
import { UserFilterPopover } from '@/routes/_dashboard/-components/UserFilterPopover'
import { UserStatusModal } from '@/routes/_dashboard/-components/UserStatusModal'
import type { User } from '@/types'
import {
  actionToStatus,
  formatDateJoined,
  getAvailableActions,
  statusVariant,
  type UserStatusAction,
} from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Eye, MoreVertical, UserMinus, UserX } from 'lucide-react'
import { useState } from 'react'
import styles from './UsersTable.module.scss'

type PendingAction = {
  userName: string
  userId: string
  action: UserStatusAction
} | null

type UsersTableProps = {
  users: User[]
  organizations: string[]
  filters?: UserFilters
  onFilter: (filters: UserFilters) => void
  onResetFilters: () => void
  pagination: { page: number; pageSize: number }
}

export function UsersTable({
  users,
  organizations,
  filters,
  onFilter,
  onResetFilters,
  pagination,
}: UsersTableProps) {
  const router = useRouter()
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const updateStatus = useMutation(updateUserStatusMutationOptions)

  const handleConfirm = () => {
    if (!pendingAction) return
    const newStatus = actionToStatus(pendingAction.action)
    updateStatus.mutate(
      { userId: pendingAction.userId, status: newStatus, pagination },
      { onSettled: () => setPendingAction(null) },
    )
  }

  const handleActionClick = (
    e: React.MouseEvent,
    user: User,
    action: UserStatusAction,
  ) => {
    e.stopPropagation()
    setPendingAction({
      userName: user.profile.fullName,
      userId: user.id,
      action,
    })
  }

  const renderActionItems = (user: User) => {
    const availableActions = getAvailableActions(user.status)

    return (
      <>
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

        {availableActions.includes('blacklist') && (
          <DropdownMenuItem
            onClick={(e) => handleActionClick(e, user, 'blacklist')}
          >
            <UserX aria-hidden="true" />
            Blacklist User
          </DropdownMenuItem>
        )}

        {availableActions.includes('activate') && (
          <DropdownMenuItem
            onClick={(e) => handleActionClick(e, user, 'activate')}
          >
            <NpUserCheckIcon aria-hidden="true" />
            Activate User
          </DropdownMenuItem>
        )}

        {availableActions.includes('inactivate') && (
          <DropdownMenuItem
            onClick={(e) => handleActionClick(e, user, 'inactivate')}
          >
            <UserMinus aria-hidden="true" />
            Inactivate User
          </DropdownMenuItem>
        )}
      </>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableHead>
            <span>Organization</span>
            <UserFilterPopover
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </TableHead>

          <TableHead>
            <span>Username</span>
            <UserFilterPopover
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </TableHead>

          <TableHead>
            <span>Email</span>
            <UserFilterPopover
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </TableHead>

          <TableHead>
            <span>Phone Number</span>
            <UserFilterPopover
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </TableHead>

          <TableHead>
            <span>Date Joined</span>
            <UserFilterPopover
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </TableHead>

          <TableHead>
            <span>Status</span>
            <UserFilterPopover
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </TableHead>

          <TableHead>
            <span className={styles.srOnly}>Actions</span>
          </TableHead>
        </TableHeader>

        <TableBody>
          {users.length > 0 &&
            users.map((user) => (
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
                      {renderActionItems(user)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
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
              filters={filters}
              organizations={organizations}
              onFilter={onFilter}
              onReset={onResetFilters}
            />
          </div>
        </div>
      )}

      <UserStatusModal
        userName={pendingAction?.userName ?? ''}
        action={pendingAction?.action ?? 'activate'}
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onConfirm={handleConfirm}
        isLoading={updateStatus.isPending}
      />
    </>
  )
}
