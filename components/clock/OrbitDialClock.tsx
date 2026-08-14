'use client'

import type { CSSProperties } from 'react'
import { useClock } from '@/hooks/useClock'
import { usePreferences } from '@/hooks/usePreferences'

function DialRing({ value, kind }: { value: number; kind: 'seconds' | 'minutes' }) {
  const radius = kind === 'seconds' ? 'calc(var(--dial-size) / 2 - 12px)' : 'calc(var(--dial-size) / 2 - 70px)'
  return (
    <div
      className={`zc-dial-ring zc-dial-${kind}${value === 0 ? ' is-reset' : ''}`}
      style={{
        '--dial-rotation': `${value * 6}deg`,
        '--dial-radius': radius,
      } as CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: 60 }, (_, index) => (
        <i
          key={index}
          className={`zc-dial-spike${index % 5 === 0 ? ' is-major' : ''}`}
          style={{ '--tick-angle': `${index * 6}deg` } as CSSProperties}
        >
          {index % 5 === 0 && <span>{index}</span>}
        </i>
      ))}
    </div>
  )
}

export default function OrbitDialClock({ large = false }: { large?: boolean }) {
  const clock = useClock()
  const { prefs } = usePreferences()

  if (!clock) return <div style={{ minHeight: large ? 540 : 380 }} />

  const seconds = Number(clock.seconds)
  const minutes = Number(clock.minutes)
  const readableTime = `${clock.hours}:${clock.minutes}${prefs.showSeconds ? `:${clock.seconds}` : ''}${prefs.timeFormat === '12h' ? ` ${clock.ampm}` : ''}`

  return (
    <section className={`zc-orbit-clock${large ? ' is-large' : ''}`} aria-label={`Current time ${readableTime}`}>
      <p className="zc-clock-date">{clock.dayOfWeek}, {clock.date}</p>
      <time className="zc-dial-face" dateTime={readableTime}>
        {prefs.showSeconds && <DialRing value={seconds} kind="seconds" />}
        <DialRing value={minutes} kind="minutes" />
        <span className="zc-dial-hour">{clock.hours}</span>
        <span className="zc-dial-minute">{clock.minutes}</span>
        {prefs.timeFormat === '12h' && <span className="zc-dial-ampm">{clock.ampm}</span>}
        <span className="sr-only">{readableTime}</span>
      </time>
      <p className="zc-clock-location">📍 {prefs.timezone.replace(/_/g, ' ')}</p>
    </section>
  )
}
