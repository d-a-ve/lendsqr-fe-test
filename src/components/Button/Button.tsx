import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import styles from './Button.module.scss'

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles['button--primary'],
      outline: styles['button--outline'],
      'outline-primary': styles['button--outline-primary'],
      'outline-destructive': styles['button--outline-destructive'],
      ghost: styles['button--ghost'],
    },
    size: {
      sm: styles['button--sm'],
      md: styles['button--md'],
      lg: styles['button--lg'],
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
