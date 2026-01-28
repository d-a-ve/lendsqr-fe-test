import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    rerender({ value: 'updated', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('initial')
  })

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    rerender({ value: 'updated', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('resets timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } },
    )

    rerender({ value: 'first', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'second', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('second')
  })

  it('works with different types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 123, delay: 100 } },
    )

    expect(result.current).toBe(123)

    rerender({ value: 456, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe(456)
  })

  it('works with objects', () => {
    const initialObj = { name: 'test' }
    const updatedObj = { name: 'updated' }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 100 } },
    )

    expect(result.current).toBe(initialObj)

    rerender({ value: updatedObj, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe(updatedObj)
  })
})
