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

export function getShiftMinutes(shift: Shift) {
  if (!shift.enabled) return 0
  const start = timeToMinutes(shift.start)
  let end = timeToMinutes(shift.end)
  if (end < start) end += 24 * 60
  return Math.max(0, end - start - shift.breakMinutes)
}

function hoursAndMinutes(total: number) {
  return `${Math.floor(total / 60)} hr ${total % 60} min`
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`
}

export default function TimeCardCalculatorClient() {
  const [shifts, setShifts] = useState(initialShifts)
  const [overtimeThreshold, setOvertimeThreshold] = useState(40)

  const totals = useMemo(() => {
    const minutes = shifts.reduce((sum, shift) => sum + getShiftMinutes(shift), 0)
    const overtimeMinutes = Math.max(0, minutes - overtimeThreshold * 60)
    const regularMinutes = minutes - overtimeMinutes
    return { minutes, regularMinutes, overtimeMinutes, decimal: (minutes / 60).toFixed(2) }
  }, [shifts, overtimeThreshold])

  const update = (index: number, patch: Partial<Shift>) => {
    setShifts(current => current.map((shift, shiftIndex) => shiftIndex === index ? { ...shift, ...patch } : shift))
  }

  const reset = () => {
    setShifts(initialShifts)
    setOvertimeThreshold(40)
  }

  const exportCsv = () => {
    const rows = [
      ['Day', 'Start', 'End', 'Unpaid break (minutes)', 'Hours', 'Decimal hours'],
      ...shifts.filter(shift => shift.enabled).map(shift => [shift.day, shift.start, shift.end, shift.breakMinutes, hoursAndMinutes(getShiftMinutes(shift)), (getShiftMinutes(shift) / 60).toFixed(2)]),
      [],
      ['Regular hours', hoursAndMinutes(totals.regularMinutes)],
      ['Overtime hours', hoursAndMinutes(totals.overtimeMinutes)],
      ['Total hours', hoursAndMinutes(totals.minutes)],
      ['Total decimal hours', totals.decimal],
    ]
    const blob = new Blob([rows.map(row => row.map(csvCell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'zaynclock-time-card.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="card time-card-print" style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 680 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '125px 1fr 1fr 110px 125px', gap: '0.6rem', padding: '0 0.4rem 0.55rem', color: 'var(--text-secondary)', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <span>Day</span><span>Start</span><span>End</span><span>Break</span><span>Total</span>
        </div>
        {shifts.map((shift, index) => {
          const overnight = shift.enabled && timeToMinutes(shift.end) < timeToMinutes(shift.start)
          return (
            <div key={shift.day} style={{ display: 'grid', gridTemplateColumns: '125px 1fr 1fr 110px 125px', gap: '0.6rem', alignItems: 'center', padding: '0.55rem 0.4rem', borderTop: '1px solid var(--border)', opacity: shift.enabled ? 1 : 0.55 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 600 }}>
                <input type="checkbox" checked={shift.enabled} onChange={event => update(index, { enabled: event.target.checked })} />
                {shift.day.slice(0, 3)}
              </label>
              <input aria-label={`${shift.day} start time`} type="time" value={shift.start} disabled={!shift.enabled} onChange={event => update(index, { start: event.target.value })} style={inputStyle} />
              <input aria-label={`${shift.day} end time`} type="time" value={shift.end} disabled={!shift.enabled} onChange={event => update(index, { end: event.target.value })} style={inputStyle} />
              <input aria-label={`${shift.day} unpaid break minutes`} type="number" min={0} max={720} value={shift.breakMinutes} disabled={!shift.enabled} onChange={event => update(index, { breakMinutes: Math.max(0, Math.min(720, Number(event.target.value) || 0)) })} style={inputStyle} />
              <strong title={overnight ? 'Overnight shift: end time is the next day' : undefined} style={{ color: shift.enabled ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
                {hoursAndMinutes(getShiftMinutes(shift))}{overnight ? ' +1d' : ''}
              </strong>
            </div>
          )
        })}
      </div>

      <div className="print-hide" style={{ marginTop: '1.15rem', display: 'flex', alignItems: 'end', gap: '0.75rem', flexWrap: 'wrap' }}>
        <label style={{ display: 'grid', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
          Weekly overtime starts after
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <input aria-label="Weekly overtime threshold in hours" type="number" min={0} max={168} step={0.25} value={overtimeThreshold} onChange={event => setOvertimeThreshold(Math.max(0, Math.min(168, Number(event.target.value) || 0)))} style={{ ...inputStyle, width: 100 }} /> hours
          </span>
        </label>
      </div>

      <div aria-live="polite" style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '0.75rem', padding: '1.1rem', borderRadius: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <Result label="Regular hours" value={hoursAndMinutes(totals.regularMinutes)} />
        <Result label="Overtime hours" value={hoursAndMinutes(totals.overtimeMinutes)} />
        <Result label="Weekly total" value={hoursAndMinutes(totals.minutes)} accent />
        <Result label="Decimal total" value={totals.decimal} />
      </div>

      <div className="print-hide" style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button className="btn-primary" onClick={() => window.print()}>Print time card</button>
        <button className="btn-ghost" onClick={exportCsv}>Export CSV</button>
        <button className="btn-ghost" onClick={reset}>Reset week</button>
      </div>
      <p style={{ marginBottom: 0, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>“+1d” means the shift ends after midnight. Breaks are deducted before regular and overtime totals are split.</p>
      <style>{`@media print { header, footer, .print-hide { display: none !important; } .time-card-print { box-shadow: none !important; border: 0 !important; } }`}</style>
    </div>
  )
}

function Result({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div><div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>{label}</div><strong style={{ display: 'block', marginTop: '0.2rem', color: accent ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.05rem, 3vw, 1.45rem)' }}>{value}</strong></div>
}

const inputStyle = { minWidth: 0, width: '100%', padding: '0.55rem', borderRadius: '0.45rem', border: '1px solid var(--control-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', colorScheme: 'dark' } as const
