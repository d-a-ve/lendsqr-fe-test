import { renderHook } from '@testing-library/react'
import { type RefObject } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useClickOutside } from './useClickOutside'

describe('useClickOutside', () => {
  const createMockRef = (element: HTMLElement | null): RefObject<HTMLElement | null> => ({
    current: element,
  })

  it('calls handler when clicking outside the element', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    renderHook(() => useClickOutside(ref, handler))

    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)

    const event = new MouseEvent('mousedown', { bubbles: true })
    outsideElement.dispatchEvent(event)

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
    document.body.removeChild(outsideElement)
  })

  it('does not call handler when clicking inside the element', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    const childElement = document.createElement('span')
    element.appendChild(childElement)
    document.body.appendChild(element)

    const ref = createMockRef(element)

    renderHook(() => useClickOutside(ref, handler))

    const event = new MouseEvent('mousedown', { bubbles: true })
    childElement.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it('does not call handler when disabled', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    renderHook(() => useClickOutside(ref, handler, false))

    const event = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it('removes event listener on unmount', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    const { unmount } = renderHook(() => useClickOutside(ref, handler))

    unmount()

    const event = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it('handles null ref gracefully', () => {
    const handler = vi.fn()
    const ref = createMockRef(null)

    renderHook(() => useClickOutside(ref, handler))

    const event = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()
  })

  it('re-adds listener when enabled changes from false to true', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    const { rerender } = renderHook(
      ({ enabled }) => useClickOutside(ref, handler, enabled),
      { initialProps: { enabled: false } },
    )

    const event1 = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event1)
    expect(handler).not.toHaveBeenCalled()

    rerender({ enabled: true })

    const event2 = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event2)
    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
  })

  it('does not call handler for touch events (mousedown only)', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    renderHook(() => useClickOutside(ref, handler))

    const touchEvent = new TouchEvent('touchstart', { bubbles: true })
    document.body.dispatchEvent(touchEvent)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it('does not call handler when clicking directly on the ref element', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    renderHook(() => useClickOutside(ref, handler))

    const event = new MouseEvent('mousedown', { bubbles: true })
    element.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it('uses the latest handler when it changes', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const element = document.createElement('div')
    document.body.appendChild(element)

    const ref = createMockRef(element)

    const { rerender } = renderHook(
      ({ handler }) => useClickOutside(ref, handler),
      { initialProps: { handler: handler1 } },
    )

    rerender({ handler: handler2 })

    const event = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
  })

  it('handles deeply nested child clicks as inside', () => {
    const handler = vi.fn()
    const element = document.createElement('div')
    const nestedChild = document.createElement('div')
    const deeplyNestedChild = document.createElement('span')
    nestedChild.appendChild(deeplyNestedChild)
    element.appendChild(nestedChild)
    document.body.appendChild(element)

    const ref = createMockRef(element)

    renderHook(() => useClickOutside(ref, handler))

    const event = new MouseEvent('mousedown', { bubbles: true })
    deeplyNestedChild.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })
})
