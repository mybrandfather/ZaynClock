'use client'

import type { CSSProperties } from 'react'
import { useClock } from '@/hooks/useClock'
import { usePreferences } from '@/hooks/usePreferences'

const DISTANCE_CLASSES = ['is-visible', 'is-close', 'is-far', 'is-far', 'is-distant', 'is-distant'] as const

function distanceClass(activeDigit: number, candidate: number) {
  return DISTANCE_CLASSES[Math.abs(activeDigit - candidate)] ?? ''
}

function DigitColumn({ value, max }: { value: number; max: number }) {
  return (
    <span className="zc-slide-column-window" aria-hidden="true">
      <span
        className="zc-slide-column"
        style={{ '--slide-value': value } as CSSProperties}
      >
        {Array.from({ length: max + 1 }, (_, candidate) => (
          <span
            key={candidate}
            className={`zc-slide-number ${distanceClass(value, candidate)}`}
          >
            {candidate}
          </span>
        ))}
      </span>
    </span>
  )
}

export default function SlideClock({ large = false }: { large?: boolean }) {
  const clock = useClock()
  const { prefs } = usePreferences()

  if (!clock) {
    return <div className={`zc-slide-clock${large ? ' is-large' : ''}`} style={{ minHeight: large ? 540 : 390 }} />
  }

  const digitString = `${clock.hours}${clock.minutes}${prefs.showSeconds ? clock.seconds : ''}`
  const digits = digitString.split('').map(Number)
  const maxValues = prefs.showSeconds ? [2, 9, 5, 9, 5, 9] : [2, 9, 5, 9]
  const readableTime = `${clock.hours}:${clock.minutes}${prefs.showSeconds ? `:${clock.seconds}` : ''}${prefs.timeFormat === '12h' ? ` ${clock.ampm}` : ''}`

  return (
    <section className={`zc-slide-clock${large ? ' is-large' : ''}`} aria-label={`Current time ${readableTime}`}>
      <p className="zc-clock-date">{clock.dayOfWeek}, {clock.date}</p>
      <div className="zc-slide-stage">
        <time className="zc-slide-time" dateTime={readableTime}>
          {digits.map((digit, index) => (
            <span className="zc-slide-unit" key={index}>
              <DigitColumn value={digit} max={maxValues[index] ?? 9} />
              {(index === 1 || (prefs.showSeconds && index === 3)) && (
                <span className="zc-slide-colon" aria-hidden="true">:</span>
              )}
            </span>
          ))}
          {prefs.timeFormat === '12h' && (
            <span className="zc-slide-ampm" aria-hidden="true">{clock.ampm}</span>
          )}
          <span className="sr-only">{readableTime}</span>
        </time>
      </div>
      <p className="zc-clock-location">📍 {prefs.timezone.replace(/_/g, ' ')}</p>
    </section>
  )
}
