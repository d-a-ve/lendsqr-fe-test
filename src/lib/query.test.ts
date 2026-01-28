import type { User } from '@/types'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { applyFilters, userQueryOptions, usersQueryOptions, searchUsersQueryOptions } from './query'

const mockUsers: User[] = [
  {
    id: '1',
    organization: 'Lendsqr',
    username: 'johndoe',
    email: 'john@lendsqr.com',
    phoneNumber: '08012345678',
    dateJoined: '2024-01-15T10:00:00.000Z',
    status: 'Active',
    profile: {
      fullName: 'John Doe',
      avatarUrl: null,
      bvn: '12345678901',
      gender: 'Male',
      maritalStatus: 'Single',
      children: 'None',
      typeOfResidence: 'Apartment',
    },
    tier: 2,
    accountSummary: {
      balance: 50000,
      accountNumber: '1234567890',
      bankName: 'Test Bank',
    },
    educationAndEmployment: {
      levelOfEducation: 'BSc',
      employmentStatus: 'Employed',
      sectorOfEmployment: 'Tech',
      durationOfEmployment: '3 years',
      officeEmail: 'john.work@test.com',
      monthlyIncome: [100000, 200000],
      loanRepayment: 50000,
    },
    socials: {
      twitter: '@johndoe',
      facebook: 'johndoe',
      instagram: '@johndoe',
    },
    guarantors: [],
  },
  {
    id: '2',
    organization: 'Irorun',
    username: 'janesmith',
    email: 'jane@irorun.com',
    phoneNumber: '08098765432',
    dateJoined: '2024-02-20T14:00:00.000Z',
    status: 'Pending',
    profile: {
      fullName: 'Jane Smith',
      avatarUrl: null,
      bvn: '98765432101',
      gender: 'Female',
      maritalStatus: 'Married',
      children: '2',
      typeOfResidence: 'House',
    },
    tier: 1,
    accountSummary: {
      balance: 75000,
      accountNumber: '0987654321',
      bankName: 'Another Bank',
    },
    educationAndEmployment: {
      levelOfEducation: 'MSc',
      employmentStatus: 'Employed',
      sectorOfEmployment: 'Finance',
      durationOfEmployment: '5 years',
      officeEmail: 'jane.work@test.com',
      monthlyIncome: [200000, 400000],
      loanRepayment: 100000,
    },
    socials: {
      twitter: '@janesmith',
      facebook: 'janesmith',
      instagram: '@janesmith',
    },
    guarantors: [],
  },
  {
    id: '3',
    organization: 'Lendsqr',
    username: 'bobwilson',
    email: 'bob@lendsqr.com',
    phoneNumber: '07011112222',
    dateJoined: '2024-01-15T10:00:00.000Z',
    status: 'Blacklisted',
    profile: {
      fullName: 'Bob Wilson',
      avatarUrl: null,
      bvn: '11122233344',
      gender: 'Male',
      maritalStatus: 'Single',
      children: 'None',
      typeOfResidence: 'Apartment',
    },
    tier: 3,
    accountSummary: {
      balance: 10000,
      accountNumber: '1112223334',
      bankName: 'Test Bank',
    },
    educationAndEmployment: {
      levelOfEducation: 'HND',
      employmentStatus: 'Self-employed',
      sectorOfEmployment: 'Retail',
      durationOfEmployment: '2 years',
      officeEmail: 'bob@business.com',
      monthlyIncome: [50000, 100000],
      loanRepayment: 25000,
    },
    socials: {
      twitter: '@bobwilson',
      facebook: 'bobwilson',
      instagram: '@bobwilson',
    },
    guarantors: [],
  },
]

