'use client'

export default function GlobalError() {
  const repairAndReload = () => {
    try {
      window.localStorage.removeItem('zaynclock_prefs')
    } catch {}
    window.location.reload()
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0a0a0f', color: '#f0f0ff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: 680, margin: '4rem auto', padding: '2rem 1rem', textAlign: 'center' }}>
          <h1>ZaynClock needs a quick browser reset</h1>
          <p style={{ color: '#aaaac8', lineHeight: 1.7 }}>
            A stored preference could not be read. Reset only ZaynClock settings and reload the page.
          </p>
          <button
            onClick={repairAndReload}
            style={{ marginTop: '1rem', padding: '0.75rem 1.1rem', border: 0, borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
          >
            Repair settings and reload
          </button>
        </main>
      </body>
    </html>
  )
}
