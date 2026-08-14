'use client'

import { useState, useEffect } from 'react'
import { WORLD_CITIES } from '@/lib/utils'
import { usePreferences } from '@/hooks/usePreferences'
import AdSlot from '@/components/layout/AdSlot'

function getCityTime(timezone: string, format: '12h' | '24h') {
  const now = new Date()
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric', minute: '2-digit',
    hour12: format === '12h',
  }).format(now)
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short', month: 'short', day: 'numeric',
  }).format(now)
  const offset = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? ''
  return { time, date, offset }
}

export default function WorldClockPage() {
  const { prefs } = usePreferences()
  const [tick, setTick] = useState(0)
  const [pinned, setPinned] = useState<string[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('zaynclock_pinned')
    if (stored) setPinned(JSON.parse(stored))
  }, [])

  const togglePin = (tz: string) => {
    setPinned(prev => {
      const next = prev.includes(tz) ? prev.filter(t => t !== tz) : [...prev, tz]
      localStorage.setItem('zaynclock_pinned', JSON.stringify(next))
      return next
    })
  }

  const filtered = WORLD_CITIES.filter(c =>
    c.city.toLowerCase().includes(search.toLowerCase()) ||
    c.timezone.toLowerCase().includes(search.toLowerCase())
  )

  const sortedCities = [...filtered].sort((a, b) => {
    const ap = pinned.includes(a.timezone) ? 0 : 1
    const bp = pinned.includes(b.timezone) ? 0 : 1
    return ap - bp
  })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
        🌍 WORLD CLOCK
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Current time in cities around the world
      </p>

      <AdSlot format="leaderboard" style={{ marginBottom: '1.5rem' }} />

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search city or timezone..."
          style={{
            width: '100%', maxWidth: 400,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            padding: '0.6rem 1rem',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            display: 'block', margin: '0 auto',
          }}
        />
      </div>

      {/* City Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {sortedCities.map(city => {
          const { time, date, offset } = getCityTime(city.timezone, prefs.timeFormat)
          const isPinned = pinned.includes(city.timezone)
          return (
            <div key={city.timezone} className="card" style={{
              borderColor: isPinned ? 'var(--accent)' : 'var(--border)',
              position: 'relative',
            }}>
              <button
                onClick={() => togglePin(city.timezone)}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1rem', opacity: isPinned ? 1 : 0.3,
                  transition: 'opacity 0.2s',
                }}
                title={isPinned ? 'Unpin' : 'Pin'}
              >📌</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{city.flag}</span>
                <span style={{ fontWeight: 700 }}>{city.city}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                color: 'var(--accent)',
                marginBottom: '0.25rem',
              }}>{time}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{date}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {offset} · {city.timezone.replace(/_/g, ' ')}
              </div>
            </div>
          )
        })}
      </div>

      {sortedCities.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
          No cities found for "{search}"
        </p>
      )}

      <AdSlot format="rectangle" style={{ marginTop: '2rem' }} />
    </div>
  )
}
