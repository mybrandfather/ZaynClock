'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('ZaynClock page error:', error)
  }, [error])

  const repairAndReload = () => {
    try {
      window.localStorage.removeItem('zaynclock_prefs')
    } catch {}
    window.location.reload()
  }

  return (
    <section style={{ maxWidth: 680, margin: '4rem auto', padding: '2rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '0.75rem' }}>The clock could not load</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        A saved browser setting may be incompatible with this version of ZaynClock. Your timers and tools are still safe.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={repairAndReload}>Repair settings and reload</button>
        <button className="btn-ghost" onClick={reset}>Try again</button>
      </div>
    </section>
  )
}
