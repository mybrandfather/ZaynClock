'use client'

import { useClock } from '@/hooks/useClock'
import { usePreferences } from '@/hooks/usePreferences'

export default function DigitalClock({ large = false }: { large?: boolean }) {
  const clock = useClock()
  const { prefs } = usePreferences()

  if (!clock) return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{ fontSize: large ? '8rem' : '4rem', fontFamily: 'var(--font-display)', color: 'var(--accent)', opacity: 0.3 }}>
        --:--:--
      </div>
    </div>
  )

  const mainSize   = large ? 'clamp(6rem, 22vw, 18rem)' : 'clamp(4rem, 15vw, 9rem)'
  const colonSize  = large ? 'clamp(5rem, 18vw, 14rem)' : 'clamp(3rem, 12vw, 7rem)'
  const secSize    = large ? 'clamp(3rem, 11vw, 8rem)'  : 'clamp(2rem, 8vw, 5rem)'
  const ampmSize   = large ? 'clamp(1.5rem, 4vw, 3.5rem)' : 'clamp(1rem, 3vw, 2rem)'
  const dateSize   = large ? '1.35rem' : '0.9rem'
  const tzSize     = large ? '1.1rem'  : '0.8rem'

  return (
    <div style={{ textAlign: 'center', padding: large ? '1rem 0' : '2rem 0', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Day and Date */}
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: dateSize }}>
        {clock.dayOfWeek}, {clock.date}
      </p>

      {/* Main Clock */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.1em', flexWrap: 'wrap' }}>
        <span className="clock-digit" style={{ fontSize: mainSize, lineHeight: 1 }}>
          {clock.hours}
        </span>
        <span className="clock-digit colon-blink" style={{ fontSize: colonSize, lineHeight: 1, marginBottom: '0.1em' }}>
          :
        </span>
        <span className="clock-digit" style={{ fontSize: mainSize, lineHeight: 1 }}>
          {clock.minutes}
        </span>
        {prefs.showSeconds && (
          <>
            <span className="clock-digit colon-blink" style={{ fontSize: secSize, lineHeight: 1, alignSelf: 'flex-end', marginBottom: '0.5rem' }}>:</span>
            <span className="clock-digit" style={{ fontSize: secSize, lineHeight: 1, alignSelf: 'flex-end', marginBottom: '0.5rem' }}>
              {clock.seconds}
            </span>
          </>
        )}
        {prefs.timeFormat === '12h' && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: ampmSize,
            color: 'var(--accent2)',
            alignSelf: 'flex-end',
            marginBottom: '0.5rem',
            marginLeft: '0.25em',
          }}>
            {clock.ampm}
          </span>
        )}
      </div>

      {/* Timezone */}
      <p style={{ color: 'var(--text-secondary)', fontSize: tzSize, marginTop: '0.75rem' }}>
        📍 {prefs.timezone.replace(/_/g, ' ')}
      </p>
    </div>
  )
}
