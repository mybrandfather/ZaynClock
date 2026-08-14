/**
 * Return a time zone that Intl.DateTimeFormat can safely use.
 * Older ZaynClock releases may have stored a city label, empty value,
 * or another invalid value in localStorage. Invalid values throw a
 * RangeError and can crash client-rendered clock pages.
 */
export function isValidTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '') return false

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date(0))
    return true
  } catch {
    return false
  }
}

export function getSafeTimeZone(value: unknown, fallback = 'UTC'): string {
  if (isValidTimeZone(value)) return value
  return isValidTimeZone(fallback) ? fallback : 'UTC'
}

export function getBrowserTimeZone(): string {
  try {
    return getSafeTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone, 'UTC')
  } catch {
    return 'UTC'
  }
}
