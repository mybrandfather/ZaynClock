'use client'
import { useState } from 'react'
import { usePreferences } from '@/hooks/usePreferences'

export default function TimeFromNowClient() {
  const { prefs } = usePreferences()
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [mins, setMins] = useState(15)
  const [direction, setDirection] = useState<'from' | 'ago'>('from')

  const totalMs = ((days * 24 + hours) * 60 + mins) * 60_000 * (direction === 'from' ? 1 : -1)
  const target = new Date(Date.now() + totalMs)

  const fmtTime = (d: Date) => new Intl.DateTimeFormat('en-US', {
    timeZone: prefs.timezone, hour: 'numeric', minute: '2-digit', hour12: prefs.timeFormat === '12h'
  }).format(d)
  const fmtDate = (d: Date) => new Intl.DateTimeFormat('en-US', {
    timeZone: prefs.timezone, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  }).format(d)

  const PRESETS = [
    { label: '+15 min', d: 0, h: 0, m: 15 },
    { label: '+30 min', d: 0, h: 0, m: 30 },
    { label: '+1 h', d: 0, h: 1, m: 0 },
    { label: '+2 h', d: 0, h: 2, m: 0 },
    { label: '+8 h', d: 0, h: 8, m: 0 },
    { label: '+1 day', d: 1, h: 0, m: 0 },
    { label: '+1 week', d: 7, h: 0, m: 0 },
  ]

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {(['from', 'ago'] as const).map(d => (
            <button key={d} onClick={() => setDirection(d)} style={{
              flex: 1, padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid',
              borderColor: direction === d ? 'var(--accent)' : 'var(--border)',
              background: direction === d ? 'var(--accent)' : 'transparent',
              color: direction === d ? 'var(--bg-primary)' : 'var(--text-primary)',
              fontWeight: 600, cursor: 'pointer',
            }}>{d === 'from' ? 'Time from now' : 'Time ago'}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {[
            { label: 'Days', val: days, set: setDays },
            { label: 'Hours', val: hours, set: setHours },
            { label: 'Minutes', val: mins, set: setMins },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input type="number" min={0} value={f.val} onChange={e => f.set(Math.max(0, Number(e.target.value) || 0))}
                style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.4rem', padding: '0.5rem 0.6rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {PRESETS.map(p => (
            <button key={p.label} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
              onClick={() => { setDays(p.d); setHours(p.h); setMins(p.m) }}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          {direction === 'from' ? 'Will be' : 'Was'}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 8vw, 4rem)', color: 'var(--accent)', textShadow: 'var(--glow)' }}>
          {fmtTime(target)}
        </div>
        <div style={{ marginTop: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{fmtDate(target)}</div>
      </div>
    </div>
  )
}
