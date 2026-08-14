'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import FullscreenButton from '@/components/features/FullscreenButton'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound } from '@/lib/sounds'

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.ceil(seconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  return hours > 0
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function MeetingTimerClient() {
  const { prefs } = usePreferences()
  const [title, setTitle] = useState('Team meeting')
  const [goal, setGoal] = useState('Leave with clear decisions and owners')
  const [minutes, setMinutes] = useState(30)
  const [warningMinutes, setWarningMinutes] = useState(5)
  const [attendees, setAttendees] = useState(5)
  const [hourlyCost, setHourlyCost] = useState(50)
  const [remaining, setRemaining] = useState(30 * 60)
  const [endAt, setEndAt] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const alerted = useRef(false)

  const total = Math.max(60, minutes * 60)
  const elapsed = Math.max(0, total - remaining)
  const cost = useMemo(() => attendees * hourlyCost * (elapsed / 3600), [attendees, hourlyCost, elapsed])

  useEffect(() => {
    if (!endAt || paused) return
    const tick = () => {
      const next = Math.max(0, (endAt - Date.now()) / 1000)
      setRemaining(next)
      if (next <= 0 && !alerted.current) {
        alerted.current = true
        setEndAt(null)
        setFinished(true)
        if (prefs.soundEnabled) playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)
      }
    }
    tick()
    const timer = window.setInterval(tick, 200)
    return () => window.clearInterval(timer)
  }, [endAt, paused, prefs.soundEnabled, prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl])

  useEffect(() => {
    if (!endAt && !paused && !finished) setRemaining(total)
  }, [total, endAt, paused, finished])

  const start = () => {
    alerted.current = false
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
    alerted.current = false
    setEndAt(null)
    setPaused(false)
    setFinished(false)
    setRemaining(total)
  }

  const warning = remaining <= warningMinutes * 60 && (endAt !== null || paused)
  const progress = Math.max(0, Math.min(100, (remaining / total) * 100))

  return (
    <div id="meeting-timer-screen" style={{
      minHeight: 'min(78vh, 760px)',
      background: 'var(--bg-primary)',
      borderRadius: '1rem',
      padding: 'clamp(1rem, 3vw, 2rem)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div className="card" style={{ textAlign: 'center', padding: 'clamp(1.25rem, 4vw, 2.7rem)' }}>
        <input value={title} maxLength={70} onChange={event => setTitle(event.target.value)}
          aria-label="Meeting title" style={titleStyle} />
        <input value={goal} maxLength={120} onChange={event => setGoal(event.target.value)}
          aria-label="Meeting outcome" style={goalStyle} />

        <div role="timer" aria-live={finished ? 'assertive' : 'off'} style={{
          fontFamily: 'var(--font-display)',
          fontVariantNumeric: 'tabular-nums',
          fontSize: 'clamp(3.5rem, 15vw, 8rem)',
          lineHeight: 1,
          margin: '1.2rem 0',
          color: finished ? 'var(--accent2)' : warning ? '#ef4444' : 'var(--accent)',
          textShadow: finished || warning ? '0 0 35px currentColor' : 'var(--glow)',
        }}>
          {finished ? 'DONE' : formatTime(remaining)}
        </div>

        <div style={{ height: 12, maxWidth: 720, margin: '0 auto 1.25rem', borderRadius: 999, overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: warning ? '#ef4444' : 'var(--accent)', transition: 'width 0.2s linear' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Elapsed</div>
            <strong>{formatTime(elapsed)}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Estimated people cost</div>
            <strong style={{ color: 'var(--accent2)' }}>${cost.toFixed(2)}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          {!endAt && !paused && <button className="btn-primary" onClick={start}>▶ Start meeting</button>}
          {endAt && <button className="btn-primary" onClick={pause}>⏸ Pause</button>}
          {paused && <button className="btn-primary" onClick={start}>▶ Resume</button>}
          <button className="btn-ghost" onClick={() => {
            setMinutes(value => Math.min(480, value + 5))
            setRemaining(value => value + 300)
            if (endAt) setEndAt(value => value ? value + 300_000 : value)
          }}>+5 minutes</button>
          <button className="btn-ghost" onClick={reset}>↺ Reset</button>
          <FullscreenButton targetId="meeting-timer-screen" />
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '0.8rem' }}>
          <label style={labelStyle}>Meeting minutes
            <input type="number" min={1} max={480} value={minutes}
              onChange={event => setMinutes(Math.max(1, Math.min(480, Number(event.target.value) || 1)))} style={inputStyle} />
          </label>
          <label style={labelStyle}>Red warning at
            <input type="number" min={1} max={60} value={warningMinutes}
              onChange={event => setWarningMinutes(Math.max(1, Math.min(60, Number(event.target.value) || 1)))} style={inputStyle} />
          </label>
          <label style={labelStyle}>Attendees
            <input type="number" min={1} max={500} value={attendees}
              onChange={event => setAttendees(Math.max(1, Math.min(500, Number(event.target.value) || 1)))} style={inputStyle} />
          </label>
          <label style={labelStyle}>Average hourly cost ($)
            <input type="number" min={0} max={10000} value={hourlyCost}
              onChange={event => setHourlyCost(Math.max(0, Math.min(10000, Number(event.target.value) || 0)))} style={inputStyle} />
          </label>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', marginTop: '0.7rem' }}>
          The cost figure is a private on-screen estimate; inputs are not saved or sent anywhere.
        </p>
      </div>
    </div>
  )
}

const titleStyle = {
  width: 'min(100%, 680px)',
  textAlign: 'center',
  background: 'transparent',
  color: 'var(--text-primary)',
  border: 0,
  borderBottom: '1px solid var(--border)',
  fontSize: 'clamp(1.15rem, 4vw, 2rem)',
  fontWeight: 700,
  padding: '0.45rem',
} as const

const goalStyle = {
  width: 'min(100%, 680px)',
  textAlign: 'center',
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: 0,
  fontSize: 'clamp(0.85rem, 2vw, 1rem)',
  padding: '0.55rem',
} as const

const labelStyle = {
  display: 'grid',
  gap: '0.35rem',
  color: 'var(--text-secondary)',
  fontSize: '0.8rem',
} as const

const inputStyle = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: '0.45rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
} as const
