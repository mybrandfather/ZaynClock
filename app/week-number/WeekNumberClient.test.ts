import { describe, expect, it } from 'vitest'
import { getIsoWeek, getIsoWeekRange, getIsoWeeksInYear } from './WeekNumberClient'

describe('ISO week calculations', () => {
  it('places New Year dates in the correct ISO week-year', () => {
    expect(getIsoWeek(new Date(2021, 0, 1))).toMatchObject({ week: 53, year: 2020, day: 5 })
    expect(getIsoWeek(new Date(2024, 0, 1))).toMatchObject({ week: 1, year: 2024, day: 1 })
  })

  it('returns Monday and Sunday for an ISO week', () => {
    const range = getIsoWeekRange(2024, 1)
    expect(range.monday.toISOString().slice(0, 10)).toBe('2024-01-01')
    expect(range.sunday.toISOString().slice(0, 10)).toBe('2024-01-07')
  })

  it('detects 52- and 53-week ISO years', () => {
    expect(getIsoWeeksInYear(2024)).toBe(52)
    expect(getIsoWeeksInYear(2026)).toBe(53)
  })
})
