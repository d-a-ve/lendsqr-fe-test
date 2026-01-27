export const UserStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
  Pending: 'Pending',
  Blacklisted: 'Blacklisted',
} as const

export const UserStatusValues = Object.values(UserStatus)

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export const UserLocalStorageKey = 'lendsqr-users'

export const AuthenticatedUserLocalStorageKey = 'lendsqr-authenticated-user'