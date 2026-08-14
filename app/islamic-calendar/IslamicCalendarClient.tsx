'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

function hijri(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const parts = formatter.formatToParts(date)
  return {
    day: parts.find(p => p.type === 'day')?.value ?? '',
    month: parts.find(p => p.type === 'month')?.value ?? '',
    year: parts.find(p => p.type === 'year')?.value ?? '',
  }
}

const selectStyle: React.CSSProperties = {
  marginLeft: 8,
  minWidth: 170,
  padding: '0.45rem 2rem 0.45rem 0.7rem',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
}

function withDayOffset(date: Date, offset: number) {
  const adjusted = new Date(date)
  adjusted.setDate(adjusted.getDate() + offset)
  return adjusted
}

export default function IslamicCalendarClient() {
  const now = new Date()
  const [offset, setOffset] = useState(0)
  const [cursor, setCursor] = useState(new Date(now.getFullYear(), now.getMonth(), 1))

  const today = new Date(now)

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
    const out: (Date | null)[] = []
    for (let i = 0; i < first.getDay(); i++) out.push(null)
    for (let d = 1; d <= last.getDate(); d++) {
      const x = new Date(cursor.getFullYear(), cursor.getMonth(), d)
      out.push(x)
    }
    return out
  }, [cursor, offset])

  const H = hijri(withDayOffset(today, offset))

  return (
    <section>
      <nav aria-label="Calendar type" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '1rem 0' }}>
        <Link href="/calendar" className="btn-ghost" style={{ textDecoration: 'none' }}>Gregorian Calendar</Link>
        <span className="btn-primary" aria-current="page">Islamic Calendar</span>
      </nav>

      <div className="card" style={{ margin: '1.5rem 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Today</div>
        <div style={{ fontSize: '2rem', color: 'var(--accent)', fontWeight: 800 }}>{H.day} {H.month} {H.year} AH</div>
        <div>{today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <label style={{ display: 'flex', marginTop: 14, alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>Moon-sighting adjustment</span>
          <select value={offset} onChange={e => setOffset(Number(e.target.value))} style={selectStyle} aria-label="Moon-sighting date adjustment">
            <option value={-1}>-1 day</option>
            <option value={0}>No adjustment</option>
            <option value={1}>+1 day</option>
          </select>
        </label>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 8 }}>
          Local moon sighting can differ by country. Use this control only when your local authority announces a different date.
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-ghost" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month">←</button>
          <h2>{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <button className="btn-ghost" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month">→</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginTop: 15 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(x => <b key={x} style={{ textAlign: 'center', fontSize: '.75rem' }}>{x}</b>)}
          {cells.map((d, i) => d ? (
            <div key={i} style={{ minHeight: 76, padding: 7, border: '1px solid var(--border)', borderRadius: 8 }}>
              <b>{d.getDate()}</b>
              <div style={{ color: 'var(--accent)', fontSize: '.7rem', marginTop: 6 }}>{hijri(withDayOffset(d, offset)).day} {hijri(withDayOffset(d, offset)).month.split(' ')[0]}</div>
            </div>
          ) : <div key={i} />)}
        </div>
      </div>
    </section>
  )
}
