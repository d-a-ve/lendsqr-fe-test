import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select'
import type { UserStatus } from '@/const'
import { CalendarDays, ListFilter } from 'lucide-react'
import { useState, type ReactElement } from 'react'
import styles from './UserFilterPopover.module.scss'

export type UserFilters = {
  organization?: string
  username?: string
  email?: string
  phoneNumber?: string
  dateJoined?: string // YYYY-MM-DD
  status?: UserStatus
}

function normalizeFilters(filters: UserFilters): UserFilters {
  const next: UserFilters = {
    organization: filters.organization?.trim() || undefined,
    username: filters.username?.trim() || undefined,
    email: filters.email?.trim() || undefined,
    phoneNumber: filters.phoneNumber?.trim() || undefined,
    dateJoined: filters.dateJoined?.trim() || undefined,
    status: filters.status,
  }

  return next
}

type UserFilterPopoverProps = {
  filters: UserFilters | undefined
  organizations: string[]
  onFilter: (filters: UserFilters) => void
  onReset: () => void
  trigger?: ReactElement
}

export const UserFilterPopover = ({
  filters,
  organizations,
  onFilter,
  onReset,
  trigger,
}: UserFilterPopoverProps) => {
  const [open, setOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<UserFilters>({})

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFilter(normalizeFilters(draftFilters))
    setOpen(false)
  }

  const handleReset = () => {
    setDraftFilters({})
    onReset()
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) {
          setDraftFilters(filters ?? {})
        }
      }}
    >
      <PopoverTrigger
        render={
          trigger ?? (
            <button
              type="button"
              className={styles.headerIconButton}
              aria-label="Open filters"
            >
              <ListFilter aria-hidden="true" />
            </button>
          )
        }
      />
      <PopoverContent
        align="start"
        sideOffset={12}
        className={styles.filterPopover}
      >
        <form className={styles.filterForm} onSubmit={handleFilter}>
          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Organization</label>
            <Select
              value={draftFilters.organization}
              onValueChange={(value) => {
                if (!value) return

                setDraftFilters((prev) => ({
                  ...prev,
                  organization: value,
                }))
              }}
            >
              <SelectTrigger size="sm" className={styles.filterInput}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent align="start">
                {organizations.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Username</label>
            <Input
              placeholder="User"
              value={draftFilters.username ?? ''}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, username: e.target.value }))
              }
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Email</label>
            <Input
              placeholder="Email"
              value={draftFilters.email ?? ''}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, email: e.target.value }))
              }
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Date</label>
            <div className={styles.dateField}>
              <Input
                type="date"
                value={draftFilters.dateJoined ?? ''}
                onChange={(e) =>
                  setDraftFilters((p) => ({ ...p, dateJoined: e.target.value }))
                }
                className={styles.filterInput}
              />
              <CalendarDays className={styles.dateIcon} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Phone Number</label>
            <Input
              placeholder="Phone Number"
              value={draftFilters.phoneNumber ?? ''}
              onChange={(e) =>
                setDraftFilters((p) => ({ ...p, phoneNumber: e.target.value }))
              }
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterField}>
            <label className={styles.filterLabel}>Status</label>
            <Select
              value={draftFilters.status}
              onValueChange={(value) => {
                setDraftFilters((prev) => ({
                  ...prev,
                  status: value as UserStatus,
                }))
              }}
            >
              <SelectTrigger size="sm" className={styles.filterInput}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent align="start">
                {(
                  ['Active', 'Inactive', 'Pending', 'Blacklisted'] as const
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={styles.filterActions}>
            <Button
              type="button"
              variant="outline-primary"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button type="submit">Filter</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
