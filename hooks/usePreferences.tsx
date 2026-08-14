'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getBrowserTimeZone, getSafeTimeZone } from '@/lib/timezone'

export type Theme =
  | 'dark'
  | 'light'
  | 'midnight'
  | 'slate'
  | 'ocean'
  | 'forest'
  | 'sepia'

export type ColorAccent = 'cyan' | 'amber' | 'green' | 'purple' | 'pink' | 'red' | 'blue' | 'lime'
export type TimeFormat = '12h' | '24h'
export type ClockType = 'neon3d' | 'digital' | 'analog' | 'orbit' | 'slide' | 'bouncy' | 'modernAnalog'
export type ClockFont = 'orbitron' | 'jetbrains' | 'major' | 'share' | 'vt323' | 'audiowide' | 'outfit'
export type SoundPack = 'beep' | 'chime' | 'bell' | 'digital' | 'ding' | 'telephone' | 'computer' | 'rain' | 'ocean' | 'jungle' | 'piano' | 'guitar' | 'acoustic' | 'silent' | 'custom'
export type TempUnit = 'C' | 'F'

export const COLOR_THEMES: {
  value: Theme
  label: string
  preview: string
  isLight: boolean
  vars: Record<string, string>
}[] = [
  {
    value: 'dark',
    label: 'Dark',
    preview: '#0a0a0f',
    isLight: false,
    vars: {
      '--bg-primary':   '#0a0a0f',
      '--bg-secondary': '#111118',
      '--bg-card':      '#16161f',
      '--border':       'rgba(255,255,255,0.071)',
      '--text-primary': '#f0f0ff',
      '--text-secondary': '#8888aa',
    },
  },
  {
    value: 'light',
    label: 'Light',
    preview: '#f8f8ff',
    isLight: true,
    vars: {
      '--bg-primary':   '#f8f8ff',
      '--bg-secondary': '#ededf8',
      '--bg-card':      '#ffffff',
      '--border':       'rgba(0,0,0,0.071)',
      '--text-primary': '#0a0a1a',
      '--text-secondary': '#555577',
    },
  },
  {
    value: 'midnight',
    label: 'Midnight',
    preview: '#000000',
    isLight: false,
    vars: {
      '--bg-primary':   '#000000',
      '--bg-secondary': '#0a0a0a',
      '--bg-card':      '#111111',
      '--border':       'rgba(255,255,255,0.1)',
      '--text-primary': '#ffffff',
      '--text-secondary': '#999999',
    },
  },
  {
    value: 'slate',
    label: 'Slate Gray',
    preview: '#1e2532',
    isLight: false,
    vars: {
      '--bg-primary':   '#1e2532',
      '--bg-secondary': '#252d3d',
      '--bg-card':      '#2d3748',
      '--border':       'rgba(255,255,255,0.09)',
      '--text-primary': '#e2e8f0',
      '--text-secondary': '#a0aec0',
    },
  },
  {
    value: 'ocean',
    label: 'Ocean Blue',
    preview: '#0a1628',
    isLight: false,
    vars: {
      '--bg-primary':   '#0a1628',
      '--bg-secondary': '#0f2040',
      '--bg-card':      '#162a52',
      '--border':       'rgba(255,255,255,0.09)',
      '--text-primary': '#e0f0ff',
      '--text-secondary': '#7fb3d3',
    },
  },
  {
    value: 'forest',
    label: 'Forest',
    preview: '#0d1f12',
    isLight: false,
    vars: {
      '--bg-primary':   '#0d1f12',
      '--bg-secondary': '#132a19',
      '--bg-card':      '#1a3622',
      '--border':       'rgba(255,255,255,0.09)',
      '--text-primary': '#d4f4dd',
      '--text-secondary': '#6db285',
    },
  },
  {
    value: 'sepia',
    label: 'Sepia',
    preview: '#fdf6e3',
    isLight: true,
    vars: {
      '--bg-primary':   '#fdf6e3',
      '--bg-secondary': '#f5ead0',
      '--bg-card':      '#fffbf0',
      '--border':       'rgba(0,0,0,0.1)',
      '--text-primary': '#3d2b1f',
      '--text-secondary': '#7c5c47',
    },
  },
]

