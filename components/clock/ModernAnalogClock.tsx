'use client'
import { useClock } from '@/hooks/useClock'
import { usePreferences } from '@/hooks/usePreferences'

export default function ModernAnalogClock({ large = false }: { large?: boolean }) {
  const { prefs } = usePreferences()
  const clock = useClock()
  const h = Number(clock?.hours ?? 0) % 12
  const m = Number(clock?.minutes ?? 0)
  const s = Number(clock?.seconds ?? 0)
  const date = clock ? `${clock.dayOfWeek}, ${clock.date}` : 'Loading time…'
  const digital = clock
    ? `${clock.hours}:${clock.minutes}${prefs.showSeconds ? `:${clock.seconds}` : ''}${prefs.timeFormat === '12h' && clock.ampm ? ` ${clock.ampm}` : ''}`
    : '--:--'
  const size = large ? 440 : 300

  return <section className="zc-modern-wrap" aria-label={`${digital}, ${date}`}>
    <div className="zc-modern-clock" style={{ width: size, height: size }}>
      {Array.from({ length: 60 }, (_, i) => <i key={i} className={i % 5 === 0 ? 'major' : ''} style={{ transform: `rotate(${i * 6}deg) translateY(calc(-50% + 12px))` }} />)}
      <span className="zc-modern-hand hour" style={{ transform: `translate(-50%,-100%) rotate(${h * 30 + m * .5}deg)` }} />
      <span className="zc-modern-hand minute" style={{ transform: `translate(-50%,-100%) rotate(${m * 6 + s * .1}deg)` }} />
      {prefs.showSeconds && <span className="zc-modern-hand second" style={{ transform: `translate(-50%,-100%) rotate(${s * 6}deg)` }} />}
      <b className="zc-modern-pin" />
    </div>
    <div className="zc-modern-digital">{digital}</div>
    <div className="zc-clock-date">{date}</div>
    <div className="zc-clock-location">📍 {prefs.timezone.replace(/_/g, ' ')}</div>
  </section>
}
