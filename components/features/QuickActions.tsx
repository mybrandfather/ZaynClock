'use client'

import Link from 'next/link'

const tools = [
  { href: '/pomodoro', icon: '🍅', label: 'Pomodoro', desc: '25 min focus' },
  { href: '/stopwatch', icon: '⏱️', label: 'Stopwatch', desc: 'Lap timer' },
  { href: '/worldclock', icon: '🌍', label: 'World Clock', desc: 'Any timezone' },
  { href: '/converter', icon: '🔄', label: 'Converter', desc: 'Time zones' },
]

export default function QuickActions() {
  return (
    <div className="card">
      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>⚡ Quick Tools</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {tools.map(t => (
          <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
            <div className="hover-lift" style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
              background: 'var(--bg-primary)',
              cursor: 'pointer',
            }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{t.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.label}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
