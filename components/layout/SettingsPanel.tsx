'use client'

import { useRef } from 'react'
import { usePreferences, ACCENTS, CLOCK_FONTS, COLOR_THEMES } from '@/hooks/usePreferences'
import type { ClockType } from '@/hooks/usePreferences'
import { ALL_TIMEZONES } from '@/lib/utils'
import { SOUND_PACKS, previewSound } from '@/lib/sounds'

export default function SettingsPanel({ onClose }: { onClose?: () => void }) {
  const {
    prefs, setTimeFormat, toggleSeconds, setColorAccent, setTimezone,
    setClockType, setClockFont, setSoundPack, toggleSound, setSoundVolume,
    setCustomSound, setTheme, setTempUnit, setFullscreenWeather,
  } = usePreferences()
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => setCustomSound(String(reader.result))
    reader.readAsDataURL(f)
  }

  return (
    <div style={{
      width: 320, maxHeight: '78vh', overflowY: 'auto',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: '0.95rem' }}>⚙️ Settings</strong>
        {onClose && <button onClick={onClose} className="btn-ghost" style={{ padding: '0.2rem 0.5rem', fontSize: '0.85rem' }} aria-label="Close">✕</button>}
      </div>

      {/* Color theme */}
      <div>
        <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Color theme</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
          {COLOR_THEMES.map(t => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              title={t.label}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                padding: '0.4rem 0.2rem',
                borderRadius: '0.5rem',
                border: '2px solid',
                borderColor: prefs.theme === t.value ? 'var(--accent)' : 'var(--border)',
                background: prefs.theme === t.value ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{
                display: 'block',
                width: 28, height: 28,
                borderRadius: '50%',
                background: t.preview,
                border: '2px solid rgba(128,128,128,0.3)',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: 1.2, textAlign: 'center' }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Clock style */}
      <Row label="Main clock style">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          {([
            { value: 'neon3d', label: 'Neon 3D', icon: '✨' },
            { value: 'orbit', label: 'Orbit Dial', icon: '🛰️' },
            { value: 'slide', label: 'Slide Clock', icon: '↕️' },
            { value: 'bouncy', label: 'Bouncy Blocks', icon: '🟦' },
            { value: 'modernAnalog', label: 'Modern Analog', icon: '⌚' },
            { value: 'digital', label: 'Classic Digital', icon: '🔢' },
            { value: 'analog', label: 'Classic Analog', icon: '🕐' },
          ] as { value: ClockType; label: string; icon: string }[]).map(option => (
            <button
              key={option.value}
              onClick={() => setClockType(option.value)}
              aria-pressed={prefs.clockType === option.value}
              style={{
                padding: '0.55rem 0.4rem', borderRadius: '0.45rem', border: '1px solid',
                borderColor: prefs.clockType === option.value ? 'var(--accent)' : 'var(--border)',
                background: prefs.clockType === option.value ? 'color-mix(in srgb, var(--accent) 14%, transparent)' : 'transparent',
                color: prefs.clockType === option.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.76rem', cursor: 'pointer',
              }}
            >
              <span aria-hidden="true" style={{ marginRight: '0.25rem' }}>{option.icon}</span>{option.label}
            </button>
          ))}
        </div>
      </Row>

      {/* Time format */}
      <Row label="Time Format">
        <Toggle a="12h" b="24h" active={prefs.timeFormat} onA={() => setTimeFormat('12h')} onB={() => setTimeFormat('24h')} valA="12h" valB="24h" />
      </Row>

      {/* Show seconds */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem' }}>Show seconds</span>
        <Switch on={prefs.showSeconds} onClick={toggleSeconds} />
      </div>

      {/* Fullscreen weather */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem' }}>Show weather in fullscreen</span>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 1 }}>Displays live weather when in fullscreen</div>
        </div>
        <Switch on={prefs.fullscreenWeather} onClick={() => setFullscreenWeather(!prefs.fullscreenWeather)} />
      </div>

      {/* Accent color */}
      <Row label="Accent color">
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {ACCENTS.map(a => (
            <button key={a.value} onClick={() => setColorAccent(a.value)} title={a.label}
              style={{
                width: 26, height: 26, borderRadius: '50%', background: a.color,
                border: '2px solid', borderColor: prefs.colorAccent === a.value ? 'var(--text-primary)' : 'transparent',
                cursor: 'pointer', transform: prefs.colorAccent === a.value ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.15s',
              }} />
          ))}
        </div>
      </Row>

      {/* Clock font */}
      <Row label="Clock font">
        <select value={prefs.clockFont} onChange={e => setClockFont(e.target.value as any)}
          style={selStyle}>
          {CLOCK_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </Row>

      {/* Temperature unit */}
      <Row label="Temperature unit">
        <Toggle a="°C" b="°F" active={prefs.tempUnit} onA={() => setTempUnit('C')} onB={() => setTempUnit('F')} valA="C" valB="F" />
      </Row>

      {/* Timezone */}
      <Row label="Timezone">
        <select value={prefs.timezone} onChange={e => setTimezone(e.target.value)} style={selStyle}>
          {(ALL_TIMEZONES as string[]).map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
        </select>
      </Row>

      {/* Sound */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>🔊 Sounds</span>
          <Switch on={prefs.soundEnabled} onClick={toggleSound} />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <select value={prefs.soundPack} onChange={e => setSoundPack(e.target.value as any)} style={{ ...selStyle, flex: 1 }}>
            {SOUND_PACKS.map(s => <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>)}
          </select>
          <button className="btn-ghost" style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => previewSound(prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl)}>▶ Test</button>
        </div>
        <div style={{ fontSize: '0.7rem', lineHeight: 1.4, color: 'var(--text-secondary)' }}>
          Nature and music previews stop after 12 seconds. All built-in recordings are original ZaynClock audio and safe for commercial use.
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Volume</label>
          <input type="range" min={0} max={1} step={0.05} value={prefs.soundVolume}
            onChange={e => setSoundVolume(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div>
          <button className="btn-ghost" style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}
            onClick={() => fileRef.current?.click()}>📁 Upload custom sound</button>
          <input ref={fileRef} type="file" accept="audio/*" onChange={onFile} style={{ display: 'none' }} />
          {prefs.customSoundDataUrl && (
            <button onClick={() => setCustomSound(undefined)} className="btn-ghost" style={{ width: '100%', marginTop: '0.3rem', fontSize: '0.75rem', padding: '0.3rem' }}>Remove custom sound</button>
          )}
        </div>
      </div>
    </div>
  )
}

const selStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-primary)', color: 'var(--text-primary)',
  border: '1px solid var(--border)', borderRadius: '0.4rem',
  padding: '0.4rem 0.5rem', fontSize: '0.8rem',
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
      {children}
    </div>
  )
}

function Toggle<T extends string>({ a, b, valA, valB, active, onA, onB }: { a: string; b: string; valA: T; valB: T; active: T; onA: () => void; onB: () => void }) {
  const opt = (label: string, val: T, on: () => void) => (
    <button onClick={on} style={{
      flex: 1, padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid',
      borderColor: active === val ? 'var(--accent)' : 'var(--border)',
      background: active === val ? 'var(--accent)' : 'transparent',
      color: active === val ? 'var(--bg-primary)' : 'var(--text-secondary)',
      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
    }}>{label}</button>
  )
  return <div style={{ display: 'flex', gap: '0.4rem' }}>{opt(a, valA, onA)}{opt(b, valB, onB)}</div>
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={on} style={{
      width: 44, height: 24, borderRadius: 12, position: 'relative',
      background: on ? 'var(--accent)' : 'var(--border)', border: 'none', cursor: 'pointer', transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 22 : 2, width: 20, height: 20,
        borderRadius: '50%', background: 'white', transition: 'left 0.2s',
      }} />
    </button>
  )
}
