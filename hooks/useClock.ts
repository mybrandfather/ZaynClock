'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from './usePreferences'
import { getSafeTimeZone } from '@/lib/timezone'

export interface ClockState {
  hours: string
  minutes: string
  seconds: string
  ampm: string
  date: string
  dayOfWeek: string
  timestamp: number
}

function formatClock(now: Date, timeZone: string, hour12: boolean): ClockState {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12,
  }
  const parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(now)
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '00'

  return {
    hours: get('hour').padStart(2, '0'),
    minutes: get('minute'),
    seconds: get('second'),
    ampm: get('dayPeriod'),
    date: new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(now),
    dayOfWeek: new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
    }).format(now),
    timestamp: now.getTime(),
  }
}

export function useClock() {
  const { prefs } = usePreferences()
  const [clock, setClock] = useState<ClockState | null>(null)

  useEffect(() => {
    const timeZone = getSafeTimeZone(prefs.timezone, 'UTC')

    const tick = () => {
      const now = new Date()

      try {
        setClock(formatClock(now, timeZone, prefs.timeFormat === '12h'))
      } catch {
        // A corrupted browser preference must never take down the home page.
        setClock(formatClock(now, 'UTC', prefs.timeFormat === '12h'))
      }
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [prefs.timezone, prefs.timeFormat])

  return clock
}
