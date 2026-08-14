'use client'

import { useClock } from '@/hooks/useClock'
import { usePreferences } from '@/hooks/usePreferences'

const SEGMENTS: Record<string, number[]> = {
  '0': [0, 1, 2, 4, 5, 6],
  '1': [2, 5],
  '2': [0, 2, 3, 4, 6],
  '3': [0, 2, 3, 5, 6],
  '4': [1, 2, 3, 5],
  '5': [0, 1, 3, 5, 6],
  '6': [0, 1, 3, 4, 5, 6],
  '7': [0, 2, 5],
  '8': [0, 1, 2, 3, 4, 5, 6],
  '9': [0, 1, 2, 3, 5, 6],
}

function SegmentDigit({ value }: { value: string }) {
  const active = SEGMENTS[value] || []
  return (
    <span className="zc-segment-digit" aria-hidden="true">
      {Array.from({ length: 7 }, (_, index) => (
        <i key={index} className={`zc-segment zc-segment-${index}${active.includes(index) ? ' is-active' : ''}`} />
      ))}
    </span>
  )
}

function SegmentPair({ value }: { value: string }) {
  return (
    <span className="zc-segment-pair">
      {value.padStart(2, '0').split('').map((digit, index) => (
        <SegmentDigit key={`${digit}-${index}`} value={digit} />
      ))}
    </span>
  )
}

function TimeRow({ hours, minutes, seconds, showSeconds }: {
  hours: string
  minutes: string
  seconds: string
  showSeconds: boolean
}) {
  return (
    <span className="zc-segment-row">
      <SegmentPair value={hours} />
      <span className="zc-segment-colon" aria-hidden="true"><i /><i /></span>
      <SegmentPair value={minutes} />
      {showSeconds && (
        <>
          <span className="zc-segment-colon zc-segment-colon-small" aria-hidden="true"><i /><i /></span>
          <SegmentPair value={seconds} />
        </>
      )}
    </span>
  )
}

export default function NeonSegmentClock({ large = false }: { large?: boolean }) {
  const clock = useClock()
  const { prefs } = usePreferences()

  if (!clock) {
    return <div className={`zc-neon-clock${large ? ' is-large' : ''}`} style={{ minHeight: large ? 420 : 280 }} />
  }

  const readableTime = `${clock.hours}:${clock.minutes}${prefs.showSeconds ? `:${clock.seconds}` : ''}${prefs.timeFormat === '12h' ? ` ${clock.ampm}` : ''}`

  return (
    <section className={`zc-neon-clock${large ? ' is-large' : ''}`} aria-label={`Current time ${readableTime}`}>
      <p className="zc-clock-date">{clock.dayOfWeek}, {clock.date}</p>
      <div className="zc-neon-stage">
        <div className="zc-neon-camera">
          <time className="zc-neon-time" dateTime={readableTime}>
            <TimeRow hours={clock.hours} minutes={clock.minutes} seconds={clock.seconds} showSeconds={prefs.showSeconds} />
            {prefs.timeFormat === '12h' && <span className="zc-neon-ampm">{clock.ampm}</span>}
          </time>
          <div className="zc-neon-reflection" aria-hidden="true">
            <TimeRow hours={clock.hours} minutes={clock.minutes} seconds={clock.seconds} showSeconds={prefs.showSeconds} />
          </div>
        </div>
      </div>
      <p className="zc-clock-location">📍 {prefs.timezone.replace(/_/g, ' ')}</p>
    </section>
  )
}
