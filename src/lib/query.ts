import { UserLocalStorageKey, type UserStatus } from '@/const'
import { users } from '@/mocks'
import type { UserFilters } from '@/routes/_dashboard/-components/UserFilterPopover'
import type { User } from '@/types'
import { sleep } from '@/utils'
import { QueryClient, mutationOptions, queryOptions } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
})

export type UsersQueryParams = {
  page: number
  pageSize: number
  filters?: UserFilters
}

export function applyFilters(users: User[], filters: UserFilters) {
  const org = filters.organization?.trim()
  const username = filters.username?.trim().toLowerCase()
  const email = filters.email?.trim().toLowerCase()
  const phone = filters.phoneNumber?.trim()
  const date = filters.dateJoined?.trim()
  const status = filters.status

  return users.filter((u) => {
    if (org && u.organization !== org) return false
    if (status && u.status !== status) return false
    if (username && !u.username.toLowerCase().includes(username)) return false
    if (email && !u.email.toLowerCase().includes(email)) return false
    if (phone && !u.phoneNumber.includes(phone)) return false
    if (date && u.dateJoined.slice(0, 10) !== date) return false
    return true
  })
}

export const usersQueryOptions = (params: UsersQueryParams) =>
  queryOptions({
    queryKey: ['users', params],
    queryFn: async () => {
      await sleep(3000)

      const localStorageData = localStorage.getItem(UserLocalStorageKey)
      const allUsers = localStorageData
        ? (JSON.parse(localStorageData) as User[])
        : users

      const organizationSet = new Set(allUsers.map((u) => u.organization))
      const organizations = Array.from(organizationSet).sort((a, b) =>
        a.localeCompare(b),
      )

      const filteredUsers = params.filters
        ? applyFilters(allUsers, params.filters)
        : allUsers

      const pageUsers = filteredUsers.slice(
        (params.page - 1) * params.pageSize,
        params.page * params.pageSize,
      )

      const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / params.pageSize),
      )

      return {
        organizations,
        filteredUsers,
        totalPages,
        pageUsers,
      }
    },
  })

export const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['user', userId] as const,
    queryFn: async () => {
      await sleep(3000)

      const localStorageData = localStorage.getItem(UserLocalStorageKey)
      const data = localStorageData
        ? (JSON.parse(localStorageData) as User[])
        : users

      const user = data.find((u) => u.id === userId)

      if (!user) {
        throw new Error(`User with id ${userId} not found`)
      }

      return user
    },
  })

export const searchUsersQueryOptions = (searchTerm: string) =>
  queryOptions({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      await sleep(3000)

      const localStorageData = localStorage.getItem(UserLocalStorageKey)
      const allUsers = localStorageData
        ? (JSON.parse(localStorageData) as User[])
        : users

      const term = searchTerm.toLowerCase().trim()

      const filteredUsers = allUsers.filter((user) => {
        const nameMatch = user.profile.fullName.toLowerCase().includes(term)
        const emailMatch = user.email.toLowerCase().includes(term)
        return nameMatch || emailMatch
      })

      return filteredUsers.slice(0, 20)
    },
    enabled: searchTerm.length > 0,
  })

export type UpdateUserStatusVariables = {
  userId: string
  status: UserStatus
  pagination?: { page: number; pageSize: number }
}

export const updateUserStatusMutationOptions = mutationOptions({
  mutationFn: async (
    { userId, status, pagination }: UpdateUserStatusVariables,
    ctx,
  ) => {
    const localStorageData = localStorage.getItem(UserLocalStorageKey)
    const allUsers = localStorageData
      ? (JSON.parse(localStorageData) as User[])
      : users

    const updatedUsers = allUsers.map((u) =>
      u.id === userId ? { ...u, status } : u,
    )

    localStorage.setItem(UserLocalStorageKey, JSON.stringify(updatedUsers))

    const { page = 1, pageSize = 20 } = pagination ?? {}
    await Promise.all([
      ctx.client.invalidateQueries(usersQueryOptions({ page, pageSize })),
      ctx.client.invalidateQueries(userQueryOptions(userId))
    ])

    return updatedUsers.find((u) => u.id === userId)!
  },
})
