'use client'
import { useEffect, useRef, useState } from 'react'
import FullscreenButton from '@/components/features/FullscreenButton'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound } from '@/lib/sounds'

const PRESETS = [25, 50, 90]

function chime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const o = ctx.createOscillator(); const g = ctx.createGain()
    o.frequency.value = 528; o.type = 'sine'
    o.connect(g); g.connect(ctx.destination)
    g.gain.value = 0.0001
    g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.1)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5)
    o.start(); o.stop(ctx.currentTime + 2.6)
  } catch {}
}

interface Session { id: string; minutes: number; date: string }
const STORE = 'zaynclock_study_sessions'

function fmt(ms: number) {
  if (ms < 0) ms = 0
  const total = Math.ceil(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function StudyClockClient() {
  const { prefs } = usePreferences()
  const [minutes, setMinutes] = useState(25)
  const [endAt, setEndAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(25 * 60_000)
  const [minimal, setMinimal] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const completed = useRef(false)

  useEffect(() => {
    const raw = localStorage.getItem(STORE)
    if (raw) try { setSessions(JSON.parse(raw)) } catch {}
  }, [])

  useEffect(() => {
    if (!endAt) return
    completed.current = false
    const id = setInterval(() => {
      const left = endAt - Date.now()
      setRemaining(left)
      if (left <= 0 && !completed.current) {
        completed.current = true
        if (prefs.soundEnabled) playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl); else chime()
        const ses: Session = { id: Math.random().toString(36).slice(2), minutes, date: new Date().toISOString() }
        setSessions(p => {
          const next = [ses, ...p].slice(0, 100)
          localStorage.setItem(STORE, JSON.stringify(next))
          return next
        })
        try { new Notification(`${minutes}-minute session complete`) } catch {}
        setEndAt(null)
      }
    }, 200)
    return () => clearInterval(id)
  }, [endAt, minutes])

  useEffect(() => {
    if (!endAt) setRemaining(minutes * 60_000)
  }, [minutes, endAt])

  const start = () => setEndAt(Date.now() + minutes * 60_000)
  const stop = () => { setEndAt(null); setRemaining(minutes * 60_000) }

  const total = minutes * 60_000
  const pct = endAt ? Math.max(0, Math.min(1, remaining / total)) : 1
  const todayMins = sessions.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).reduce((a, b) => a + b.minutes, 0)
  const allMins = sessions.reduce((a, b) => a + b.minutes, 0)

  const radius = 120
  const c = 2 * Math.PI * radius

  return (
    <div id="study-fs" style={{ background: 'var(--bg-primary)' }}>
      <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
          <svg width="280" height="280" viewBox="0 0 280 280">
            <circle cx="140" cy="140" r={radius} stroke="var(--border)" strokeWidth="10" fill="none" />
            <circle cx="140" cy="140" r={radius} stroke="var(--accent)" strokeWidth="10" fill="none"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" transform="rotate(-90 140 140)"
              style={{ transition: 'stroke-dashoffset 0.3s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', color: 'var(--accent)' }}>{fmt(endAt ? remaining : minutes * 60_000)}</div>
            {!minimal && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{minutes}-minute session</div>}
          </div>
        </div>
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {!endAt && <button className="btn-primary" onClick={start}>▶ Start</button>}
          {endAt && <button className="btn-primary" onClick={stop}>⏹ Stop</button>}
          <button className="btn-ghost" onClick={() => setMinimal(m => !m)}>{minimal ? 'Show details' : 'Minimal mode'}</button>
          <FullscreenButton targetId="study-fs" />
        </div>
      </div>

      {!minimal && (
        <>
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Length</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PRESETS.map(p => (
                <button key={p} onClick={() => setMinutes(p)} style={{
                  flex: '1 1 0', minWidth: 90, padding: '0.6rem',
                  borderRadius: '0.5rem', border: '1px solid',
                  borderColor: minutes === p ? 'var(--accent)' : 'var(--border)',
                  background: minutes === p ? 'var(--accent)' : 'transparent',
                  color: minutes === p ? 'var(--bg-primary)' : 'var(--text-primary)',
                  fontWeight: 700, cursor: 'pointer',
                }}>{p} min</button>
              ))}
              <input type="number" min={1} max={240} value={minutes} onChange={e => setMinutes(Math.max(1, Math.min(240, Number(e.target.value) || 1)))}
                style={{ width: 90, background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.4rem', padding: '0.5rem 0.6rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem' }}>Session history</h3>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' }}>
              <div><div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: '1.4rem' }}>{todayMins}</div><div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>min today</div></div>
              <div><div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: '1.4rem' }}>{allMins}</div><div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>min all-time</div></div>
              <div><div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: '1.4rem' }}>{sessions.length}</div><div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>sessions</div></div>
            </div>
            {sessions.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your first session will appear here.</p>}
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {sessions.slice(0, 12).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <span>{s.minutes} min</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{new Date(s.date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