export const ACCENTS: { value: ColorAccent; label: string; color: string; glow: string }[] = [
  { value: 'cyan',   label: 'Cyan',   color: '#00d4ff', glow: 'rgba(0,212,255,0.3)' },
  { value: 'amber',  label: 'Amber',  color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  { value: 'green',  label: 'Green',  color: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
  { value: 'purple', label: 'Purple', color: '#a855f7', glow: 'rgba(168,85,247,0.3)' },
  { value: 'pink',   label: 'Pink',   color: '#ec4899', glow: 'rgba(236,72,153,0.3)' },
  { value: 'red',    label: 'Red',    color: '#ef4444', glow: 'rgba(239,68,68,0.3)' },
  { value: 'blue',   label: 'Blue',   color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
  { value: 'lime',   label: 'Lime',   color: '#84cc16', glow: 'rgba(132,204,22,0.3)' },
]

export const CLOCK_FONTS: { value: ClockFont; label: string; css: string }[] = [
  { value: 'orbitron',  label: 'Orbitron (Sci-Fi)',      css: 'var(--font-orbitron), monospace' },
  { value: 'jetbrains', label: 'JetBrains Mono',         css: 'var(--font-jetbrains), monospace' },
  { value: 'major',     label: 'Major Mono',             css: 'var(--font-major), monospace' },
  { value: 'share',     label: 'Share Tech Mono',        css: 'var(--font-share), monospace' },
  { value: 'vt323',     label: 'VT323 (Retro Terminal)', css: 'var(--font-vt323), monospace' },
  { value: 'audiowide', label: 'Audiowide (Bold)',       css: 'var(--font-audiowide), sans-serif' },
  { value: 'outfit',    label: 'Outfit (Modern)',        css: 'var(--font-body), sans-serif' },
]

export interface Preferences {
  timeFormat: TimeFormat
  theme: Theme
  showSeconds: boolean
  colorAccent: ColorAccent
  timezone: string
  clockType: ClockType
  clockFont: ClockFont
  soundPack: SoundPack
  soundEnabled: boolean
  soundVolume: number
  customSoundDataUrl?: string
  tempUnit: TempUnit
  fullscreenWeather: boolean
}

interface PreferencesContextType {
  prefs: Preferences
  setTimeFormat: (f: TimeFormat) => void
  setTheme: (t: Theme) => void
  toggleSeconds: () => void
  setColorAccent: (c: ColorAccent) => void
  setTimezone: (tz: string) => void
  setClockType: (t: ClockType) => void
  setClockFont: (f: ClockFont) => void
  setSoundPack: (s: SoundPack) => void
  toggleSound: () => void
  setSoundVolume: (v: number) => void
  setCustomSound: (url: string | undefined) => void
  setTempUnit: (u: TempUnit) => void
  setFullscreenWeather: (v: boolean) => void
}

const defaults: Preferences = {
  timeFormat: '12h',
  theme: 'dark',
  showSeconds: true,
  colorAccent: 'cyan',
  timezone: 'UTC',
  clockType: 'neon3d',
  clockFont: 'orbitron',
  soundPack: 'chime',
  soundEnabled: true,
  soundVolume: 0.6,
  tempUnit: 'C',
  fullscreenWeather: true,
}

const PreferencesContext = createContext<PreferencesContextType | null>(null)

const THEMES = new Set<Theme>(COLOR_THEMES.map(theme => theme.value))
const ACCENT_VALUES = new Set<ColorAccent>(ACCENTS.map(accent => accent.value))
const FONT_VALUES = new Set<ClockFont>(CLOCK_FONTS.map(font => font.value))
const CLOCK_TYPES = new Set<ClockType>(['neon3d', 'digital', 'analog', 'orbit', 'slide', 'bouncy', 'modernAnalog'])
const TIME_FORMATS = new Set<TimeFormat>(['12h', '24h'])
const SOUND_PACKS = new Set<SoundPack>(['beep', 'chime', 'bell', 'digital', 'ding', 'telephone', 'computer', 'rain', 'ocean', 'jungle', 'piano', 'guitar', 'acoustic', 'silent', 'custom'])
const TEMP_UNITS = new Set<TempUnit>(['C', 'F'])

function sanitizePreferences(value: unknown): Preferences {
  const input = value && typeof value === 'object' ? value as Partial<Preferences> : {}
  const rawClockType = value && typeof value === 'object'
    ? (value as Record<string, unknown>).clockType
    : undefined
  const browserTimeZone = typeof window === 'undefined' ? 'UTC' : getBrowserTimeZone()
  const migratedClockType: ClockType | undefined = rawClockType === '3d'
    ? 'neon3d'
    : typeof rawClockType === 'string' && CLOCK_TYPES.has(rawClockType as ClockType)
      ? rawClockType as ClockType
      : undefined

  return {
    timeFormat: TIME_FORMATS.has(input.timeFormat as TimeFormat) ? input.timeFormat as TimeFormat : defaults.timeFormat,
    theme: THEMES.has(input.theme as Theme) ? input.theme as Theme : defaults.theme,
    showSeconds: typeof input.showSeconds === 'boolean' ? input.showSeconds : defaults.showSeconds,
    colorAccent: ACCENT_VALUES.has(input.colorAccent as ColorAccent) ? input.colorAccent as ColorAccent : defaults.colorAccent,
    timezone: getSafeTimeZone(input.timezone, browserTimeZone),
    clockType: migratedClockType ?? defaults.clockType,
    clockFont: FONT_VALUES.has(input.clockFont as ClockFont) ? input.clockFont as ClockFont : defaults.clockFont,
    soundPack: SOUND_PACKS.has(input.soundPack as SoundPack) ? input.soundPack as SoundPack : defaults.soundPack,
    soundEnabled: typeof input.soundEnabled === 'boolean' ? input.soundEnabled : defaults.soundEnabled,
    soundVolume: typeof input.soundVolume === 'number' && Number.isFinite(input.soundVolume)
      ? Math.min(1, Math.max(0, input.soundVolume))
      : defaults.soundVolume,
    customSoundDataUrl: typeof input.customSoundDataUrl === 'string' ? input.customSoundDataUrl : undefined,
    tempUnit: TEMP_UNITS.has(input.tempUnit as TempUnit) ? input.tempUnit as TempUnit : defaults.tempUnit,
    fullscreenWeather: typeof input.fullscreenWeather === 'boolean' ? input.fullscreenWeather : defaults.fullscreenWeather,
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(defaults)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    let nextPrefs: Preferences

    try {
      const stored = window.localStorage.getItem('zaynclock_prefs')
      nextPrefs = stored ? sanitizePreferences(JSON.parse(stored)) : sanitizePreferences({
        timezone: getBrowserTimeZone(),
        tempUnit: /^en-US/i.test(navigator.language || '') ? 'F' : 'C',
      })
    } catch {
      nextPrefs = sanitizePreferences({
        timezone: getBrowserTimeZone(),
        tempUnit: /^en-US/i.test(navigator.language || '') ? 'F' : 'C',
      })
    }

    setPrefs(nextPrefs)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      window.localStorage.setItem('zaynclock_prefs', JSON.stringify(prefs))
    } catch {
      // Storage may be disabled, private, or full. Preferences still work for this session.
    }

    // Apply theme CSS variables
    const themeObj = COLOR_THEMES.find(t => t.value === prefs.theme) || COLOR_THEMES[0]
    document.documentElement.classList.toggle('light', themeObj.isLight)
    for (const [prop, val] of Object.entries(themeObj.vars)) {
      document.documentElement.style.setProperty(prop, val)
    }

    // Apply accent
    const accent = ACCENTS.find(a => a.value === prefs.colorAccent) || ACCENTS[0]
    document.documentElement.style.setProperty('--accent', accent.color)
    document.documentElement.style.setProperty('--glow', `0 0 30px ${accent.glow}`)

    // Apply clock font
    const font = CLOCK_FONTS.find(f => f.value === prefs.clockFont) || CLOCK_FONTS[0]
    document.documentElement.style.setProperty('--font-display', font.css)
  }, [prefs, mounted])

  const update = (partial: Partial<Preferences>) => setPrefs(p => ({ ...p, ...partial }))

  return (
    <PreferencesContext.Provider value={{
      prefs,
      setTimeFormat:      (f) => update({ timeFormat: f }),
      setTheme:           (t) => update({ theme: t }),
      toggleSeconds:      ()  => update({ showSeconds: !prefs.showSeconds }),
      setColorAccent:     (c) => update({ colorAccent: c }),
      setTimezone:        (tz) => update({ timezone: getSafeTimeZone(tz, getBrowserTimeZone()) }),
      setClockType:       (t) => update({ clockType: t }),
      setClockFont:       (f) => update({ clockFont: f }),
      setSoundPack:       (s) => update({ soundPack: s }),
      toggleSound:        ()  => update({ soundEnabled: !prefs.soundEnabled }),
      setSoundVolume:     (v) => update({ soundVolume: v }),
      setCustomSound:     (url) => update({ customSoundDataUrl: url, soundPack: url ? 'custom' : prefs.soundPack }),
      setTempUnit:        (u) => update({ tempUnit: u }),
      setFullscreenWeather: (v) => update({ fullscreenWeather: v }),
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be inside PreferencesProvider')
  return ctx
}