describe('applyFilters', () => {
  it('returns all users when no filters applied', () => {
    const result = applyFilters(mockUsers, {})
    expect(result).toHaveLength(3)
  })

  it('filters by organization (exact match)', () => {
    const result = applyFilters(mockUsers, { organization: 'Lendsqr' })
    expect(result).toHaveLength(2)
    expect(result.every((u) => u.organization === 'Lendsqr')).toBe(true)
  })

  it('filters by status (exact match)', () => {
    const result = applyFilters(mockUsers, { status: 'Active' })
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('johndoe')
  })

  it('filters by username (case-insensitive partial match)', () => {
    const result = applyFilters(mockUsers, { username: 'JOHN' })
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('johndoe')
  })

  it('filters by email (case-insensitive partial match)', () => {
    const result = applyFilters(mockUsers, { email: 'LENDSQR' })
    expect(result).toHaveLength(2)
  })

  it('filters by phone number (partial match)', () => {
    const result = applyFilters(mockUsers, { phoneNumber: '0801' })
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('johndoe')
  })

  it('filters by date joined (YYYY-MM-DD format)', () => {
    const result = applyFilters(mockUsers, { dateJoined: '2024-01-15' })
    expect(result).toHaveLength(2)
  })

  it('combines multiple filters', () => {
    const result = applyFilters(mockUsers, {
      organization: 'Lendsqr',
      status: 'Active',
    })
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('johndoe')
  })

  it('returns empty array when no matches', () => {
    const result = applyFilters(mockUsers, { organization: 'NonExistent' })
    expect(result).toHaveLength(0)
  })

  it('trims whitespace from filter values', () => {
    const result = applyFilters(mockUsers, { organization: '  Lendsqr  ' })
    expect(result).toHaveLength(2)
  })
})

describe('pagination logic', () => {
  const calculatePagination = (
    users: User[],
    page: number,
    pageSize: number,
  ) => {
    const pageUsers = users.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.max(1, Math.ceil(users.length / pageSize))
    return { pageUsers, totalPages }
  }

  it('returns correct page slice', () => {
    const { pageUsers } = calculatePagination(mockUsers, 1, 2)
    expect(pageUsers).toHaveLength(2)
    expect(pageUsers[0].id).toBe('1')
    expect(pageUsers[1].id).toBe('2')
  })

  it('returns correct second page', () => {
    const { pageUsers } = calculatePagination(mockUsers, 2, 2)
    expect(pageUsers).toHaveLength(1)
    expect(pageUsers[0].id).toBe('3')
  })

  it('calculates total pages correctly', () => {
    const { totalPages } = calculatePagination(mockUsers, 1, 2)
    expect(totalPages).toBe(2)
  })

  it('returns minimum of 1 for total pages with empty array', () => {
    const { totalPages } = calculatePagination([], 1, 10)
    expect(totalPages).toBe(1)
  })

  it('handles page size larger than total users', () => {
    const { pageUsers, totalPages } = calculatePagination(mockUsers, 1, 100)
    expect(pageUsers).toHaveLength(3)
    expect(totalPages).toBe(1)
  })

  it('returns empty array for out-of-bounds page', () => {
    const { pageUsers } = calculatePagination(mockUsers, 10, 2)
    expect(pageUsers).toHaveLength(0)
  })
})

describe('organization extraction', () => {
  it('extracts unique organizations and sorts them', () => {
    const organizationSet = new Set(mockUsers.map((u) => u.organization))
    const organizations = Array.from(organizationSet).sort((a, b) =>
      a.localeCompare(b),
    )

    expect(organizations).toEqual(['Irorun', 'Lendsqr'])
  })
})

describe('search logic', () => {
  const searchUsers = (users: User[], searchTerm: string) => {
    const term = searchTerm.toLowerCase().trim()

    return users
      .filter((user) => {
        const nameMatch = user.profile.fullName.toLowerCase().includes(term)
        const emailMatch = user.email.toLowerCase().includes(term)
        return nameMatch || emailMatch
      })
      .slice(0, 20)
  }

  it('searches by full name (case-insensitive)', () => {
    const result = searchUsers(mockUsers, 'JOHN')
    expect(result).toHaveLength(1)
    expect(result[0].profile.fullName).toBe('John Doe')
  })

  it('searches by email (case-insensitive)', () => {
    const result = searchUsers(mockUsers, 'irorun.com')
    expect(result).toHaveLength(1)
    expect(result[0].email).toBe('jane@irorun.com')
  })

  it('trims whitespace from search term', () => {
    const result = searchUsers(mockUsers, '  john  ')
    expect(result).toHaveLength(1)
  })

  it('returns empty array when no matches', () => {
    const result = searchUsers(mockUsers, 'nonexistent')
    expect(result).toHaveLength(0)
  })

  it('limits results to 20', () => {
    const manyUsers = Array.from({ length: 50 }, (_, i) => ({
      ...mockUsers[0],
      id: `user-${i}`,
      profile: { ...mockUsers[0].profile, fullName: `Test User ${i}` },
    }))

    const result = searchUsers(manyUsers, 'test')
    expect(result).toHaveLength(20)
  })

  it('matches on either name or email', () => {
    const result = searchUsers(mockUsers, 'lendsqr')
    expect(result).toHaveLength(2)
  })
})

