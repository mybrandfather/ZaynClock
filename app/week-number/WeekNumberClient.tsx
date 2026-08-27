'use client'

import { useEffect, useMemo, useState } from 'react'

const DAY_MS = 86_400_000

export function getIsoWeek(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const isoDay = target.getUTCDay() || 7
  target.setUTCDate(target.getUTCDate() + 4 - isoDay)
  const weekYear = target.getUTCFullYear()
  const yearStart = new Date(Date.UTC(weekYear, 0, 1))
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7)
  return { week, year: weekYear, day: isoDay }
}

export function getIsoWeekRange(year: number, week: number) {
  const januaryFourth = new Date(Date.UTC(year, 0, 4))
  const januaryFourthDay = januaryFourth.getUTCDay() || 7
  const monday = new Date(januaryFourth)
  monday.setUTCDate(januaryFourth.getUTCDate() - januaryFourthDay + 1 + (week - 1) * 7)
  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)
  return { monday, sunday }
}

export function getIsoWeeksInYear(year: number) {
  return getIsoWeek(new Date(year, 11, 28)).week
}

function localDateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export default function WeekNumberClient({ initialDate }: { initialDate: string }) {
  const [value, setValue] = useState(initialDate)

  useEffect(() => {
    const localToday = localDateValue(new Date())
    if (localToday !== initialDate) setValue(localToday)
  }, [initialDate])

  const selected = useMemo(() => value ? getIsoWeek(parseDate(value)) : null, [value])
  const currentYear = value ? parseDate(value).getFullYear() : null
  const selectedRange = selected ? getIsoWeekRange(selected.year, selected.week) : null
  const yearRows = useMemo(() => {
    if (!currentYear) return []
    return Array.from({ length: getIsoWeeksInYear(currentYear) }, (_, index) => ({ week: index + 1, ...getIsoWeekRange(currentYear, index + 1) }))
  }, [currentYear])

  if (!selected || !selectedRange || !currentYear) {
    return <div className="card" aria-live="polite" style={{ textAlign: 'center' }}>Loading the current ISO week…</div>
  }

  const todayWeek = getIsoWeek(new Date())
  const isToday = value === localDateValue(new Date())

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', minWidth: 0 }}>
      <section className="card" aria-live="polite" style={{ textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {isToday ? 'Current ISO week' : 'Selected date'}
        </div>
        <strong style={{ display: 'block', margin: '0.25rem 0', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 10vw, 4.6rem)' }}>
          Week {selected.week}
        </strong>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          {formatDate(selectedRange.monday)} – {formatDate(selectedRange.sunday)} · ISO week-year {selected.year}
        </p>
      </section>

      <section className="card" aria-labelledby="date-to-week-heading">
        <h2 id="date-to-week-heading" style={{ marginTop: 0, fontSize: '1.25rem' }}>Date-to-week calculator</h2>
        <label style={{ display: 'grid', gap: '0.45rem', maxWidth: 420, color: 'var(--text-secondary)' }}>
          Choose any date
          <input type="date" value={value} onChange={event => setValue(event.target.value)} style={{ padding: '0.8rem', borderRadius: 8, border: '1px solid var(--control-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', colorScheme: 'dark' }} />
        </label>
        <p style={{ marginBottom: 0, color: 'var(--text-secondary)' }}>
          {formatDate(parseDate(value))} is day {selected.day} of ISO week {selected.week}, {selected.year}.
        </p>
      </section>

      <section className="card" aria-labelledby="week-table-heading">
        <h2 id="week-table-heading" style={{ marginTop: 0, fontSize: '1.25rem' }}>{currentYear} ISO week table</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{currentYear} has {yearRows.length} ISO weeks. Every ISO week begins Monday and ends Sunday.</p>
        <div style={{ overflowX: 'auto', maxHeight: 520, border: '1px solid var(--border)', borderRadius: '0.65rem' }}>
          <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 1 }}>
              <tr><th style={cellStyle}>Week</th><th style={cellStyle}>Monday</th><th style={cellStyle}>Sunday</th></tr>
            </thead>
            <tbody>
              {yearRows.map(row => (
                <tr key={row.week} style={row.week === todayWeek.week && currentYear === todayWeek.year ? { background: 'color-mix(in srgb, var(--accent) 10%, transparent)' } : undefined}>
                  <th scope="row" style={cellStyle}>Week {row.week}</th>
                  <td style={cellStyle}>{formatDate(row.monday)}</td>
                  <td style={cellStyle}>{formatDate(row.sunday)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

const cellStyle = { padding: '0.65rem 0.8rem', textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' } as const
