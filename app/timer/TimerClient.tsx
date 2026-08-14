'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import FullscreenButton from '@/components/features/FullscreenButton'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound } from '@/lib/sounds'

function format(ms: number) {
  if (ms < 0) ms = 0
  const total = Math.ceil(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const PRESETS = [
  { label: '1 min', s: 60 },
  { label: '3 min', s: 180 },
  { label: '5 min', s: 300 },
  { label: '10 min', s: 600 },
  { label: '15 min', s: 900 },
  { label: '25 min', s: 1500 },
  { label: '45 min', s: 2700 },
  { label: '1 hour', s: 3600 },
]

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = 880
    o.type = 'sine'
    g.gain.value = 0.001
    o.connect(g); g.connect(ctx.destination)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4)
    o.stop(ctx.currentTime + 1.5)
  } catch {}
}

export default function TimerClient() {
  const { prefs } = usePreferences()
  const searchParams = useSearchParams()
  const [h, setH] = useState(0)
  const [m, setM] = useState(5)
  const [s, setS] = useState(0)
  const [endAt, setEndAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [paused, setPaused] = useState(false)
  const [pausedRemaining, setPausedRemaining] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoStarted = useRef(false)

  const totalMs = (h * 3600 + m * 60 + s) * 1000
  const running = endAt !== null && !paused

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const left = endAt! - Date.now()
      setRemaining(left)
      if (left <= 0) {
        if (prefs.soundEnabled) playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)
        try { new Notification('Timer done!') } catch {}
        setEndAt(null)
        setPausedRemaining(null)
      }
    }, 100)
    return () => clearInterval(id)
  }, [running, endAt, prefs.soundEnabled, prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl])

  // Auto-start from ?m=N query param (e.g. from homepage preset cards)
  useEffect(() => {
    if (autoStarted.current) return
    const mParam = searchParams?.get('m')
    if (!mParam) return
    const minutes = parseInt(mParam, 10)
    if (!isNaN(minutes) && minutes > 0) {
      autoStarted.current = true
      const sec = minutes * 60
      setH(Math.floor(sec / 3600))
      setM(Math.floor((sec % 3600) / 60))
      setS(sec % 60)
      setEndAt(Date.now() + sec * 1000)
      setRemaining(sec * 1000)
      setPaused(false)
      setPausedRemaining(null)
    }
  }, [searchParams])

  const requestNotifications = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission().catch(() => {})
  }
  const start = () => {
    requestNotifications()
    const ms = pausedRemaining ?? totalMs
    if (ms <= 0) return
    setEndAt(Date.now() + ms)
    setRemaining(ms)
    setPaused(false)
    setPausedRemaining(null)
  }
  const pause = () => {
    if (endAt) {
      setPausedRemaining(endAt - Date.now())
      setPaused(true)
      setEndAt(null)
    }
  }
  const reset = () => {
    setEndAt(null)
    setPaused(false)
    setPausedRemaining(null)
    setRemaining(totalMs)
  }
  const applyPreset = (sec: number) => {
    requestNotifications()
    setH(Math.floor(sec / 3600))
    setM(Math.floor((sec % 3600) / 60))
    setS(sec % 60)
    setEndAt(Date.now() + sec * 1000)
    setRemaining(sec * 1000)
    setPaused(false)
    setPausedRemaining(null)
  }

  const display = running ? remaining : (pausedRemaining ?? totalMs)

  return (
    <div ref={containerRef} id="timer-fs" style={{ background: 'var(--bg-primary)' }}>
      <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem 1rem' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 14vw, 7rem)',
          color: display <= 5000 && running ? '#ef4444' : 'var(--accent)',
          textShadow: 'var(--glow)',
          lineHeight: 1,
        }}>{format(display)}</div>
        <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {!running && !paused && <button className="btn-primary" onClick={start}>▶ Start</button>}
          {running && <button className="btn-primary" onClick={pause}>⏸ Pause</button>}
          {paused && <button className="btn-primary" onClick={start}>▶ Resume</button>}
          <button className="btn-ghost" onClick={reset}>↺ Reset</button>
          <FullscreenButton targetId="timer-fs" />
        </div>
      </div>

      {!running && !paused && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>Set duration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Hours', val: h, set: setH, max: 23 },
              { label: 'Minutes', val: m, set: setM, max: 59 },
              { label: 'Seconds', val: s, set: setS, max: 59 },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input type="number" min={0} max={f.max} value={f.val}
                  onChange={e => f.set(Math.max(0, Math.min(f.max, Number(e.target.value) || 0)))}
                  style={{
                    width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    borderRadius: '0.4rem', padding: '0.5rem 0.6rem', color: 'var(--text-primary)', fontSize: '1rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button key={p.label} className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }} onClick={() => applyPreset(p.s)}>{p.label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
