'use client'

import { useEffect, useRef, useState } from 'react'
import FullscreenButton from '@/components/features/FullscreenButton'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound } from '@/lib/sounds'

const PRESETS = [1, 3, 5, 10, 15, 20, 30]

function displayTime(totalSeconds: number) {
  const safe = Math.max(0, Math.ceil(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function ClassroomTimerClient() {
  const { prefs } = usePreferences()
  const [minutes, setMinutes] = useState(10)
  const [label, setLabel] = useState('Class activity')
  const [remaining, setRemaining] = useState(10 * 60)
  const [endAt, setEndAt] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const announced = useRef(false)

  const total = Math.max(1, minutes * 60)

  useEffect(() => {
    if (!endAt || paused) return

    const tick = () => {
      const next = Math.max(0, (endAt - Date.now()) / 1000)
      setRemaining(next)
      if (next <= 0 && !announced.current) {
        announced.current = true
        setEndAt(null)
        setFinished(true)
        if (prefs.soundEnabled) {
          playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)
        }
        try { new Notification(`${label || 'Class activity'} is finished`) } catch {}
      }
    }

    tick()
    const timer = window.setInterval(tick, 200)
    return () => window.clearInterval(timer)
  }, [endAt, paused, prefs.soundEnabled, prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl, label])

  useEffect(() => {
    if (!endAt && !paused && !finished) setRemaining(total)
  }, [total, endAt, paused, finished])

  const start = () => {
    announced.current = false
    setFinished(false)
    setPaused(false)
    const seconds = remaining > 0 ? remaining : total
    setRemaining(seconds)
    setEndAt(Date.now() + seconds * 1000)
  }

  const pause = () => {
    if (!endAt) return
    setRemaining(Math.max(0, (endAt - Date.now()) / 1000))
    setEndAt(null)
    setPaused(true)
  }

  const reset = () => {
    announced.current = false
    setEndAt(null)
    setPaused(false)
    setFinished(false)
    setRemaining(total)
  }

  const addMinute = () => {
    setFinished(false)
    setMinutes(value => Math.min(240, value + 1))
    setRemaining(value => value + 60)
    if (endAt) setEndAt(value => value ? value + 60_000 : value)
  }

  const choosePreset = (value: number) => {
    setMinutes(value)
    setEndAt(null)
    setPaused(false)
    setFinished(false)
    setRemaining(value * 60)
  }

  const progress = Math.max(0, Math.min(100, (remaining / total) * 100))
  const urgency = remaining <= 60 && (endAt !== null || paused)

  return (
    <div id="classroom-timer-screen" style={{
      minHeight: 'min(72vh, 720px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      borderRadius: '1rem',
      padding: 'clamp(1rem, 3vw, 2rem)',
    }}>
      <div className="card" style={{ textAlign: 'center', padding: 'clamp(1.25rem, 4vw, 3rem)' }}>
        <input
          aria-label="Classroom activity name"
          value={label}
          maxLength={60}
          onChange={event => setLabel(event.target.value)}
          style={{
            width: 'min(100%, 560px)',
            textAlign: 'center',
            color: 'var(--text-primary)',
            background: 'transparent',
            border: 0,
            borderBottom: '1px solid var(--border)',
            padding: '0.45rem',
            fontSize: 'clamp(1.05rem, 3vw, 1.55rem)',
            fontWeight: 700,
            marginBottom: '1.25rem',
          }}
        />

        <div
          role="timer"
          aria-live={finished ? 'assertive' : 'off'}
          style={{
            fontFamily: 'var(--font-display)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'clamp(3.5rem, 15vw, 9rem)',
            lineHeight: 1,
            color: finished ? 'var(--accent2)' : urgency ? '#ef4444' : 'var(--accent)',
            textShadow: finished || urgency ? '0 0 35px currentColor' : 'var(--glow)',
            margin: '0.4rem 0 1.25rem',
          }}
        >
          {finished ? 'TIME!' : displayTime(remaining)}
        </div>

        <div aria-label={`${Math.round(progress)} percent of time remaining`} style={{
          height: 16,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 999,
          overflow: 'hidden',
          margin: '0 auto 1.5rem',
          maxWidth: 760,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: urgency ? '#ef4444' : 'var(--accent)',
            transition: 'width 0.2s linear, background 0.2s',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          {!endAt && !paused && <button className="btn-primary" onClick={start}>▶ Start</button>}
          {endAt && <button className="btn-primary" onClick={pause}>⏸ Pause</button>}
          {paused && <button className="btn-primary" onClick={start}>▶ Resume</button>}
          <button className="btn-ghost" onClick={addMinute}>+1 minute</button>
          <button className="btn-ghost" onClick={reset}>↺ Reset</button>
          <FullscreenButton targetId="classroom-timer-screen" />
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '0.95rem', marginBottom: '0.7rem' }}>Quick classroom timers</h2>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {PRESETS.map(value => (
            <button
              key={value}
              onClick={() => choosePreset(value)}
              style={{
                flex: '1 1 70px',
                padding: '0.65rem',
                borderRadius: '0.5rem',
                border: `1px solid ${minutes === value ? 'var(--accent)' : 'var(--border)'}`,
                background: minutes === value ? 'var(--accent)' : 'transparent',
                color: minutes === value ? 'var(--bg-primary)' : 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {value} min
            </button>
          ))}
          <label style={{ flex: '1 1 120px', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            Custom
            <input
              type="number"
              min={1}
              max={240}
              value={minutes}
              onChange={event => choosePreset(Math.max(1, Math.min(240, Number(event.target.value) || 1)))}
              style={{
                width: 72,
                padding: '0.6rem',
                borderRadius: '0.45rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
