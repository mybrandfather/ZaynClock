import type { Metadata } from 'next'
import SunMoonClient from './SunMoonClient'
import JsonLd, { breadcrumbSchema, SITE_URL, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Sunrise, Sunset and Moon Phase Today',
  description: 'Estimate today’s sunrise, sunset, solar noon, day length, moon phase and moon illumination for your chosen coordinates.',
  alternates: { canonical: `${SITE_URL}/sun-moon` },
  openGraph: { url: `${SITE_URL}/sun-moon` },
}

export default function Page() {
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Sun and Moon', description: 'Sunrise, sunset, solar noon, day length and moon phase estimates.', url: '/sun-moon' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Sun and Moon', url: '/sun-moon' }]),
      ]} />
      <h1>🌅 Sun &amp; Moon Today</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Astronomy times calculated for your chosen location. Allow location access or enter coordinates manually.</p>
      <SunMoonClient />
    </main>
  )
}
