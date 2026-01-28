import { describe, expect, it } from 'vitest'
import {
  formatCompactNumber,
  formatCurrencyNGN,
  formatDateJoined,
  formatNumber,
  sleep,
  statusVariant,
} from './utils'

describe('statusVariant', () => {
  it('returns "success" for Active status', () => {
    expect(statusVariant('Active')).toBe('success')
  })

  it('returns "warning" for Pending status', () => {
    expect(statusVariant('Pending')).toBe('warning')
  })

  it('returns "error" for Blacklisted status', () => {
    expect(statusVariant('Blacklisted')).toBe('error')
  })

  it('returns "default" for Inactive status', () => {
    expect(statusVariant('Inactive')).toBe('default')
  })

  it('returns "default" for unknown status', () => {
    expect(statusVariant('Unknown' as never)).toBe('default')
  })
})

describe('formatCurrencyNGN', () => {
  it('formats number as NGN currency', () => {
    const result = formatCurrencyNGN(1000)
    expect(result).toContain('1,000')
    expect(result).toContain('₦')
  })

  it('formats with 2 decimal places', () => {
    const result = formatCurrencyNGN(1000.5)
    expect(result).toContain('1,000.50')
  })

  it('handles zero', () => {
    const result = formatCurrencyNGN(0)
    expect(result).toContain('0.00')
  })

  it('handles large numbers', () => {
    const result = formatCurrencyNGN(1000000)
    expect(result).toContain('1,000,000')
  })
})

describe('formatNumber', () => {
  it('formats number with locale separators', () => {
    expect(formatNumber(1000)).toBe('1,000')
  })

  it('formats large numbers', () => {
    expect(formatNumber(1000000)).toBe('1,000,000')
  })

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

describe('formatCompactNumber', () => {
  it('formats number with locale separators', () => {
    expect(formatCompactNumber(1000)).toBe('1,000')
  })

  it('formats large numbers', () => {
    expect(formatCompactNumber(1000000)).toBe('1,000,000')
  })
})

describe('formatDateJoined', () => {
  it('formats ISO date string to readable format', () => {
    const result = formatDateJoined('2024-01-15T10:30:00.000Z')
    expect(result).toContain('Jan')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('includes time in the format', () => {
    const result = formatDateJoined('2024-06-20T14:45:00.000Z')
    expect(result).toContain('Jun')
    expect(result).toContain('20')
    expect(result).toContain('2024')
  })
})

describe('sleep', () => {
  it('resolves after specified delay', async () => {
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(45)
  })

  it('returns a promise', () => {
    const result = sleep(10)
    expect(result).toBeInstanceOf(Promise)
  })

  it('resolves immediately with delay of 0', async () => {
    const start = Date.now()
    await sleep(0)
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(50)
  })
})

describe('formatCurrencyNGN edge cases', () => {
  it('handles negative numbers', () => {
    const result = formatCurrencyNGN(-1000)
    expect(result).toContain('1,000')
    expect(result).toContain('-')
  })

  it('handles very large numbers', () => {
    const result = formatCurrencyNGN(999999999999)
    expect(result).toContain('999,999,999,999')
  })

  it('handles decimal precision', () => {
    const result = formatCurrencyNGN(1000.999)
    expect(result).toContain('1,001.00')
  })

  it('handles NaN', () => {
    const result = formatCurrencyNGN(NaN)
    expect(result).toContain('NaN')
  })

  it('handles Infinity', () => {
    const result = formatCurrencyNGN(Infinity)
    expect(result).toContain('∞')
  })
})

describe('formatNumber edge cases', () => {
  it('handles negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1,000')
  })

  it('handles decimal numbers', () => {
    const result = formatNumber(1000.5)
    expect(result).toContain('1,000')
  })

  it('handles very small decimals', () => {
    const result = formatNumber(0.001)
    expect(result).toBe('0.001')
  })

  it('handles NaN', () => {
    expect(formatNumber(NaN)).toBe('NaN')
  })

  it('handles Infinity', () => {
    expect(formatNumber(Infinity)).toBe('∞')
  })

  it('handles negative Infinity', () => {
    expect(formatNumber(-Infinity)).toBe('-∞')
  })
})

describe('formatDateJoined edge cases', () => {
  it('handles different timezones in ISO string', () => {
    const result = formatDateJoined('2024-06-15T00:00:00.000+05:30')
    expect(result).toContain('2024')
  })

  it('handles date at year boundary (locale-dependent)', () => {
    const result = formatDateJoined('2024-12-31T12:00:00.000Z')
    expect(result).toContain('2024')
  })

  it('handles date at start of year', () => {
    const result = formatDateJoined('2024-01-01T12:00:00.000Z')
    expect(result).toContain('Jan')
    expect(result).toContain('1')
    expect(result).toContain('2024')
  })

  it('throws RangeError for invalid date string', () => {
    expect(() => formatDateJoined('invalid-date')).toThrow(RangeError)
  })

  it('throws RangeError for empty string', () => {
    expect(() => formatDateJoined('')).toThrow(RangeError)
  })
})
