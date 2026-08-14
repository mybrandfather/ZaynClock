'use client'

import { useMemo, useState } from 'react'

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function formatMinutes(total: number) {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return `${hours} hr ${minutes} min`
}

export default function HoursCalculatorClient() {
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('17:00')
  const [breakMinutes, setBreakMinutes] = useState(30)
  const [overnight, setOvernight] = useState(false)

  const result = useMemo(() => {
    const startMinutes = toMinutes(start)
    let endMinutes = toMinutes(end)
    if (overnight || endMinutes < startMinutes) endMinutes += 24 * 60
    const gross = Math.max(0, endMinutes - startMinutes)
    const net = Math.max(0, gross - breakMinutes)
    return {
      gross,
      net,
      decimal: (net / 60).toFixed(2),
      finishNextDay: endMinutes >= 24 * 60,
    }
  }, [start, end, breakMinutes, overnight])

  const addRow = (startTime: string, endTime: string, breakTime: number) => {
    setStart(startTime)
    setEnd(endTime)
    setBreakMinutes(breakTime)
    setOvernight(false)
  }

  return (
    <div className="card" style={{ maxWidth: 820, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
        <label style={labelStyle}>
          Start time
          <input type="time" value={start} onChange={event => setStart(event.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          End time
          <input type="time" value={end} onChange={event => setEnd(event.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Unpaid break (minutes)
          <input type="number" min={0} max={720} value={breakMinutes}
            onChange={event => setBreakMinutes(Math.max(0, Math.min(720, Number(event.target.value) || 0)))} style={inputStyle} />
        </label>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
        <input type="checkbox" checked={overnight} onChange={event => setOvernight(event.target.checked)} />
        Shift ends the next day
      </label>

      <div aria-live="polite" style={{
        marginTop: '1.4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.75rem',
      }}>
        <Result label="Total after break" value={formatMinutes(result.net)} accent />
        <Result label="Decimal hours" value={result.decimal} />
        <Result label="Total minutes" value={String(result.net)} />
        <Result label="Before break" value={formatMinutes(result.gross)} />
      </div>

      {result.finishNextDay && (
        <p style={{ color: 'var(--accent2)', fontSize: '0.82rem', marginTop: '0.8rem' }}>
          Overnight calculation: the end time is treated as the following day.
        </p>
      )}

      <div style={{ marginTop: '1.4rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <h2 style={{ fontSize: '0.9rem', marginBottom: '0.65rem' }}>Common schedules</h2>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button className="btn-ghost" onClick={() => addRow('09:00', '17:00', 30)}>9–5, 30m break</button>
          <button className="btn-ghost" onClick={() => addRow('08:00', '16:30', 30)}>8–4:30, 30m break</button>
          <button className="btn-ghost" onClick={() => addRow('09:00', '17:30', 60)}>9–5:30, 1h break</button>
          <button className="btn-ghost" onClick={() => { setStart('22:00'); setEnd('06:00'); setBreakMinutes(30); setOvernight(true) }}>
            10pm–6am overnight
          </button>
        </div>
      </div>
    </div>
  )
}

function Result({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ padding: '1rem', borderRadius: '0.7rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ marginTop: '0.3rem', fontFamily: 'var(--font-display)', color: accent ? 'var(--accent)' : 'var(--text-primary)', fontSize: 'clamp(1.15rem, 3vw, 1.55rem)' }}>
        {value}
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'grid',
  gap: '0.4rem',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
} as const

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  colorScheme: 'dark',
} as const
