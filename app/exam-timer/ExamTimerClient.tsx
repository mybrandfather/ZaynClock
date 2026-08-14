'use client'

import { useEffect, useRef, useState } from 'react'
import FullscreenButton from '@/components/features/FullscreenButton'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound } from '@/lib/sounds'

type Phase = 'ready' | 'reading' | 'exam' | 'paused' | 'finished'

function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.ceil(seconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatClock(date: Date) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date)
}

export default function ExamTimerClient() {
  const { prefs } = usePreferences()
  const [title, setTitle] = useState('Exam')
  const [examMinutes, setExamMinutes] = useState(60)
  const [readingMinutes, setReadingMinutes] = useState(5)
  const [instructions, setInstructions] = useState('Read every question carefully. Raise your hand if you need help.')
  const [phase, setPhase] = useState<Phase>('ready')
  const [activePhase, setActivePhase] = useState<'reading' | 'exam'>('exam')
  const [endAt, setEndAt] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(examMinutes * 60)
  const [finishAt, setFinishAt] = useState<Date | null>(null)
  const transitioned = useRef(false)
  const pausedAt = useRef<number | null>(null)

  const sound = () => {
    if (prefs.soundEnabled) {
      playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)
    }
  }

  useEffect(() => {
    if (!endAt || phase === 'paused') return

    const tick = () => {
      const next = Math.max(0, (endAt - Date.now()) / 1000)
      setRemaining(next)
      if (next > 0 || transitioned.current) return

      transitioned.current = true
      sound()

      if (activePhase === 'reading') {
        setActivePhase('exam')
        setPhase('exam')
        setRemaining(examMinutes * 60)
        setEndAt(Date.now() + examMinutes * 60_000)
        window.setTimeout(() => { transitioned.current = false }, 50)
      } else {
        setEndAt(null)
        setPhase('finished')
        try { new Notification(`${title || 'Exam'} time is finished`) } catch {}
      }
    }

    tick()
    const timer = window.setInterval(tick, 200)
    return () => window.clearInterval(timer)
  }, [endAt, phase, activePhase, examMinutes, title, prefs.soundEnabled, prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl])

  useEffect(() => {
    if (phase === 'ready') setRemaining(examMinutes * 60)
  }, [examMinutes, phase])

  const start = () => {
    const hasReading = readingMinutes > 0
    const firstPhase = hasReading ? 'reading' : 'exam'
    const firstSeconds = (hasReading ? readingMinutes : examMinutes) * 60
    transitioned.current = false
    setActivePhase(firstPhase)
    setPhase(firstPhase)
    setRemaining(firstSeconds)
    setEndAt(Date.now() + firstSeconds * 1000)
    setFinishAt(new Date(Date.now() + (readingMinutes + examMinutes) * 60_000))
  }

  const pause = () => {
    if (!endAt) return
    setRemaining(Math.max(0, (endAt - Date.now()) / 1000))
    setEndAt(null)
    pausedAt.current = Date.now()
    setPhase('paused')
  }

  const resume = () => {
    transitioned.current = false
    setPhase(activePhase)
    setEndAt(Date.now() + remaining * 1000)
    if (finishAt && pausedAt.current) {
      setFinishAt(new Date(finishAt.getTime() + (Date.now() - pausedAt.current)))
    }
    pausedAt.current = null
  }

  const reset = () => {
    transitioned.current = false
    setPhase('ready')
    setActivePhase('exam')
    setEndAt(null)
    setFinishAt(null)
    pausedAt.current = null
    setRemaining(examMinutes * 60)
  }

  const addFive = () => {
    setRemaining(value => value + 300)
    if (endAt) setEndAt(value => value ? value + 300_000 : value)
    if (finishAt) setFinishAt(new Date(finishAt.getTime() + 300_000))
  }

  const warning = activePhase === 'exam' && remaining <= 5 * 60 && phase !== 'ready' && phase !== 'finished'
  const phaseLabel = phase === 'reading'
    ? 'Reading time'
    : phase === 'paused'
      ? `${activePhase === 'reading' ? 'Reading' : 'Exam'} paused`
      : phase === 'finished'
        ? 'Time is up'
        : 'Exam time'

  return (
    <div id="exam-timer-screen" style={{
      background: 'var(--bg-primary)',
      borderRadius: '1rem',
      padding: 'clamp(1rem, 3vw, 2rem)',
      minHeight: 'min(78vh, 780px)',
    }}>
      {phase === 'ready' ? (
        <div className="card" style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Set up the exam clock</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Exam title
              <input value={title} maxLength={70} onChange={event => setTitle(event.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Exam length (minutes)
              <input type="number" min={1} max={480} value={examMinutes}
                onChange={event => setExamMinutes(Math.max(1, Math.min(480, Number(event.target.value) || 1)))} style={inputStyle} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Reading time (minutes)
              <input type="number" min={0} max={60} value={readingMinutes}
                onChange={event => setReadingMinutes(Math.max(0, Math.min(60, Number(event.target.value) || 0)))} style={inputStyle} />
            </label>
          </div>
          <label style={{ display: 'grid', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Instructions shown below the clock
            <textarea rows={3} value={instructions} maxLength={260} onChange={event => setInstructions(event.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </label>

          <div style={{ marginTop: '1.2rem', padding: '0.9rem', borderRadius: '0.65rem', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Starting now, reading begins at <strong style={{ color: 'var(--text-primary)' }}>{formatClock(new Date())}</strong>
            {' '}and the exam finishes at{' '}
            <strong style={{ color: 'var(--accent)' }}>{formatClock(new Date(Date.now() + (readingMinutes + examMinutes) * 60_000))}</strong>.
          </div>

          <button className="btn-primary" onClick={start} style={{ marginTop: '1.2rem', width: '100%', padding: '0.8rem' }}>
            Start exam timer
          </button>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', minHeight: 'min(70vh, 680px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {phaseLabel}
          </p>
          <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 2.2rem)', margin: '0.45rem 0' }}>{title || 'Exam'}</h2>

          <div role="timer" aria-live={phase === 'finished' ? 'assertive' : 'off'} style={{
            fontFamily: 'var(--font-display)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'clamp(3.25rem, 15vw, 9rem)',
            lineHeight: 1,
            margin: '1.1rem 0',
            color: phase === 'finished' ? 'var(--accent2)' : warning ? '#ef4444' : 'var(--accent)',
            textShadow: warning || phase === 'finished' ? '0 0 35px currentColor' : 'var(--glow)',
          }}>
            {phase === 'finished' ? 'FINISHED' : formatDuration(remaining)}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1rem, 6vw, 4rem)', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Current time</div>
              <strong style={{ fontSize: 'clamp(1.1rem, 3vw, 1.55rem)' }}>{formatClock(new Date())}</strong>
            </div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', textTransform: 'uppercase' }}>Finish time</div>
              <strong style={{ color: 'var(--accent)', fontSize: 'clamp(1.1rem, 3vw, 1.55rem)' }}>
                {finishAt ? formatClock(finishAt) : '—'}
              </strong>
            </div>
          </div>

          {instructions && (
            <p style={{ maxWidth: 760, margin: '0 auto 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)' }}>
              {instructions}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            {(phase === 'reading' || phase === 'exam') && <button className="btn-primary" onClick={pause}>⏸ Pause</button>}
            {phase === 'paused' && <button className="btn-primary" onClick={resume}>▶ Resume</button>}
            {phase !== 'finished' && <button className="btn-ghost" onClick={addFive}>+5 minutes</button>}
            <button className="btn-ghost" onClick={reset}>↺ End / reset</button>
            <FullscreenButton targetId="exam-timer-screen" />
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.7rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
} as const
