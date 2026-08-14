'use client'

import { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  hover?: boolean
  padded?: boolean
  style?: CSSProperties
  className?: string
  as?: 'div' | 'section' | 'article'
}

export default function Card({
  children, title, icon, actions, hover = true, padded = true, style, className, as = 'div',
}: CardProps) {
  const Tag: any = as
  return (
    <Tag
      className={[hover ? 'hover-lift' : '', className].filter(Boolean).join(' ')}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: padded ? '1.25rem' : 0,
        ...style,
      }}
    >
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
            {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
            {title}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Tag>
  )
}
