'use client'

import { useEffect, useMemo, useState } from 'react'

type Holiday = { name: string; month: number; day: number }

const fixed: Record<string, Holiday[]> = {
  US: [{ name: "New Year's Day", month: 1, day: 1 }, { name: 'Independence Day', month: 7, day: 4 }, { name: 'Veterans Day', month: 11, day: 11 }, { name: 'Christmas Day', month: 12, day: 25 }],
  GB: [{ name: "New Year's Day", month: 1, day: 1 }, { name: 'Christmas Day', month: 12, day: 25 }, { name: 'Boxing Day', month: 12, day: 26 }],
  CA: [{ name: "New Year's Day", month: 1, day: 1 }, { name: 'Canada Day', month: 7, day: 1 }, { name: 'Christmas Day', month: 12, day: 25 }],
  PK: [{ name: 'Pakistan Day', month: 3, day: 23 }, { name: 'Independence Day', month: 8, day: 14 }, { name: 'Iqbal Day', month: 11, day: 9 }, { name: 'Quaid-e-Azam Day', month: 12, day: 25 }],
  IN: [{ name: 'Republic Day', month: 1, day: 26 }, { name: 'Independence Day', month: 8, day: 15 }, { name: 'Gandhi Jayanti', month: 10, day: 2 }],
  SA: [{ name: 'Founding Day', month: 2, day: 22 }, { name: 'National Day', month: 9, day: 23 }],
  AE: [{ name: "New Year's Day", month: 1, day: 1 }, { name: 'Commemoration Day', month: 12, day: 1 }, { name: 'National Day', month: 12, day: 2 }],
  AU: [{ name: "New Year's Day", month: 1, day: 1 }, { name: 'Australia Day', month: 1, day: 26 }, { name: 'ANZAC Day', month: 4, day: 25 }, { name: 'Christmas Day', month: 12, day: 25 }, { name: 'Boxing Day', month: 12, day: 26 }],
}

const countryNames = {
  US: 'United States',
  GB: 'United Kingdom',
  CA: 'Canada',
  PK: 'Pakistan',
  IN: 'India',
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  AU: 'Australia',
}

function nthWeekday(year: number, month: number, weekday: number, occurrence: number) {
  const first = new Date(year, month - 1, 1)
  return 1 + ((7 + weekday - first.getDay()) % 7) + (occurrence - 1) * 7
}

export default function HolidaysClient() {
  const [country, setCountry] = useState('US')
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => setYear(new Date().getFullYear()), [])

  const holidays = useMemo(() => {
    if (year === null) return []
    const items = [...(fixed[country] ?? [])]
    if (country === 'US') {
      items.push(
        { name: 'Martin Luther King Jr. Day', month: 1, day: nthWeekday(year, 1, 1, 3) },
        { name: 'Thanksgiving', month: 11, day: nthWeekday(year, 11, 4, 4) },
      )
    }
    if (country === 'CA') items.push({ name: 'Thanksgiving', month: 10, day: nthWeekday(year, 10, 1, 2) })
    return items.sort((a, b) => a.month - b.month || a.day - b.day)
  }, [country, year])

  if (year === null) {
    return <div className="card" aria-busy="true" style={{ marginTop: '1.5rem', minHeight: 180 }}>Loading the holiday calendar…</div>
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <section>
      <div className="card" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <label style={{ display: 'grid', gap: 4, flex: '1 1 230px' }}>
          Country
          <select value={country} onChange={event => setCountry(event.target.value)}>
            {Object.entries(countryNames).map(([value, name]) => <option value={value} key={value}>{name}</option>)}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 4, flex: '1 1 160px' }}>
          Year
          <input
            type="number"
            min={2020}
            max={2035}
            value={year}
            onChange={event => setYear(Number(event.target.value))}
            onBlur={() => setYear(current => Math.min(2035, Math.max(2020, current ?? new Date().getFullYear())))}
          />
        </label>
      </div>
      <div aria-live="polite" style={{ display: 'grid', gap: 10 }}>
        {holidays.map(holiday => {
          const date = new Date(year, holiday.month - 1, holiday.day)
          const days = Math.round((date.getTime() - today.getTime()) / 86_400_000)
          const timing = days > 0 ? `${days} days` : days === 0 ? 'Today' : 'Past'
          return (
            <article className="card" key={`${holiday.name}-${holiday.month}-${holiday.day}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <strong>{holiday.name}</strong>
                <div style={{ color: 'var(--text-secondary)' }}>{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <strong style={{ color: days >= 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>{timing}</strong>
            </article>
          )
        })}
      </div>
      <p style={{ marginTop: 18, color: 'var(--text-secondary)' }}>
        This starter calendar includes major nationwide holidays. Regional, bank, school and lunar holidays should be confirmed with the relevant government before travel or business decisions.
      </p>
    </section>
  )
}