describe('applyFilters edge cases', () => {
  it('handles empty string filter values', () => {
    const result = applyFilters(mockUsers, { username: '' })
    expect(result).toHaveLength(3)
  })

  it('handles whitespace-only filter values', () => {
    const result = applyFilters(mockUsers, { username: '   ' })
    expect(result).toHaveLength(3)
  })

  it('handles special regex characters in filter values', () => {
    const result = applyFilters(mockUsers, { username: '.*' })
    expect(result).toHaveLength(0)
  })

  it('handles filter with non-matching date format', () => {
    const result = applyFilters(mockUsers, { dateJoined: '15/01/2024' })
    expect(result).toHaveLength(0)
  })

  it('handles undefined filter properties', () => {
    const result = applyFilters(mockUsers, {
      organization: undefined,
      username: undefined,
      status: undefined,
    })
    expect(result).toHaveLength(3)
  })

  it('handles phone number with partial match at end', () => {
    const result = applyFilters(mockUsers, { phoneNumber: '5678' })
    expect(result).toHaveLength(1)
    expect(result[0].username).toBe('johndoe')
  })

  it('handles case-sensitive organization filter', () => {
    const result = applyFilters(mockUsers, { organization: 'lendsqr' })
    expect(result).toHaveLength(0)
  })

  it('handles all filters combined with no matches', () => {
    const result = applyFilters(mockUsers, {
      organization: 'Lendsqr',
      status: 'Pending',
      username: 'john',
    })
    expect(result).toHaveLength(0)
  })
})

describe('usersQueryOptions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns correct query key structure', () => {
    const options = usersQueryOptions({ page: 1, pageSize: 10 })
    expect(options.queryKey).toEqual(['users', { page: 1, pageSize: 10 }])
  })

  it('includes filters in query key when provided', () => {
    const options = usersQueryOptions({
      page: 1,
      pageSize: 10,
      filters: { organization: 'Lendsqr' },
    })
    expect(options.queryKey).toEqual([
      'users',
      { page: 1, pageSize: 10, filters: { organization: 'Lendsqr' } },
    ])
  })
})

describe('userQueryOptions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns correct query key structure', () => {
    const options = userQueryOptions('123')
    expect(options.queryKey).toEqual(['user', '123'])
  })

  it('throws error when user not found', async () => {
    localStorage.setItem(
      'lendsqr-users',
      JSON.stringify([{ id: '1', username: 'test' }]),
    )

    const options = userQueryOptions('nonexistent')

    const queryFn = options.queryFn!
    const queryFnPromise = queryFn({
      queryKey: options.queryKey,
      signal: new AbortController().signal,
      meta: undefined,
    } as never)

    vi.advanceTimersByTime(3000)

    await expect(queryFnPromise).rejects.toThrow(
      'User with id nonexistent not found',
    )
  })
})

describe('searchUsersQueryOptions', () => {
  it('returns correct query key structure', () => {
    const options = searchUsersQueryOptions('john')
    expect(options.queryKey).toEqual(['search', 'john'])
  })

  it('is disabled when search term is empty', () => {
    const options = searchUsersQueryOptions('')
    expect(options.enabled).toBe(false)
  })

  it('is enabled when search term has content', () => {
    const options = searchUsersQueryOptions('john')
    expect(options.enabled).toBe(true)
  })
})

describe('pagination edge cases', () => {
  const calculatePagination = (
    users: User[],
    page: number,
    pageSize: number,
  ) => {
    const pageUsers = users.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.max(1, Math.ceil(users.length / pageSize))
    return { pageUsers, totalPages }
  }

  it('handles page 0 (slice from -2 to 0 returns empty)', () => {
    const { pageUsers } = calculatePagination(mockUsers, 0, 2)
    expect(pageUsers).toHaveLength(0)
  })

  it('handles negative page (slice wraps around from end)', () => {
    const { pageUsers } = calculatePagination(mockUsers, -1, 2)
    expect(pageUsers).toHaveLength(1)
  })

  it('handles pageSize of 1', () => {
    const { pageUsers, totalPages } = calculatePagination(mockUsers, 1, 1)
    expect(pageUsers).toHaveLength(1)
    expect(totalPages).toBe(3)
  })

  it('calculates correct totalPages for exact division', () => {
    const usersForTest = [...mockUsers, mockUsers[0]]
    const { totalPages } = calculatePagination(usersForTest, 1, 2)
    expect(totalPages).toBe(2)
  })
})
