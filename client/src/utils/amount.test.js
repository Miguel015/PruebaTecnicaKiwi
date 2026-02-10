import { describe, it, expect } from 'vitest'
import { formatCentsDisplay, formatInputFromCents, parseAmountInput } from './amount'

describe('amount utils', () => {
  it('formatCentsDisplay formats cents to $X.YY', () => {
    expect(formatCentsDisplay(1500)).toBe('$15.00')
    expect(formatCentsDisplay(0)).toBe('$0.00')
    expect(formatCentsDisplay(null)).toBe('$0.00')
  })

  it('formatInputFromCents returns integer dollars with commas', () => {
    expect(formatInputFromCents(1500)).toBe('15')
    expect(formatInputFromCents(123456)).toBe('1,234')
  })

  it('parseAmountInput parses user input correctly', () => {
    expect(parseAmountInput('1,234').cents).toBe(123400)
    expect(parseAmountInput('100').formatted).toBe('100')
    expect(parseAmountInput('').cents).toBe(null)
  })
})
