import { describe, expect, it } from 'vitest'
import { getShiftMinutes } from './TimeCardCalculatorClient'

describe('time-card shift calculations', () => {
  it('deducts unpaid breaks', () => {
    expect(getShiftMinutes({ day: 'Monday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: true })).toBe(450)
  })

  it('supports overnight shifts', () => {
    expect(getShiftMinutes({ day: 'Monday', start: '22:00', end: '06:00', breakMinutes: 30, enabled: true })).toBe(450)
  })

  it('excludes disabled days and never returns a negative duration', () => {
    expect(getShiftMinutes({ day: 'Monday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: false })).toBe(0)
    expect(getShiftMinutes({ day: 'Monday', start: '09:00', end: '10:00', breakMinutes: 120, enabled: true })).toBe(0)
  })
})
