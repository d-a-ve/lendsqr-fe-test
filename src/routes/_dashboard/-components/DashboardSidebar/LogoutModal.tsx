import { Button } from '@/components/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { AuthenticatedUserLocalStorageKey } from '@/const'
import { sleep } from '@/utils'
import { useRouter } from '@tanstack/react-router'
import { useState, type ReactElement } from 'react'

const LOGOUT_DELAY_MS = 1500

export function LogoutModal({ children }: { children: ReactElement }) {
  const [open, setOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await sleep(LOGOUT_DELAY_MS)
    localStorage.removeItem(AuthenticatedUserLocalStorageKey)
    await router.navigate({ to: '/auth/login', replace: true })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent showCloseButton={!isLoggingOut}>
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>Are you sure you want to logout?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="ghost" disabled={isLoggingOut}>
                Cancel
              </Button>
            }
          />
          <Button
            variant="outline-destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
