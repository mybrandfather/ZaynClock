'use client'
import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

export default function Faq({ items, title = 'Frequently Asked Questions' }: { items: FaqItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section style={{ padding: '2.5rem 0' }} aria-labelledby="faq-heading">
      <h2 id="faq-heading" style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((it, i) => {
          const isOpen = open === i
          return (
            <div key={i} className="card" style={{ padding: '0.85rem 1rem' }}>
              <button
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600,
                  cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 0,
                }}
              >
                <span>{it.q}</span>
                <span style={{ color: 'var(--accent)', marginLeft: '1rem', fontSize: '1.2rem' }}>{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div style={{ marginTop: '0.6rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.93rem' }}>
                  {it.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
