import type { Metadata } from 'next'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Credits and Licenses',
  description: 'Design references, open-source notices, third-party services and acknowledgements used by ZaynClock.',
  alternates: { canonical: 'https://www.zaynclock.com/credits' },
}

const sourceLink = { color: 'var(--accent)', overflowWrap: 'anywhere' } as const

export default function CreditsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Credits and Licenses', url: '/credits' }])} />
      <h1 style={{ color: 'var(--text-primary)', fontSize: '1.9rem', fontWeight: 800, marginBottom: '1rem' }}>Credits and Licenses</h1>

      <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.45rem' }}>Neon 3D clock</h2>
      <p>
        The Neon 3D clock was rewritten as a React/TypeScript component after reviewing Metty&apos;s public “Neon 3D Seven-Segment Digital Clock” Pen, listed by FreeFrontend as MIT licensed. Source reference:{' '}
        <a href="https://codepen.io/Metty/pen/poYwNjv" rel="noopener noreferrer" target="_blank" style={sourceLink}>Metty&apos;s CodePen</a>.
      </p>

      <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.45rem' }}>Orbit dial clock</h2>
      <p>
        The Orbit Dial was rewritten as a responsive React/TypeScript component after reviewing Vineeth.TR&apos;s public “Dail” Pen, featured by FreeFrontend as “Digital-Analog Dial Clock.” Public CodePen Pens use the MIT License. Source reference:{' '}
        <a href="https://codepen.io/vineethtrv/pen/abjrWyW" rel="noopener noreferrer" target="_blank" style={sourceLink}>Vineeth.TR&apos;s CodePen</a>.
      </p>

      <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.45rem' }}>Slide Clock</h2>
      <p>
        The Slide Clock was rewritten as a responsive React/TypeScript component after reviewing Jacob Foster&apos;s (Alca) public “Slide Clock” Pen. Public CodePen Pens use the MIT License. Source reference:{' '}
        <a href="https://codepen.io/Alca/pen/BZbPrE" rel="noopener noreferrer" target="_blank" style={sourceLink}>Jacob Foster&apos;s CodePen</a>.
      </p>

      <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.45rem' }}>Services</h2>
      <p>Weather, air-quality, pollen and geocoding data are requested from Open-Meteo. Advertising may be provided through Google AdSense when enabled. Fonts are loaded through Next.js font optimization from Google font families.</p>

      <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.45rem' }}>Complete notices</h2>
      <p>The source project includes <code>THIRD_PARTY_NOTICES.md</code> with the author notices and MIT permission text retained for all referenced public Pens.</p>
    </div>
  )
}
