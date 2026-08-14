'use client'

import { useMemo, useState } from 'react'

function parseNames(value: string) {
  return value
    .split(/[\n,]+/)
    .map(name => name.trim())
    .filter(Boolean)
}

function randomIndex(length: number) {
  if (length <= 1) return 0
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const maximum = Math.floor(0x100000000 / length) * length
    const values = new Uint32Array(1)
    do { crypto.getRandomValues(values) } while (values[0] >= maximum)
    return values[0] % length
  }
  return Math.floor(Math.random() * length)
}

export default function RandomNamePickerClient() {
  const [rawNames, setRawNames] = useState('')
  const [available, setAvailable] = useState<string[]>([])
  const [selected, setSelected] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [removeAfterPick, setRemoveAfterPick] = useState(true)
  const [spinning, setSpinning] = useState(false)

  const enteredNames = useMemo(() => parseNames(rawNames), [rawNames])

  const loadNames = () => {
    setAvailable(enteredNames)
    setSelected('')
    setHistory([])
  }

  const pick = () => {
    const pool = available.length > 0 ? available : enteredNames
    if (pool.length === 0 || spinning) return
    setSpinning(true)
    setSelected('Choosing…')

    window.setTimeout(() => {
      const index = randomIndex(pool.length)
      const winner = pool[index]
      setSelected(winner)
      setHistory(value => [winner, ...value].slice(0, 50))
      if (removeAfterPick) setAvailable(pool.filter((_, itemIndex) => itemIndex !== index))
      else setAvailable(pool)
      setSpinning(false)
    }, 650)
  }

  const reset = () => {
    setAvailable(enteredNames)
    setSelected('')
    setHistory([])
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
      <div className="card">
        <h2 style={{ fontSize: '1rem', marginBottom: '0.45rem' }}>1. Add names</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.7rem' }}>
          One name per line, or separate names with commas. Names stay only in this tab and are not saved.
        </p>
        <textarea
          value={rawNames}
          onChange={event => setRawNames(event.target.value)}
          rows={12}
          placeholder={'Aisha\nBen\nCarlos\nDiana'}
          style={{
            width: '100%',
            resize: 'vertical',
            border: '1px solid var(--border)',
            borderRadius: '0.55rem',
            padding: '0.75rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
          }}
        />
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', margin: '0.45rem 0' }}>
          {enteredNames.length} {enteredNames.length === 1 ? 'name' : 'names'} entered
        </div>
        <button className="btn-primary" onClick={loadNames} disabled={enteredNames.length === 0} style={{ width: '100%' }}>
          Load class list
        </button>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', justifyContent: 'center', minHeight: 430 }}>
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>2. Pick a random name</h2>
        <div aria-live="polite" style={{
          minHeight: 150,
          display: 'grid',
          placeItems: 'center',
          padding: '1rem',
          borderRadius: '1rem',
          border: '2px solid var(--accent)',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%)',
          boxShadow: 'var(--glow)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.65rem, 6vw, 3.2rem)',
          color: 'var(--accent)',
          overflowWrap: 'anywhere',
        }}>
          {selected || 'Ready'}
        </div>
        <button className="btn-primary" onClick={pick} disabled={spinning || (available.length === 0 && enteredNames.length === 0)}
          style={{ marginTop: '1rem', padding: '0.85rem' }}>
          🎯 {spinning ? 'Choosing…' : 'Pick a name'}
        </button>
        <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.85rem' }}>
          <input type="checkbox" checked={removeAfterPick} onChange={event => setRemoveAfterPick(event.target.checked)} />
          Remove each name after it is picked
        </label>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.55rem' }}>
          {available.length} names remaining
        </p>
        <button className="btn-ghost" onClick={reset} style={{ marginTop: '0.4rem' }}>Reset all names</button>

        {history.length > 0 && (
          <div style={{ textAlign: 'left', marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border)' }}>
            <strong style={{ fontSize: '0.82rem' }}>Recent picks:</strong>{' '}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{history.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
