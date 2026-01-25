import { cva, type VariantProps } from 'class-variance-authority'
import styles from './Badge.module.scss'

const badgeVariants = cva(styles.badge, {
  variants: {
    status: {
      default: styles['badge--default'],
      success: styles['badge--success'],
      warning: styles['badge--warning'],
      error: styles['badge--error'],
    },
  },
  defaultVariants: {
    status: 'default',
  },
})

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  className?: string
}

export function Badge({ status, children, className }: BadgeProps) {
  return (
    <span className={badgeVariants({ status, className })}>{children}</span>
  )
}
