import type { SoundPack } from '@/hooks/usePreferences'

export const SOUND_PACKS: { value: SoundPack; label: string; emoji: string; group: string }[] = [
  { value: 'beep',      label: 'Simple Beep',       emoji: '🔔', group: 'Alerts' },
  { value: 'chime',     label: 'Classic Chime',     emoji: '🎐', group: 'Alerts' },
  { value: 'bell',      label: 'Desk Bell',         emoji: '🛎️', group: 'Alerts' },
  { value: 'digital',   label: 'Digital Alert',     emoji: '📟', group: 'Alerts' },
  { value: 'ding',      label: 'Gentle Ding',       emoji: '🔉', group: 'Alerts' },
  { value: 'telephone', label: 'Classic Telephone', emoji: '☎️', group: 'Ringtones' },
  { value: 'computer',  label: 'Computer Ring',     emoji: '💻', group: 'Ringtones' },
  { value: 'rain',      label: 'Rain on Window',    emoji: '🌧️', group: 'Nature' },
  { value: 'ocean',     label: 'Ocean Shore',       emoji: '🌊', group: 'Nature' },
  { value: 'jungle',    label: 'Jungle Morning',    emoji: '🌿', group: 'Nature' },
  { value: 'piano',     label: 'Peaceful Piano',    emoji: '🎹', group: 'Music' },
  { value: 'guitar',    label: 'Soft Guitar',       emoji: '🎸', group: 'Music' },
  { value: 'acoustic',  label: 'Acoustic Sunrise',  emoji: '🪕', group: 'Music' },
  { value: 'silent',    label: 'Silent',            emoji: '🔕', group: 'Other' },
  { value: 'custom',    label: 'Custom Upload',     emoji: '🎵', group: 'Other' },
]

const AUDIO_FILES: Partial<Record<SoundPack, string>> = {
  chime: '/audio/classic-chime.mp3',
  bell: '/audio/desk-bell.mp3',
  telephone: '/audio/classic-telephone.mp3',
  computer: '/audio/digital-computer.mp3',
  rain: '/audio/rain-window.mp3',
  ocean: '/audio/ocean-shore.mp3',
  jungle: '/audio/jungle-morning.mp3',
  piano: '/audio/peaceful-piano.mp3',
  guitar: '/audio/soft-guitar.mp3',
  acoustic: '/audio/acoustic-sunrise.mp3',
}

let ctx: AudioContext | null = null
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as any).webkitAudioContext)() } catch { return null }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
  return ctx
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0) {
  const c = getCtx(); if (!c) return
  const t0 = c.currentTime + delay
  const o = c.createOscillator(); const g = c.createGain()
  o.type = type; o.frequency.value = freq
  o.connect(g); g.connect(c.destination)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.start(t0); o.stop(t0 + dur + 0.05)
}

export interface PlayingSound { stop: () => void; audio?: HTMLAudioElement }

export function playSound(pack: SoundPack, volume: number, customUrl?: string, loop = false): PlayingSound {
  const silent: PlayingSound = { stop: () => {} }
  if (pack === 'silent' || typeof window === 'undefined') return silent
  const file = pack === 'custom' ? customUrl : AUDIO_FILES[pack]
  if (file) {
    try {
      const audio = new Audio(file)
      audio.volume = Math.max(0, Math.min(1, volume))
      audio.loop = loop
      audio.preload = 'auto'
      void audio.play().catch(() => {})
      return { audio, stop: () => { audio.pause(); audio.currentTime = 0 } }
    } catch { return silent }
  }
  const v = Math.max(0, Math.min(1, volume)) * 0.5
  switch (pack) {
    case 'beep': tone(880, 0.18, 'square', v); break
    case 'digital':
      tone(1200, 0.08, 'square', v); tone(1200, 0.08, 'square', v, 0.12); tone(1500, 0.16, 'square', v, 0.24); break
    case 'ding': tone(1568, 0.6, 'sine', v); break
  }
  return silent
}

let preview: PlayingSound | null = null
export function previewSound(pack: SoundPack, volume = 0.6, customUrl?: string) {
  preview?.stop()
  const isLong = ['rain','ocean','jungle','piano','guitar','acoustic'].includes(pack)
  preview = playSound(pack, volume, customUrl, false)
  if (isLong) window.setTimeout(() => { preview?.stop(); preview = null }, 12000)
}

export function stopPreviewSound() { preview?.stop(); preview = null }
