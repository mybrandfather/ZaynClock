'use client'

import { useEffect, useState } from 'react'
import { usePreferences } from '@/hooks/usePreferences'
import { getSafeTimeZone } from '@/lib/timezone'

interface AnalogClockProps {
  size?: number
  showSeconds?: boolean
}

export default function AnalogClock({ size = 240, showSeconds = true }: AnalogClockProps) {
  const { prefs } = usePreferences()
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return <div style={{ width: size, height: size }} />

  const opts = { timeZone: getSafeTimeZone(prefs.timezone, 'UTC'), hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false } as Intl.DateTimeFormatOptions
  const parts = new Intl.DateTimeFormat('en-US', opts).formatToParts(now)
  const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value || '0', 10)
  const h = get('hour') % 12
  const m = get('minute')
  const s = get('second')

  const hourAngle = (h + m / 60) * 30
  const minAngle = (m + s / 60) * 6
  const secAngle = s * 6

  const r = size / 2
  const center = r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Analog clock">
      <circle cx={center} cy={center} r={r - 4} fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        const x1 = center + Math.sin(angle) * (r - 14)
        const y1 = center - Math.cos(angle) * (r - 14)
        const x2 = center + Math.sin(angle) * (r - 24)
        const y2 = center - Math.cos(angle) * (r - 24)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-secondary)" strokeWidth="2" />
      })}
      {/* Hour hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(hourAngle * Math.PI / 180) * (r * 0.5)}
        y2={center - Math.cos(hourAngle * Math.PI / 180) * (r * 0.5)}
        stroke="var(--text-primary)" strokeWidth="5" strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1={center} y1={center}
        x2={center + Math.sin(minAngle * Math.PI / 180) * (r * 0.7)}
        y2={center - Math.cos(minAngle * Math.PI / 180) * (r * 0.7)}
        stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round"
      />
      {/* Second hand */}
      {showSeconds && (
        <line
          x1={center} y1={center}
          x2={center + Math.sin(secAngle * Math.PI / 180) * (r * 0.8)}
          y2={center - Math.cos(secAngle * Math.PI / 180) * (r * 0.8)}
          stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"
        />
      )}
      <circle cx={center} cy={center} r="5" fill="var(--accent)" />
    </svg>
  )
}
