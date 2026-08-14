'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const click = () => {
    const target = document.getElementById('clock-section') || document.getElementById('clock-fs')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={click}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'var(--accent)',
        color: 'var(--bg-primary)',
        border: 'none',
        fontSize: '1.2rem',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: 'var(--glow), 0 6px 20px rgba(0,0,0,0.3)',
        zIndex: 70,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >↑</button>
  )
}
