import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input component', () => {
  it('renders text input by default', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders email input', () => {
    render(<Input type="email" placeholder="Enter email" />)
    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders password input with toggle button', () => {
    render(<Input type="password" placeholder="Enter password" />)
    const input = screen.getByPlaceholderText('Enter password')
    expect(input).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument()
  })

  it('does not render toggle button for non-password inputs', () => {
    render(<Input type="text" placeholder="Enter text" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('toggles password visibility when clicking Show', () => {
    render(<Input type="password" placeholder="Enter password" />)
    const input = screen.getByPlaceholderText('Enter password')
    const toggleButton = screen.getByRole('button', { name: 'Show' })

    expect(input).toHaveAttribute('type', 'password')

    fireEvent.click(toggleButton)

    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument()
  })

  it('toggles password visibility back when clicking Hide', () => {
    render(<Input type="password" placeholder="Enter password" />)
    const input = screen.getByPlaceholderText('Enter password')
    const toggleButton = screen.getByRole('button', { name: 'Show' })

    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByRole('button', { name: 'Hide' }))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('handles value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Test" />)

    const input = screen.getByPlaceholderText('Test')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Test" />)
    const input = screen.getByPlaceholderText('Test')
    expect(input.className).toContain('custom-class')
  })

  it('passes through HTML input attributes', () => {
    render(
      <Input
        placeholder="Test"
        maxLength={10}
        required
        data-testid="test-input"
      />,
    )

    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('maxLength', '10')
    expect(input).toBeRequired()
  })

  it('renders number input', () => {
    render(<Input type="number" placeholder="Enter number" />)
    const input = screen.getByPlaceholderText('Enter number')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('renders tel input', () => {
    render(<Input type="tel" placeholder="Enter phone" />)
    const input = screen.getByPlaceholderText('Enter phone')
    expect(input).toHaveAttribute('type', 'tel')
  })

  it('renders date input', () => {
    render(<Input type="date" data-testid="date-input" />)
    const input = screen.getByTestId('date-input')
    expect(input).toHaveAttribute('type', 'date')
  })

  it('has display name', () => {
    expect(Input.displayName).toBe('Input')
  })

  it('toggle button has tabIndex -1', () => {
    render(<Input type="password" placeholder="Password" />)
    const toggleButton = screen.getByRole('button', { name: 'Show' })
    expect(toggleButton).toHaveAttribute('tabIndex', '-1')
  })

  it('renders url input', () => {
    render(<Input type="url" placeholder="Enter URL" />)
    const input = screen.getByPlaceholderText('Enter URL')
    expect(input).toHaveAttribute('type', 'url')
  })

  it('renders search input', () => {
    render(<Input type="search" placeholder="Search" />)
    const input = screen.getByPlaceholderText('Search')
    expect(input).toHaveAttribute('type', 'search')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
  })

  it('disabled input does not allow user interaction', () => {
    render(<Input disabled placeholder="Disabled" />)

    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('disabled')
  })

  it('can be readonly', () => {
    render(<Input readOnly placeholder="Readonly input" />)
    const input = screen.getByPlaceholderText('Readonly input')
    expect(input).toHaveAttribute('readOnly')
  })

  it('handles controlled input with value prop', () => {
    const { rerender } = render(<Input value="initial" placeholder="Controlled" onChange={vi.fn()} />)

    const input = screen.getByPlaceholderText('Controlled')
    expect(input).toHaveValue('initial')

    rerender(<Input value="updated" placeholder="Controlled" onChange={vi.fn()} />)
    expect(input).toHaveValue('updated')
  })

  it('works without className prop', () => {
    render(<Input placeholder="No class" />)
    const input = screen.getByPlaceholderText('No class')
    expect(input).toBeInTheDocument()
    expect(input.className).not.toContain('undefined')
  })

  it('password toggle works when input is disabled', () => {
    render(<Input type="password" disabled placeholder="Disabled password" />)
    const input = screen.getByPlaceholderText('Disabled password')
    const toggleButton = screen.getByRole('button', { name: 'Show' })

    expect(input).toBeDisabled()
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
  })
})
