import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { useClickOutside, useDebounce } from '@/hooks'
import { searchUsersQueryOptions } from '@/lib/query'
import { statusVariant } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Loader2, Search, X } from 'lucide-react'
import { useRef, useState } from 'react'
import styles from './SearchInput.module.scss'

type SearchInputProps = {
  className?: string
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}

export function SearchInput({
  className,
  variant = 'desktop',
  onNavigate,
}: SearchInputProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedTerm = useDebounce(searchTerm, 300)

  const isMobile = variant === 'mobile'

  useClickOutside(containerRef, () => {
    if (!isMobile) {
      setIsOpen(false)
    }
  })

  const { data, isFetching } = useQuery({
    ...searchUsersQueryOptions(debouncedTerm),
    enabled: debouncedTerm.length > 0,
  })

  const handleResultClick = (userId: string) => {
    setSearchTerm('')
    setIsOpen(false)
    router.navigate({
      to: '/users/$userId',
      params: { userId },
    })
    onNavigate?.()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const showResults = isMobile
    ? debouncedTerm.length > 0
    : isOpen && debouncedTerm.length > 0

  if (isMobile) {
    return (
      <div className={`${styles.mobileSearchContainer} ${className}`}>
        <div className={styles.mobileSearchHeader}>
          <form
            className={`${styles.searchForm} ${isMobile ? styles.searchFormMobile : ''}`}
            role="search"
            onSubmit={handleSubmit}
          >
            {isMobile && (
              <Search className={styles.searchIconMobile} aria-hidden="true" />
            )}
            <input
              className={`${styles.searchInput} ${isMobile ? styles.searchInputMobile : ''}`}
              placeholder="Search for user name or email"
              aria-label="Search for user name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              autoFocus={isMobile}
            />
            {!isMobile && (
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className={styles.searchButton}
                aria-label="Search"
              >
                <Search className={styles.searchIcon} />
              </Button>
            )}
          </form>
          <button
            type="button"
            className={styles.searchModalClose}
            aria-label="Close search"
            onClick={onNavigate}
          >
            <X className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.mobileResults}>
          {isFetching && (
            <div className={styles.loading}>
              <Loader2 className={styles.loadingIcon} />
              <span>Searching...</span>
            </div>
          )}

          {!isFetching && data?.length === 0 && (
            <div className={styles.noResults}>
              <span>No results found for "{debouncedTerm}"</span>
            </div>
          )}

          {!isFetching && data && data.length > 0 && (
            <ul className={styles.resultList} role="listbox">
              {data.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={styles.resultItem}
                    onClick={() => handleResultClick(user.id)}
                    role="option"
                  >
                    <div className={styles.resultMain}>
                      <span className={styles.resultName}>
                        {user.profile.fullName}
                      </span>
                      <span className={styles.resultEmail}>{user.email}</span>
                    </div>
                    <Badge status={statusVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
        {isMobile && (
          <Search className={styles.searchIconMobile} aria-hidden="true" />
        )}
        <input
          className={styles.searchInput}
          placeholder="Search for user name or email"
          aria-label="Search for user name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          autoFocus={isMobile}
        />
        {!isMobile && (
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className={styles.searchButton}
            aria-label="Search"
          >
            <Search className={styles.searchIcon} />
          </Button>
        )}
      </form>

      {showResults && (
        <div className={styles.results}>
          {isFetching && (
            <div className={styles.loading}>
              <Loader2 className={styles.loadingIcon} />
              <span>Searching...</span>
            </div>
          )}

          {!isFetching && data?.length === 0 && (
            <div className={styles.noResults}>
              <span>No results found for "{debouncedTerm}"</span>
            </div>
          )}

          {!isFetching && data && data.length > 0 && (
            <ul className={styles.resultList} role="listbox">
              {data.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={styles.resultItem}
                    onClick={() => handleResultClick(user.id)}
                    role="option"
                  >
                    <div className={styles.resultMain}>
                      <span className={styles.resultName}>
                        {user.profile.fullName}
                      </span>
                      <span className={styles.resultEmail}>{user.email}</span>
                    </div>
                    <Badge status={statusVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
