'use client'

import { useState } from 'react'
import { WORLD_CITIES } from '@/lib/utils'
import AdSlot from '@/components/layout/AdSlot'

const ZONES = WORLD_CITIES.map(c => ({ label: `${c.flag} ${c.city}`, tz: c.timezone }))

function convertTime(timeStr: string, fromTz: string, toTz: string): string {
  try {
    const [h, m] = timeStr.split(':').map(Number)
    if (isNaN(h) || isNaN(m)) return '—'
    // Create a date in the from timezone
    const now = new Date()
    // Build a date string anchored to today in fromTz
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTz, year: 'numeric', month: '2-digit', day: '2-digit'
    })
    const todayInFrom = formatter.format(now)
    const dt = new Date(`${todayInFrom}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
    // Get the UTC offset difference
    const getOffset = (tz: string) => {
      const d = new Date()
      const utcStr = d.toLocaleString('en-US', { timeZone: 'UTC' })
      const localStr = d.toLocaleString('en-US', { timeZone: tz })
      return (new Date(localStr).getTime() - new Date(utcStr).getTime())
    }
    const diff = getOffset(toTz) - getOffset(fromTz)
    const result = new Date(dt.getTime() + diff)
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: toTz,
    }).format(result)
  } catch { return '—' }
}

export default function ConverterPage() {
  const [time, setTime] = useState('09:00')
  const [fromTz, setFromTz] = useState('America/New_York')
  const [toTzList, setToTzList] = useState(['Europe/London', 'Asia/Tokyo', 'Asia/Dubai'])

  const addZone = (tz: string) => {
    if (!toTzList.includes(tz)) setToTzList(p => [...p, tz])
  }

  const removeZone = (tz: string) => setToTzList(p => p.filter(t => t !== tz))

  const selectStyle: React.CSSProperties = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    width: '100%',
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
        🔄 TIME CONVERTER
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Convert any time between time zones instantly
      </p>

      <AdSlot format="leaderboard" style={{ marginBottom: '1.5rem' }} />

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ ...selectStyle }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>From Timezone</label>
            <select value={fromTz} onChange={e => setFromTz(e.target.value)} style={selectStyle}>
              {ZONES.map(z => <option key={z.tz} value={z.tz}>{z.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {toTzList.map(tz => {
          const city = WORLD_CITIES.find(c => c.timezone === tz)
          const converted = convertTime(time, fromTz, tz)
          return (
            <div key={tz} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{city?.flag ?? '🌐'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{city?.city ?? tz.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tz}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--accent)' }}>
                {converted}
              </div>
              <button
                onClick={() => removeZone(tz)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1rem' }}
              >✕</button>
            </div>
          )
        })}
      </div>

      {/* Add Zone */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>➕ Add Timezone</label>
        <select
          defaultValue=""
          onChange={e => { if (e.target.value) { addZone(e.target.value); e.target.value = '' } }}
          style={selectStyle}
        >
          <option value="" disabled>Select a city to add...</option>
          {ZONES.filter(z => !toTzList.includes(z.tz) && z.tz !== fromTz).map(z => (
            <option key={z.tz} value={z.tz}>{z.label}</option>
          ))}
        </select>
      </div>

      <AdSlot format="rectangle" />
    </div>
  )
}
