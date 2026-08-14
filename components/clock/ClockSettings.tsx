'use client'

import { usePreferences, ColorAccent } from '@/hooks/usePreferences'
import { ALL_TIMEZONES } from '@/lib/utils'

const accents: { label: string; value: ColorAccent; color: string }[] = [
  { label: 'Cyan', value: 'cyan', color: '#00d4ff' },
  { label: 'Amber', value: 'amber', color: '#f59e0b' },
  { label: 'Green', value: 'green', color: '#22c55e' },
  { label: 'Purple', value: 'purple', color: '#a855f7' },
]

export default function ClockSettings() {
  const { prefs, setTimeFormat, toggleSeconds, setColorAccent, setTimezone } = usePreferences()

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>⚙️ Settings</h3>

      {/* Time Format */}
      <div>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Time Format</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['12h', '24h'] as const).map(f => (
            <button
              key={f}
              onClick={() => setTimeFormat(f)}
              style={{
                flex: 1,
                padding: '0.4rem',
                borderRadius: '0.375rem',
                border: '1px solid',
                borderColor: prefs.timeFormat === f ? 'var(--accent)' : 'var(--border)',
                background: prefs.timeFormat === f ? 'var(--accent)' : 'transparent',
                color: prefs.timeFormat === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Seconds toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.85rem' }}>Show Seconds</label>
        <button
          onClick={toggleSeconds}
          style={{
            width: 44, height: 24, borderRadius: 12,
            background: prefs.showSeconds ? 'var(--accent)' : 'var(--border)',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <span style={{
            position: 'absolute', top: 2,
            left: prefs.showSeconds ? 22 : 2,
            width: 20, height: 20, borderRadius: '50%',
            background: 'white', transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {/* Color Accent */}
      <div>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Accent Color</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {accents.map(a => (
            <button
              key={a.value}
              onClick={() => setColorAccent(a.value)}
              title={a.label}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: a.color, border: '2px solid',
                borderColor: prefs.colorAccent === a.value ? 'var(--text-primary)' : 'transparent',
                cursor: 'pointer',
                transform: prefs.colorAccent === a.value ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Timezone</label>
        <select
          value={prefs.timezone}
          onChange={e => setTimezone(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '0.375rem',
            padding: '0.4rem 0.5rem',
            fontSize: '0.8rem',
          }}
        >
          {(ALL_TIMEZONES as string[]).map(tz => (
            <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
