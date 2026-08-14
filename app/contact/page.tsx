import type { Metadata } from 'next'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact ZaynClock about support, bugs, accessibility, privacy, partnerships or general questions.',
  alternates: { canonical: 'https://www.zaynclock.com/contact' },
}

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }])} />
      <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: '0.75rem' }}>Contact ZaynClock</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
        Send bug reports, feature ideas, accessibility feedback, privacy questions or partnership inquiries by email. Please include the page URL, your browser and a short description when reporting a technical problem.
      </p>
      <div className="card" style={{ maxWidth: 520 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.35rem' }}>Email</p>
        <a href="mailto:hello@zaynclock.com" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.05rem' }}>hello@zaynclock.com</a>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '1rem' }}>Do not send passwords, precise financial details or other highly sensitive information.</p>
      </div>
    </div>
  )
}
