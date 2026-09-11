'use client'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { usePreferences, type SoundPack } from '@/hooks/usePreferences'
import { playSound, previewSound, stopPreviewSound, SOUND_PACKS, type PlayingSound } from '@/lib/sounds'

interface Alarm {
  id: string
  time: string // HH:MM
  label: string
  enabled: boolean
}

const STORE = 'zaynclock_alarms'

function chime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    ;[880, 660, 880].forEach((freq, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = freq
      o.type = 'sine'
      o.connect(g); g.connect(ctx.destination)
      const t = ctx.currentTime + i * 0.4
      g.gain.setValueAtTime(0.001, t)
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
      o.start(t); o.stop(t + 0.4)
    })
  } catch {}
}

export default function AlarmClient() {
  const {
    prefs,
    setSoundPack,
    toggleSound,
    setSoundVolume,
    setCustomSound,
  } = usePreferences()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [time, setTime] = useState('07:00')
  const [label, setLabel] = useState('')
  const [ringing, setRinging] = useState<string | null>(null)
  const lastFired = useRef<Record<string, string>>({})
  const ringingSound = useRef<PlayingSound | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORE)
    if (raw) try { setAlarms(JSON.parse(raw)) } catch {}
  }, [])
  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(alarms))
  }, [alarms])

  useEffect(() => () => stopPreviewSound(), [])

  // Tick: check every 5s
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      const hhmm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      const today = d.toDateString()
      for (const a of alarms) {
        if (!a.enabled || a.time !== hhmm) continue
        const k = `${a.id}|${today}|${hhmm}`
        if (lastFired.current[a.id] === k) continue
        lastFired.current[a.id] = k
        ringingSound.current?.stop()
        if (prefs.soundEnabled) ringingSound.current = playSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl, true)
        else chime()
        setRinging(a.id)
        try { new Notification(`⏰ ${a.label || 'Alarm'}`, { body: hhmm }) } catch {}
      }
    }, 5000)
    return () => clearInterval(id)
  }, [alarms, prefs.soundEnabled, prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl])

  const add = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission().catch(() => {})
    if (!time) return
    setAlarms(p => [...p, { id: Math.random().toString(36).slice(2), time, label, enabled: true }])
    setLabel('')
  }
  const toggle = (id: string) => setAlarms(p => p.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  const remove = (id: string) => setAlarms(p => p.filter(a => a.id !== id))
  const dismiss = () => { ringingSound.current?.stop(); ringingSound.current = null; setRinging(null) }
  const snooze = (id: string) => {
    const a = alarms.find(x => x.id === id)
    if (!a) return
    const d = new Date(Date.now() + 5 * 60_000)
    const t = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    setAlarms(p => p.map(x => x.id === id ? { ...x, time: t } : x))
    ringingSound.current?.stop()
    ringingSound.current = null
    setRinging(null)
  }
  const onSoundFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('audio/')) return

    const reader = new FileReader()
    reader.onload = () => setCustomSound(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div>
      {ringing && (() => {
        const a = alarms.find(x => x.id === ringing)
        if (!a) return null
        return (
          <div className="card" style={{ borderColor: 'var(--accent)', boxShadow: 'var(--glow)', marginBottom: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>⏰ {a.time}</div>
            <div style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{a.label || 'Alarm'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <button className="btn-primary" onClick={() => snooze(a.id)}>Snooze 5m</button>
              <button className="btn-ghost" onClick={dismiss}>Dismiss</button>
            </div>
          </div>
        )
      })()}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>New alarm</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '0.5rem' }}>
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.4rem', padding: '0.5rem 0.6rem', color: 'var(--text-primary)' }} />
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (optional)"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.4rem', padding: '0.5rem 0.6rem', color: 'var(--text-primary)' }} />
          <button className="btn-primary" onClick={add}>Add</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(255,255,255,0.03))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Alarm sound</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
              Choose a built-in tone or upload your own audio file. Custom sounds stay on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={prefs.soundEnabled}
            className={prefs.soundEnabled ? 'btn-primary' : 'btn-ghost'}
            style={{ whiteSpace: 'nowrap', padding: '0.5rem 0.8rem' }}
          >
            {prefs.soundEnabled ? 'Sound on' : 'Sound off'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '0.6rem', alignItems: 'center', marginBottom: '0.8rem' }}>
          <select
            value={prefs.soundPack}
            onChange={e => setSoundPack(e.target.value as SoundPack)}
            aria-label="Alarm sound"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '0.55rem', padding: '0.62rem 0.7rem', color: 'var(--text-primary)', width: '100%' }}
          >
            {SOUND_PACKS.map(sound => (
              <option key={sound.value} value={sound.value}>{sound.emoji} {sound.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => previewSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)}
            style={{ padding: '0.58rem 0.85rem' }}
          >
            Test
          </button>
        </div>

        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          Volume: {Math.round(prefs.soundVolume * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={prefs.soundVolume}
          onChange={e => setSoundVolume(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '0.8rem' }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', alignItems: 'center' }}>
          <button type="button" className="btn-ghost" onClick={() => fileRef.current?.click()}>
            Upload custom sound
          </button>
          <input ref={fileRef} type="file" accept="audio/*" onChange={onSoundFile} style={{ display: 'none' }} />
          {prefs.customSoundDataUrl && (
            <>
              <span style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>Custom sound selected</span>
              <button type="button" className="btn-ghost" onClick={() => setCustomSound(undefined)}>
                Remove
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {alarms.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No alarms yet.</p>}
        {alarms.map(a => (
          <div key={a.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: a.enabled ? 'var(--accent)' : 'var(--text-secondary)', minWidth: 80 }}>{a.time}</span>
            <span style={{ flex: 1, color: 'var(--text-primary)' }}>{a.label || 'Alarm'}</span>
            <button onClick={() => toggle(a.id)} aria-label="Toggle"
              style={{ width: 44, height: 24, borderRadius: 12, background: a.enabled ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 2, left: a.enabled ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
            </button>
            <button className="btn-ghost" onClick={() => remove(a.id)} aria-label="Delete">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
