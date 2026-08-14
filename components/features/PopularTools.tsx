'use client'

import Link from 'next/link'

const tools = [
  { href: '/classroom-timer', icon: '🏫', label: 'Classroom Timer', desc: 'Teachers & students' },
  { href: '/exam-timer', icon: '📝', label: 'Exam Timer', desc: 'Tests & reading time' },
  { href: '/hours-calculator', icon: '➗', label: 'Hours Calculator', desc: 'Time between times' },
  { href: '/time-card-calculator', icon: '🗓️', label: 'Time Card', desc: 'Weekly work hours' },
  { href: '/meeting-timer', icon: '👥', label: 'Meeting Timer', desc: 'Time & cost' },
  { href: '/study-clock', icon: '📚', label: 'Study Timer', desc: 'Focus sessions' },
]

export default function PopularTools() {
  return (
    <div>
      <h3 style={{
        fontWeight: 700,
        fontSize: '0.78rem',
        marginBottom: '0.85rem',
        color: 'var(--text-secondary)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        🔥 Popular Tools
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '0.75rem',
      }}>
        {tools.map(t => (
          <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
            <div
              className="hover-lift"
              style={{
                padding: '1rem 0.9rem',
                borderRadius: '0.6rem',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
