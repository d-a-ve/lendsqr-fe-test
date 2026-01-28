import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/Dropdown'
import { Logo } from '@/components/Logo'
import { SearchInput } from '@/components/SearchInput'
import { useBodyScrollLock } from '@/hooks'
import { useSidebar } from '@/routes/_dashboard/-components/SidebarContext'
import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import styles from './DashboardHeader.module.scss'

const currentUser = {
  name: 'Adeedeyi',
}

export function DashboardHeader() {
  const { toggle } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useBodyScrollLock(isSearchOpen)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSearchOpen])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logoArea}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label="Toggle menu"
            onClick={toggle}
          >
            <Menu className={styles.menuIcon} />
          </button>
          <Logo width={120} />
        </div>

        <div className={styles.right}>
          <SearchInput className={styles.searchForm} />

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.searchTrigger}
              aria-label="Open search"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className={styles.actionIcon} />
            </button>

            <p className={styles.docsLink}>Docs</p>

            <button
              type="button"
              className={styles.iconButton}
              aria-label="Notifications"
            >
              <Bell className={styles.actionIcon} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className={styles.userTrigger}>
                <span className={styles.avatar} aria-hidden="true">
                  {currentUser.name.slice(0, 1).toUpperCase()}
                </span>
                <span className={styles.userName}>{currentUser.name}</span>
                <ChevronDown className={styles.caret} aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem className={styles.mobileOnly}>
                  Docs
                </DropdownMenuItem>
                <DropdownMenuItem className={styles.mobileOnly}>
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <SearchInput
          variant="mobile"
          onNavigate={() => setIsSearchOpen(false)}
        />
      )}
    </header>
  )
}
