'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import AdSlot from '@/components/layout/AdSlot'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound } from '@/lib/sounds'

type Mode = 'focus' | 'short' | 'long'

const MODES: Record<Mode, { label: string; seconds: number; color: string; emoji: string }> = {
  focus:  { label: 'Focus',       seconds: 25 * 60, color: '#ef4444', emoji: '🍅' },
  short:  { label: 'Short Break', seconds:  5 * 60, color: '#22c55e', emoji: '☕' },
  long:   { label: 'Long Break',  seconds: 15 * 60, color: '#3b82f6', emoji: '🛋️' },
}

export default function PomodoroPage() {
  const { prefs } = usePreferences()
  const [mode, setMode] = useState<Mode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.seconds)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [customMinutes, setCustomMinutes] = useState<Record<Mode, number>>({ focus: 25, short: 5, long: 15 })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const current = MODES[mode]
  const totalSeconds = customMinutes[mode] * 60
  const progress = 1 - secondsLeft / totalSeconds
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const secs = (secondsLeft % 60).toString().padStart(2, '0')

  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(customMinutes[mode] * 60)
  }, [mode, customMinutes])

  useEffect(() => { reset() }, [mode, reset])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            setRunning(false)
            if (mode === 'focus') setSessions(n => n + 1)
            if (prefs.soundEnabled) playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(`ZaynClock: ${current.label} complete! ${current.emoji}`)
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, mode, current.label, current.emoji])

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  // Circumference of progress circle
  const radius = 110
  const circumference = 2 * Math.PI * radius

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
        🍅 POMODORO TIMER
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Stay focused. Work in bursts. Get more done.
      </p>

      {/* Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(MODES) as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '2rem',
              border: '2px solid',
              borderColor: mode === m ? MODES[m].color : 'var(--border)',
              background: mode === m ? MODES[m].color + '22' : 'transparent',
              color: mode === m ? MODES[m].color : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            {MODES[m].emoji} {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Circular Progress Timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: 260, height: 260 }}>
          <svg width="260" height="260" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="130" cy="130" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="130" cy="130" r={radius}
              fill="none"
              stroke={current.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${current.color})` }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.5rem',
              color: current.color,
              lineHeight: 1,
              textShadow: `0 0 20px ${current.color}`,
            }}>
              {minutes}:{secs}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {current.emoji} {current.label}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => { requestNotificationPermission(); setRunning(r => !r) }}
          className="btn-primary"
          style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', background: current.color }}
        >
          {running ? '⏸ Pause' : secondsLeft === totalSeconds ? '▶ Start' : '▶ Resume'}
        </button>
        <button onClick={reset} className="btn-ghost" style={{ padding: '0.75rem 1.5rem' }}>
          ↺ Reset
        </button>
      </div>

      {/* Session Counter */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Completed Today</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {Array.from({ length: Math.max(4, sessions + 1) }).map((_, i) => (
            <span key={i} style={{ fontSize: '1.4rem', opacity: i < sessions ? 1 : 0.2 }}>🍅</span>
          ))}
        </div>
        {sessions > 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {sessions} session{sessions !== 1 ? 's' : ''} · ~{sessions * 25} minutes focused
          </p>
        )}
      </div>

      {/* Custom Duration */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>⚙️ Custom Durations (minutes)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {(Object.keys(MODES) as Mode[]).map(m => (
            <div key={m}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>{MODES[m].label}</label>
              <input
                type="number"
                min={1} max={120}
                value={customMinutes[m]}
                onChange={e => {
                  const v = parseInt(e.target.value)
                  if (v > 0 && v <= 120) {
                    setCustomMinutes(p => ({ ...p, [m]: v }))
                    if (m === mode && !running) setSecondsLeft(v * 60)
                  }
                }}
                style={{
                  width: '100%', background: 'var(--bg-primary)',
                  border: '1px solid var(--border)', borderRadius: '0.375rem',
                  padding: '0.4rem', color: 'var(--text-primary)', fontSize: '0.9rem',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <AdSlot format="rectangle" />

      {/* SEO Content */}
      <section style={{ padding: '2rem 0', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.75rem' }}>What is the Pomodoro Technique?</h2>
        <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo. Work in 25-minute focused intervals (Pomodoros), take a 5-minute break, and after 4 Pomodoros take a 15–30 minute long break. This rhythm maximizes focus while preventing burnout.</p>
      </section>
    </div>
  )
}
