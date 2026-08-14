'use client'

import { useClock } from '@/hooks/useClock'
import { usePreferences } from '@/hooks/usePreferences'
import { useEffect, useRef } from 'react'

function Block({ value, delay = 0, small = false }: { value: string; delay?: number; small?: boolean }) {
  const previous = useRef(value)
  const changed = previous.current !== value
  useEffect(() => { previous.current = value }, [value])
  return (
    <div className={`zc-bouncy-block${small ? ' zc-bouncy-small' : ''}${changed ? ' zc-bouncy-active' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="zc-bouncy-roll" style={{ animationDelay: `${delay}ms` }}>
        <span>{value}</span><span>{previous.current}</span>
      </div>
    </div>
  )
}

export default function BouncyBlockClock({ large = false }: { large?: boolean }) {
  const { prefs } = usePreferences()
  const clock = useClock()
  const hour = clock?.hours ?? '00'
  const minute = clock?.minutes ?? '00'
  const second = clock?.seconds ?? '00'
  const period = clock?.ampm ?? ''
  const date = clock ? `${clock.dayOfWeek}, ${clock.date}` : 'Loading time…'
  return <section className={`zc-bouncy-clock${large ? ' zc-bouncy-large' : ''}`} aria-label={`${hour}:${minute}${prefs.showSeconds ? `:${second}` : ''} ${period}`}>
    <div className="zc-bouncy-row" aria-hidden="true">
      <Block value={hour} delay={180} /><i className="zc-bouncy-colon" />
      <Block value={minute} delay={90} />
      {prefs.showSeconds && <><i className="zc-bouncy-colon" /><Block value={second} /></>}
      {prefs.timeFormat === '12h' && <Block value={period} delay={180} small />}
    </div>
    <p className="zc-clock-date">{date}</p><p className="zc-clock-location">📍 {prefs.timezone.replace(/_/g, ' ')}</p>
  </section>
}
