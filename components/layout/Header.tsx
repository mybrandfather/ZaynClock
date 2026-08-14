'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePreferences, COLOR_THEMES } from '@/hooks/usePreferences'
import SettingsPanel from './SettingsPanel'

const navLinks: { href: string; label: string; icon: string }[] = [
  { href: '/',              label: 'Clock',         icon: '🕐' },
  { href: '/timer',         label: 'Timer',         icon: '⏲️' },
  { href: '/alarm',         label: 'Alarm',         icon: '⏰' },
  { href: '/pomodoro',      label: 'Pomodoro',      icon: '🍅' },
  { href: '/interval-timer', label: 'Interval Timer', icon: '🔁' },
  { href: '/study-clock',   label: 'Study Clock',   icon: '📚' },
  { href: '/education-tools', label: 'School Tools', icon: '🎓' },
  { href: '/work-tools', label: 'Work Tools', icon: '💼' },
  { href: '/stopwatch',     label: 'Stopwatch',     icon: '⏱️' },
  { href: '/chess-clock',   label: 'Chess Clock',   icon: '♟️' },
  { href: '/worldclock',    label: 'World Clock',   icon: '🌍' },
  { href: '/converter',     label: 'Time Converter', icon: '🔄' },
  { href: '/calendar',      label: 'Calendar',      icon: '📅' },
  { href: '/date-calculator', label: 'Date Tools', icon: '🗓️' },
  { href: '/todo',          label: 'Todo',          icon: '✅' },
  { href: '/blog',          label: 'Blog',          icon: '📝' },
]

export default function Header() {
  const { prefs, setTheme } = usePreferences()
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isFs, setIsFs] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!settingsOpen) return
    const onClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [settingsOpen])

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = () => {
    const el = document.getElementById('clock-section') || document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const handleShare = async () => {
    const url = 'https://www.zaynclock.com'
    const text = '⏱️ Check out ZaynClock – beautiful free clock & time tools!'
    if (navigator.share) {
      try { await navigator.share({ title: 'ZaynClock', text, url }) } catch {}
    } else {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', height: 60, gap: '0.75rem' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="header-logo"
            src="/zaynclock-logo.png"
            alt="ZaynClock"
            style={{ height: 36, width: 'auto', display: 'block' }}
          />
        </Link>

        <nav className="hidden-mobile" aria-label="Primary"
          style={{ display: 'flex', gap: '0.15rem', flex: 1, overflowX: 'auto', justifyContent: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} title={link.label} aria-label={link.label}
              className="nav-icon-link"
              style={{ width: 36, height: 36 }}
            >{link.icon}</Link>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem', alignItems: 'center', position: 'relative' }} ref={settingsRef}>
          <button onClick={() => {
              const isLight = COLOR_THEMES.find(t => t.value === prefs.theme)?.isLight
              setTheme(isLight ? 'dark' : 'light')
            }}
            className="btn-ghost" title="Toggle dark/light" aria-label="Toggle theme"
            style={{ padding: '0.4rem 0.5rem', fontSize: '1rem' }}>
            {COLOR_THEMES.find(t => t.value === prefs.theme)?.isLight ? '🌙' : '☀️'}
          </button>
          <button onClick={() => setSettingsOpen(o => !o)} className="btn-ghost" title="Settings" aria-label="Open settings"
            aria-expanded={settingsOpen}
            style={{ padding: '0.4rem 0.5rem', fontSize: '1rem' }}>⚙️</button>
          <button onClick={toggleFullscreen} className="btn-ghost compact-hide" title={isFs ? 'Exit fullscreen' : 'Fullscreen'} aria-label="Toggle fullscreen"
            style={{ padding: '0.4rem 0.5rem', fontSize: '1rem' }}>{isFs ? '🡼' : '⛶'}</button>
          <button onClick={handleShare} className="btn-ghost compact-hide" title="Share ZaynClock" aria-label="Share ZaynClock"
            style={{ padding: '0.4rem 0.5rem', fontSize: '1rem' }}>🔗</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="btn-ghost mobile-only" aria-label="Menu"
            style={{ padding: '0.4rem 0.5rem' }}>{menuOpen ? '✕' : '☰'}</button>

          {settingsOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 60 }}>
              <SettingsPanel onClose={() => setSettingsOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div style={{
          background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
          padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.4rem',
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.55rem 0.65rem', borderRadius: '0.5rem',
                textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem',
                background: 'var(--bg-card)',
              }}
            ><span style={{ fontSize: '1.1rem' }}>{link.icon}</span>{link.label}</Link>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) { .mobile-only { display: none !important; } }
        @media (max-width: 899px) { .hidden-mobile { display: none !important; } }
        @media (max-width: 520px) {
          .compact-hide { display: none !important; }
          .header-logo { height: 30px !important; }
        }
      `}</style>
    </header>
  )
}
