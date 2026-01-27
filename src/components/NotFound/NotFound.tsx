import { Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Home } from 'lucide-react'
import styles from './NotFound.module.scss'

interface NotFoundProps {
  title?: string
  description?: string
  showHomeLink?: boolean
  showBackLink?: boolean
  homeUrl?: string
  homeLinkText?: string
  backLinkText?: string
}

export function NotFound({
  title = 'Page not found',
  description = "The page you're looking for doesn't exist or has been moved. Check the URL or navigate back to safety.",
  showHomeLink = true,
  showBackLink = true,
  homeUrl = '/',
  homeLinkText = 'Go to Dashboard',
  backLinkText = 'Go Back',
}: NotFoundProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.history.back()
  }

  return (
    <div className={styles.notFound} role="main" aria-labelledby="not-found-title">
      <div className={styles.backgroundPattern} aria-hidden="true">
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
        <div className={styles.gridLine} />
      </div>

      <div className={styles.visual} aria-hidden="true">
        <div className={styles.floatingShape} />
        <div className={styles.floatingShape} />
        <div className={styles.floatingShape} />
        <div className={styles.floatingShape} />
        <div className={styles.floatingShape} />
        <div className={styles.floatingShape} />

        <div className={styles.numberGroup}>
          <span className={styles.digit}>4</span>

          <div className={styles.zeroWrapper}>
            <div className={styles.zeroOuter} />
            <div className={styles.zeroInner} />
            <div className={styles.zeroCenter} />
            <div className={styles.orbitRing}>
              <div className={styles.orbitDot} />
            </div>
          </div>

          <span className={styles.digit}>4</span>
        </div>
      </div>

      <div className={styles.content}>
        <h1 id="not-found-title" className={styles.title}>
          {title}
        </h1>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.actions}>
        {showHomeLink && (
          <Link to={homeUrl} className={styles.homeLink}>
            <Home size={18} aria-hidden="true" />
            {homeLinkText}
          </Link>
        )}
        {showBackLink && (
          <button
            type="button"
            onClick={handleGoBack}
            className={styles.backLink}
          >
            <ArrowLeft size={18} aria-hidden="true" />
            {backLinkText}
          </button>
        )}
      </div>
    </div>
  )
}
