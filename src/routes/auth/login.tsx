import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Logo } from '@/components/Logo'
import { sleep } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useId, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoginGraphic } from './-components/login-graphic'
import styles from './login.module.scss'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

const DEMO_EMAIL = 'test@lendsqr.com'
const DEMO_PASSWORD = 'Test1234!'
const LOGIN_DELAY_MS = 2000
const ROOT_ERROR_CLEAR_MS = 3000

const loginSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .trim()
    .min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

function RouteComponent() {
  const emailId = useId()
  const passwordId = useId()
  const emailErrorId = useId()
  const passwordErrorId = useId()
  const formErrorId = useId()

  const router = useRouter()

  const rootErrorTimeoutRef = useRef<number | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    return () => {
      if (rootErrorTimeoutRef.current) {
        window.clearTimeout(rootErrorTimeoutRef.current)
      }
    }
  }, [])

  const fillDemoCredentials = () => {
    setValue('email', DEMO_EMAIL, { shouldDirty: true })
    setValue('password', DEMO_PASSWORD, { shouldDirty: true })
    clearErrors()
    setFocus('password')
  }

  const onSubmit = async ({ email, password }: LoginValues) => {
    if (rootErrorTimeoutRef.current) {
      window.clearTimeout(rootErrorTimeoutRef.current)
      rootErrorTimeoutRef.current = null
    }

    const normalizedEmail = email.trim().toLowerCase()
    const isDemoMatch =
      normalizedEmail === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD

    if (!isDemoMatch) {
      setError('root', { type: 'manual', message: 'Invalid email or password' })

      rootErrorTimeoutRef.current = window.setTimeout(() => {
        clearErrors('root')
        rootErrorTimeoutRef.current = null
      }, ROOT_ERROR_CLEAR_MS)

      return
    }

    await sleep(LOGIN_DELAY_MS)

    await router.navigate({ to: '/users', replace: true })
  }

  const formError = errors.root?.message
  const emailError = errors.email?.message
  const passwordError = errors.password?.message

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <section className={styles.left} aria-label="Branding">
          <div className={styles.brand}>
            <Logo />
          </div>

          <LoginGraphic className={styles.graphic} aria-hidden="true" />
        </section>

        <section className={styles.right} aria-label="Login">
          <div className={styles.formWrap}>
            <div className={styles.rightBrand}>
              <Logo />
            </div>
            <h2 className={styles.heading}>Welcome!</h2>
            <p className={styles.subheading}>Enter details to login.</p>

            {formError && (
              <div
                id={formErrorId}
                className={styles.formError}
                role="status"
                aria-live="polite"
              >
                {formError}
              </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.fields}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor={emailId}>
                    Email
                  </label>
                  <Input
                    id={emailId}
                    type="email"
                    placeholder="Email"
                    autoComplete="username"
                    {...register('email')}
                    disabled={isSubmitting}
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? emailErrorId : undefined}
                    className={emailError ? styles.invalidInput : undefined}
                  />
                  {emailError && (
                    <p id={emailErrorId} className={styles.fieldError}>
                      {emailError}
                    </p>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor={passwordId}>
                    Password
                  </label>
                  <Input
                    id={passwordId}
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    {...register('password')}
                    disabled={isSubmitting}
                    aria-invalid={passwordError ? true : undefined}
                    aria-describedby={
                      passwordError ? passwordErrorId : undefined
                    }
                    className={passwordError ? styles.invalidInput : undefined}
                  />
                  {passwordError && (
                    <p id={passwordErrorId} className={styles.fieldError}>
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <a
                href="#"
                className={styles.forgot}
                onClick={(e) => e.preventDefault()}
              >
                FORGOT PASSWORD?
              </a>

              <div className={styles.actions}>
                <Button
                  type="submit"
                  size="md"
                  className={styles.submit}
                  disabled={isSubmitting}
                  aria-describedby={formError ? formErrorId : undefined}
                >
                  {isSubmitting ? 'Logging in…' : 'Log in'}
                </Button>

                <Button
                  type="button"
                  variant="outline-primary"
                  size="md"
                  className={styles.demoButton}
                  disabled={isSubmitting}
                  onClick={fillDemoCredentials}
                >
                  Use demo credentials
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
