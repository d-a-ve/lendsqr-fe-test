import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type SidebarContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  )

  return <SidebarContext value={value}>{children}</SidebarContext>
}

export function useSidebar() {
  const context = use(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
