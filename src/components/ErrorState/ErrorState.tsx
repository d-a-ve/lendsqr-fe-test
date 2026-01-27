import { Button } from '@/components/Button'
import { Link, useRouter } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import styles from './ErrorState.module.scss'

interface ErrorStateProps {
  variant?: 'generic' | 'notFound'
  title?: string
  description?: string
  errorCode?: string
  showRetry?: boolean
  showBackToUsers?: boolean
  onRetry?: () => void
}

export function ErrorState({
  variant = 'generic',
  title,
  description,
  errorCode,
  showRetry = true,
  showBackToUsers = false,
  onRetry,
}: ErrorStateProps) {
  const router = useRouter()

  const defaultTitle =
    variant === 'notFound' ? 'User not found' : 'Something went wrong'

  const defaultDescription =
    variant === 'notFound'
      ? "We couldn't find a user matching the given ID. They may have been removed or the link might be incorrect."
      : "We encountered an unexpected error while loading this page. Please try again or contact support if the issue persists."

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      router.invalidate()
    }
  }

  return (
    <div
      className={`${styles.errorState} ${variant === 'notFound' ? styles['errorState--notFound'] : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.orbit} />
        <div className={styles.orbitInner} />
        <div className={styles.dot1} />
        <div className={styles.dot2} />
        <div className={styles.dot3} />
        <div className={styles.shapeGroup}>
          <div className={styles.hexagon} />
          <div className={styles.triangle} />
          <span className={styles.exclamation}>
            {variant === 'notFound' ? '?' : '!'}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title ?? defaultTitle}</h2>
        <p className={styles.description}>{description ?? defaultDescription}</p>
        {errorCode && <code className={styles.code}>{errorCode}</code>}
      </div>

      <div className={styles.actions}>
        {showRetry && (
          <Button variant="primary" size="sm" onClick={handleRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Try Again
          </Button>
        )}
        {showBackToUsers && (
          <Link to="/users" className={styles.backLink}>
            Back to Users
          </Link>
        )}
      </div>
    </div>
  )
}
