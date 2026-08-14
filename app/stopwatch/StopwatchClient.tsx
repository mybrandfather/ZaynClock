'use client'

import { useState, useEffect, useRef } from 'react'
import AdSlot from '@/components/layout/AdSlot'

interface Lap {
  number: number
  split: number
  total: number
}

function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const secs = (totalSeconds % 60).toString().padStart(2, '0')
  const centisecs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0')
  return `${mins}:${secs}.${centisecs}`
}

export default function StopwatchPage() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const startRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - elapsedRef.current
      const tick = () => {
        setElapsed(Date.now() - startRef.current!)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      elapsedRef.current = elapsed
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const handleStartStop = () => setRunning(r => !r)

  const handleLap = () => {
    if (!running) return
    const lastTotal = laps.length ? laps[laps.length - 1].total : 0
    setLaps(l => [...l, { number: l.length + 1, split: elapsed - lastTotal, total: elapsed }])
  }

  const handleReset = () => {
    setRunning(false)
    setElapsed(0)
    elapsedRef.current = 0
    setLaps([])
  }

  const fastestLap = laps.length > 1 ? Math.min(...laps.map(l => l.split)) : null
  const slowestLap = laps.length > 1 ? Math.max(...laps.map(l => l.split)) : null

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
        ⏱️ STOPWATCH
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
        Precision timing with lap tracking
      </p>

      {/* Timer Display */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 12vw, 5.5rem)',
          color: 'var(--accent)',
          textShadow: 'var(--glow)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}>
          {formatMs(elapsed)}
        </div>
        {laps.length > 0 && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Lap {laps.length + 1}: {formatMs(elapsed - laps[laps.length - 1].total)}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={handleStartStop} className="btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', minWidth: 140 }}>
          {running ? '⏸ Pause' : elapsed === 0 ? '▶ Start' : '▶ Resume'}
        </button>
        <button onClick={handleLap} className="btn-ghost" style={{ padding: '0.75rem 1.5rem' }} disabled={!running}>
          🔖 Lap
        </button>
        <button onClick={handleReset} className="btn-ghost" style={{ padding: '0.75rem 1.5rem' }}>
          ↺ Reset
        </button>
      </div>

      {/* Laps Table */}
      {laps.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>Lap Times</h3>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {[...laps].reverse().map(lap => {
              const isFastest = fastestLap !== null && lap.split === fastestLap
              const isSlowest = slowestLap !== null && lap.split === slowestLap
              return (
                <div key={lap.number} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 1fr',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center',
                  color: isFastest ? '#22c55e' : isSlowest ? '#ef4444' : 'var(--text-primary)',
                }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>#{lap.number}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{formatMs(lap.split)}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>{formatMs(lap.total)}</span>
                </div>
              )
            })}
          </div>
          {laps.length > 1 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: '#22c55e' }}>● Fastest</span>
              <span style={{ color: '#ef4444' }}>● Slowest</span>
            </div>
          )}
        </div>
      )}

      <AdSlot format="rectangle" />
    </div>
  )
}
