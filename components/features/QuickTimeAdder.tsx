'use client'

import Link from 'next/link'

const presets = [
  { label: '5 Min',  minutes: 5,  icon: '⏲️' },
  { label: '10 Min', minutes: 10, icon: '⏲️' },
  { label: '15 Min', minutes: 15, icon: '⏲️' },
  { label: '30 Min', minutes: 30, icon: '⏲️' },
  { label: '1 Hour', minutes: 60, icon: '⏲️' },
]

const cardStyle: React.CSSProperties = {
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.35rem',
  padding: '0.75rem 1.1rem',
  borderRadius: '0.6rem',
  border: '1px solid var(--border)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  minWidth: 80,
  textDecoration: 'none',
}


export default function QuickTimeAdder() {
  return (
    <div style={{ width: '100%' }}>
      {/* Scrollable row — centers on wide screens, scrolls on narrow */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '0.25rem' } as React.CSSProperties}>
        <div style={{ display: 'flex', gap: '0.6rem', width: 'fit-content', margin: '0 auto' }}>

          {/* Preset cards → navigate to countdown timer and auto-start */}
          {presets.map(p => (
            <Link
              key={p.minutes}
              href={`/timer?m=${p.minutes}`}
              className="hover-lift"
              style={cardStyle}
              title={`Start a ${p.label} countdown timer`}
            >
              <span style={{ fontSize: '1.35rem' }}>{p.icon}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{p.label}</span>
            </Link>
          ))}

          {/* Time From Now → navigates to the Time From Now tool */}
          <Link
            href="/time-from-now"
            className="hover-lift"
            style={{ ...cardStyle, color: 'var(--text-primary)' }}
            title="Open the Time From Now calculator"
          >
            <span style={{ fontSize: '1.35rem' }}>➕</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Time From</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: -6 }}>Now</span>
          </Link>

        </div>
      </div>
    </div>
  )
}
