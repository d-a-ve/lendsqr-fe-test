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
import type { UserStatusAction } from '@/utils'
import type { ReactElement } from 'react'

type UserStatusModalProps = {
  userName: string
  action: UserStatusAction
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactElement
  onConfirm?: () => void
  isLoading?: boolean
}

const actionConfig = {
  activate: {
    title: 'Activate User',
    description: (name: string) =>
      `Are you sure you want to activate ${name}?`,
    buttonText: 'Activate',
    buttonVariant: 'primary' as const,
  },
  blacklist: {
    title: 'Blacklist User',
    description: (name: string) =>
      `Are you sure you want to blacklist ${name}? This will restrict their access.`,
    buttonText: 'Blacklist',
    buttonVariant: 'outline-destructive' as const,
  },
  inactivate: {
    title: 'Inactivate User',
    description: (name: string) =>
      `Are you sure you want to inactivate ${name}?`,
    buttonText: 'Inactivate',
    buttonVariant: 'outline-destructive' as const,
  },
}

export function UserStatusModal({
  userName,
  action,
  open,
  onOpenChange,
  trigger,
  onConfirm,
  isLoading = false,
}: UserStatusModalProps) {
  const config = actionConfig[action]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent showCloseButton={!isLoading}>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            {config.description(userName)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="ghost" disabled={isLoading}>
                Cancel
              </Button>
            }
          />
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing…' : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
