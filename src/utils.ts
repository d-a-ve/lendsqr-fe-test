import { UserStatus, type UserStatus as UserStatusType } from '@/const'

export type UserStatusAction = 'activate' | 'blacklist' | 'inactivate'

export function getAvailableActions(status: UserStatusType): UserStatusAction[] {
  switch (status) {
    case UserStatus.Pending:
      return ['activate']
    case UserStatus.Active:
      return ['blacklist', 'inactivate']
    case UserStatus.Blacklisted:
    case UserStatus.Inactive:
      return ['activate']
    default:
      return []
  }
}

export function actionToStatus(action: UserStatusAction): UserStatusType {
  switch (action) {
    case 'activate':
      return UserStatus.Active
    case 'blacklist':
      return UserStatus.Blacklisted
    case 'inactivate':
      return UserStatus.Inactive
  }
}

export function statusVariant(
  status: UserStatusType,
): 'default' | 'success' | 'warning' | 'error' {
  switch (status) {
    case 'Active':
      return 'success'
    case 'Pending':
      return 'warning'
    case 'Blacklisted':
      return 'error'
    case 'Inactive':
    default:
      return 'default'
  }
}

export function formatCurrencyNGN(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-NG').format(value)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-NG').format(value)
}

export function formatDateJoined(iso: string) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}