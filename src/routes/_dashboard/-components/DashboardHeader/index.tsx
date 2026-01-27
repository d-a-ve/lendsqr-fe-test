import { Button } from '@/components/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/Dropdown'
import { Input } from '@/components/Input'
import { Logo } from '@/components/Logo'
import { useBodyScrollLock } from '@/hooks'
import { useSidebar } from '@/routes/_dashboard/-components/SidebarContext'
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from './DashboardHeader.module.scss'

const currentUser = {
  name: 'Adeedeyi',
}

export function DashboardHeader() {
  const { toggle } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useBodyScrollLock(isSearchOpen)

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

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
          <form
            className={styles.searchForm}
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Input
              className={styles.searchInput}
              type="search"
              placeholder="Search for anything"
              aria-label="Search for anything"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className={styles.searchButton}
              aria-label="Search"
            >
              <Search className={styles.searchIcon} />
            </Button>
          </form>

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
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className={styles.searchModal} role="dialog" aria-modal="true">
          <div className={styles.searchModalHeader}>
            <form
              className={styles.searchModalForm}
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <Search className={styles.searchModalIcon} aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="search"
                className={styles.searchModalInput}
                placeholder="Search for anything"
                aria-label="Search for anything"
              />
            </form>
            <button
              type="button"
              className={styles.searchModalClose}
              aria-label="Close search"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className={styles.closeIcon} />
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
