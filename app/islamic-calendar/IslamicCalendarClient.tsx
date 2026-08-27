'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function hijri(date: Date) {
  const parts = hijriFormatter.formatToParts(date)
  return {
    day: parts.find(part => part.type === 'day')?.value ?? '',
    month: parts.find(part => part.type === 'month')?.value ?? '',
    year: parts.find(part => part.type === 'year')?.value ?? '',
  }
}

function withDayOffset(date: Date, offset: number) {
  const adjusted = new Date(date)
  adjusted.setDate(adjusted.getDate() + offset)
  return adjusted
}

function sameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const selectStyle: React.CSSProperties = {
  minWidth: 170,
  padding: '0.45rem 2rem 0.45rem 0.7rem',
  borderRadius: 8,
  border: '1px solid var(--control-border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
}

export default function IslamicCalendarClient() {
  const [today, setToday] = useState<Date | null>(null)
  const [offset, setOffset] = useState(0)
  const [cursor, setCursor] = useState<Date | null>(null)

  useEffect(() => {
    const current = new Date()
    setToday(current)
    setCursor(new Date(current.getFullYear(), current.getMonth(), 1))
  }, [])

  const cells = useMemo(() => {
    if (!cursor) return []
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
    const output: (Date | null)[] = Array.from({ length: first.getDay() }, () => null)
    for (let day = 1; day <= last.getDate(); day += 1) {
      output.push(new Date(cursor.getFullYear(), cursor.getMonth(), day))
    }
    return output
  }, [cursor])

  if (!today || !cursor) {
    return <div className="card" aria-busy="true" style={{ marginTop: '1.5rem', minHeight: 180 }}>Loading today&apos;s calendar…</div>
  }

  const todayHijri = hijri(withDayOffset(today, offset))

  return (
    <section>
      <nav aria-label="Calendar type" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '1rem 0' }}>
        <Link href="/calendar" className="btn-ghost" style={{ textDecoration: 'none' }}>Gregorian Calendar</Link>
        <span className="btn-primary" aria-current="page">Islamic Calendar</span>
      </nav>

      <div className="card" style={{ margin: '1.5rem 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Today</div>
        <div style={{ fontSize: 'clamp(1.45rem, 6vw, 2rem)', color: 'var(--accent)', fontWeight: 800 }}>
          {todayHijri.day} {todayHijri.month} {todayHijri.year} AH
        </div>
        <div>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <label style={{ display: 'flex', marginTop: 14, alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>Moon-sighting adjustment</span>
          <select value={offset} onChange={event => setOffset(Number(event.target.value))} style={selectStyle} aria-label="Moon-sighting date adjustment">
            <option value={-1}>-1 day</option>
            <option value={0}>No adjustment</option>
            <option value={1}>+1 day</option>
          </select>
        </label>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 8 }}>
          Local moon sighting can differ by country. Use this control only when your local authority announces a different date.
        </p>
      </div>

      <div className="card" style={{ padding: 'clamp(0.65rem, 3vw, 1.5rem)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <button className="btn-ghost" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month">←</button>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1rem, 5vw, 1.5rem)' }}>{cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button className="btn-ghost" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month">→</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 'clamp(2px, 1vw, 6px)', marginTop: 15 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <b key={day} style={{ textAlign: 'center', fontSize: 'clamp(.58rem, 2.4vw, .75rem)' }}>{day}</b>)}
          {cells.map((date, index) => {
            if (!date) return <div key={`empty-${index}`} />
            const adjusted = hijri(withDayOffset(date, offset))
            const isToday = sameDate(date, today)
            return (
              <div
                key={date.toISOString()}
                aria-current={isToday ? 'date' : undefined}
                title={`${adjusted.day} ${adjusted.month} ${adjusted.year} AH`}
                style={{
                  minWidth: 0,
                  minHeight: 68,
                  padding: 'clamp(3px, 1.4vw, 7px)',
                  border: `1px solid ${isToday ? 'var(--accent)' : 'var(--control-border)'}`,
                  borderRadius: 8,
                  background: isToday ? 'color-mix(in srgb, var(--accent) 12%, var(--bg-card))' : undefined,
                  overflow: 'hidden',
                }}
              >
                <b>{date.getDate()}</b>
                <div style={{ color: 'var(--accent)', fontSize: 'clamp(.58rem, 2.4vw, .72rem)', marginTop: 6, whiteSpace: 'nowrap' }}>
                  {adjusted.day} {adjusted.month.slice(0, 3)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
