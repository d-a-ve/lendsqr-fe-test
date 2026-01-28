import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useBodyScrollLock } from './useBodyScrollLock'

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  it('sets overflow to hidden when locked', () => {
    renderHook(() => useBodyScrollLock(true))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('does not set overflow when not locked', () => {
    renderHook(() => useBodyScrollLock(false))
    expect(document.body.style.overflow).toBe('')
  })

  it('removes overflow on unlock', () => {
    const { rerender } = renderHook(({ isLocked }) => useBodyScrollLock(isLocked), {
      initialProps: { isLocked: true },
    })

    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isLocked: false })

    expect(document.body.style.overflow).toBe('')
  })

  it('cleans up overflow on unmount', () => {
    const { unmount } = renderHook(() => useBodyScrollLock(true))

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe('')
  })

  it('handles multiple lock/unlock cycles', () => {
    const { rerender } = renderHook(({ isLocked }) => useBodyScrollLock(isLocked), {
      initialProps: { isLocked: false },
    })

    expect(document.body.style.overflow).toBe('')

    rerender({ isLocked: true })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ isLocked: false })
    expect(document.body.style.overflow).toBe('')

    rerender({ isLocked: true })
    expect(document.body.style.overflow).toBe('hidden')
  })
})
