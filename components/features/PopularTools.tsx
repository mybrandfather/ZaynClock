'use client'

import Link from 'next/link'

const tools = [
  { href: '/time-card-calculator', icon: '🗓️', label: 'Time Card Calculator', desc: 'Breaks, overtime & pay' },
  { href: '/hours-calculator', icon: '➗', label: 'Hours Calculator', desc: 'Calculate hours worked' },
  { href: '/week-number', icon: '🔢', label: 'Current Week Number', desc: 'ISO week & date range' },
  { href: '/business-days-calculator', icon: '💼', label: 'Business Days', desc: 'Count working days' },
  { href: '/date-calculator', icon: '📅', label: 'Date Calculator', desc: 'Add or subtract dates' },
  { href: '/age-calculator', icon: '🎂', label: 'Age Calculator', desc: 'Exact age between dates' },
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
        🔥 Popular Work &amp; Date Tools
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
