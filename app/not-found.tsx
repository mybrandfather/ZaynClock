import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ maxWidth: 500, margin: '6rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', color: 'var(--accent)', marginBottom: '1rem' }}>404</div>
      <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like this page got lost in time.</p>
      <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 2rem', display: 'inline-block', borderRadius: '0.5rem' }}>
        ← Back to Clock
      </Link>
    </div>
  )
}
