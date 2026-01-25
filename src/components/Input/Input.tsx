import { forwardRef, type InputHTMLAttributes, useState } from 'react'
import styles from './Input.module.scss'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          type={inputType}
          className={`${styles.input} ${isPassword ? styles['input--withToggle'] : ''} ${className ?? ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
