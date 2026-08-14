'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/',         label: 'Clock',    icon: '🕐' },
  { href: '/tools',    label: 'Tools',    icon: '⚡' },
  { href: '/education-tools', label: 'School', icon: '🎓' },
  { href: '/work-tools', label: 'Work', icon: '💼' },
  { href: '/calendar', label: 'Calendar', icon: '📅' },
  { href: '/todo',     label: 'Todo',     icon: '✅' },
]

export default function SectionTabs() {
  const pathname = usePathname() || '/'
  return (
    <nav
      aria-label="Sections"
      style={{
        display: 'flex',
        gap: '0.4rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '0 auto 1.25rem',
      }}
    >
      {tabs.map(t => {
        const active = pathname === t.href || (t.href !== '/' && pathname.startsWith(t.href))
        return (
          <Link
            key={t.href}
            href={t.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '0.45rem 0.9rem',
              borderRadius: '999px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            <span aria-hidden style={{ fontSize: '0.95rem' }}>{t.icon}</span>{t.label}
          </Link>
        )
      })}
    </nav>
  )
}
