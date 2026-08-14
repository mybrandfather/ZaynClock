'use client'

import { useMemo, useState } from 'react'

type Shift = { day: string; start: string; end: string; breakMinutes: number; enabled: boolean }

const initialShifts: Shift[] = [
  { day: 'Monday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: true },
  { day: 'Tuesday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: true },
  { day: 'Wednesday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: true },
  { day: 'Thursday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: true },
  { day: 'Friday', start: '09:00', end: '17:00', breakMinutes: 30, enabled: true },
  { day: 'Saturday', start: '09:00', end: '17:00', breakMinutes: 0, enabled: false },
  { day: 'Sunday', start: '09:00', end: '17:00', breakMinutes: 0, enabled: false },
]

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function shiftMinutes(shift: Shift) {
  if (!shift.enabled) return 0
  const start = timeToMinutes(shift.start)
  let end = timeToMinutes(shift.end)
  if (end < start) end += 24 * 60
  return Math.max(0, end - start - shift.breakMinutes)
}

function hoursAndMinutes(total: number) {
  return `${Math.floor(total / 60)} hr ${total % 60} min`
}

export default function TimeCardCalculatorClient() {
  const [shifts, setShifts] = useState(initialShifts)

  const totals = useMemo(() => {
    const minutes = shifts.reduce((sum, shift) => sum + shiftMinutes(shift), 0)
    return { minutes, decimal: (minutes / 60).toFixed(2) }
  }, [shifts])

  const update = (index: number, patch: Partial<Shift>) => {
    setShifts(current => current.map((shift, shiftIndex) => shiftIndex === index ? { ...shift, ...patch } : shift))
  }

  const reset = () => setShifts(initialShifts)

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 650 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '125px 1fr 1fr 110px 125px',
          gap: '0.6rem',
          padding: '0 0.4rem 0.55rem',
          color: 'var(--text-secondary)',
          fontSize: '0.74rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <span>Day</span><span>Start</span><span>End</span><span>Break</span><span>Total</span>
        </div>
        {shifts.map((shift, index) => (
          <div key={shift.day} style={{
            display: 'grid',
            gridTemplateColumns: '125px 1fr 1fr 110px 125px',
            gap: '0.6rem',
            alignItems: 'center',
            padding: '0.55rem 0.4rem',
            borderTop: '1px solid var(--border)',
            opacity: shift.enabled ? 1 : 0.55,
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 600 }}>
              <input type="checkbox" checked={shift.enabled} onChange={event => update(index, { enabled: event.target.checked })} />
              {shift.day.slice(0, 3)}
            </label>
            <input aria-label={`${shift.day} start time`} type="time" value={shift.start} disabled={!shift.enabled}
              onChange={event => update(index, { start: event.target.value })} style={inputStyle} />
            <input aria-label={`${shift.day} end time`} type="time" value={shift.end} disabled={!shift.enabled}
              onChange={event => update(index, { end: event.target.value })} style={inputStyle} />
            <input aria-label={`${shift.day} break minutes`} type="number" min={0} max={720} value={shift.breakMinutes} disabled={!shift.enabled}
              onChange={event => update(index, { breakMinutes: Math.max(0, Math.min(720, Number(event.target.value) || 0)) })} style={inputStyle} />
            <strong style={{ color: shift.enabled ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
              {hoursAndMinutes(shiftMinutes(shift))}
            </strong>
          </div>
        ))}
      </div>

      <div aria-live="polite" style={{
        marginTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        padding: '1.1rem',
        borderRadius: '0.75rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Weekly total</div>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
            {hoursAndMinutes(totals.minutes)}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Decimal hours</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}>{totals.decimal}</div>
        </div>
        <button className="btn-ghost" onClick={reset}>Reset week</button>
      </div>
    </div>
  )
}

const inputStyle = {
  minWidth: 0,
  width: '100%',
  padding: '0.55rem',
  borderRadius: '0.45rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  colorScheme: 'dark',
} as const
