import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

function range(start: number, end: number): number[] {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}

describe('Pagination range helper', () => {
  it('creates range from 1 to 5', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('creates single element range', () => {
    expect(range(3, 3)).toEqual([3])
  })

  it('creates range starting from non-1 number', () => {
    expect(range(5, 10)).toEqual([5, 6, 7, 8, 9, 10])
  })
})

describe('Pagination component', () => {
  it('returns null when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders pagination when totalPages > 1', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('enables both buttons when on middle page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(screen.getByLabelText('Previous page')).toBeEnabled()
    expect(screen.getByLabelText('Next page')).toBeEnabled()
  })

  it('calls onPageChange with previous page when clicking previous', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    )

    fireEvent.click(screen.getByLabelText('Previous page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when clicking next', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    )

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('calls onPageChange when clicking a page number', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    )

    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('marks current page with aria-current', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
    )

    const currentButton = screen.getByRole('button', { name: '3' })
    expect(currentButton).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark non-current pages with aria-current', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
    )

    const otherButton = screen.getByRole('button', { name: '2' })
    expect(otherButton).not.toHaveAttribute('aria-current')
  })
})

describe('Pagination range calculation', () => {
  it('shows all pages when total is small (Case 1)', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    )

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument()
    }
    expect(screen.queryByText('...')).not.toBeInTheDocument()
  })

  it('shows right dots when near start (Case 2)', () => {
    render(
      <Pagination currentPage={2} totalPages={20} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
    expect(screen.getAllByText('...')).toHaveLength(1)
  })

  it('shows left dots when near end (Case 3)', () => {
    render(
      <Pagination currentPage={19} totalPages={20} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
    expect(screen.getAllByText('...')).toHaveLength(1)
  })

  it('shows both dots when in middle (Case 4)', () => {
    render(
      <Pagination currentPage={10} totalPages={20} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
    expect(screen.getAllByText('...')).toHaveLength(2)
  })

  it('respects siblingCount parameter', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={vi.fn()}
        siblingCount={2}
      />,
    )

    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '11' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '12' })).toBeInTheDocument()
  })
})

describe('Pagination boundary validation', () => {
  it('renders when currentPage greater than totalPages (no validation)', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={10} totalPages={5} onPageChange={onPageChange} />,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).not.toBeDisabled()
  })

  it('renders when currentPage is 0 (no validation)', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={0} totalPages={5} onPageChange={onPageChange} />,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled()
  })

  it('handles negative currentPage', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={-1} totalPages={5} onPageChange={onPageChange} />,
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('handles siblingCount of 0', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={vi.fn()}
        siblingCount={0}
      />,
    )

    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument()
  })

  it('handles negative totalPages', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={-5} onPageChange={vi.fn()} />,
    )

    expect(container.firstChild).toBeNull()
  })

  it('calls onPageChange when clicking the current page', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    )

    fireEvent.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('handles very large totalPages', () => {
    render(
      <Pagination currentPage={500} totalPages={1000} onPageChange={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '500' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1000' })).toBeInTheDocument()
    expect(screen.getAllByText('...')).toHaveLength(2)
  })
})
