import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge component', () => {
  it('renders children correctly', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('badge')
  })

  it('applies success variant class', () => {
    render(<Badge status="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge.className).toContain('success')
  })

  it('applies warning variant class', () => {
    render(<Badge status="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge.className).toContain('warning')
  })

  it('applies error variant class', () => {
    render(<Badge status="error">Error</Badge>)
    const badge = screen.getByText('Error')
    expect(badge.className).toContain('error')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge.className).toContain('custom-class')
  })

  it('renders as a span element', () => {
    render(<Badge>Test</Badge>)
    const badge = screen.getByText('Test')
    expect(badge.tagName).toBe('SPAN')
  })

  it('renders complex children', () => {
    render(
      <Badge>
        <span data-testid="inner">Inner Content</span>
      </Badge>,
    )
    expect(screen.getByTestId('inner')).toBeInTheDocument()
  })
})
