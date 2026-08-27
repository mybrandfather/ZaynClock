import type { Metadata } from 'next'
import HolidaysClient from './HolidaysClient'
import JsonLd, { breadcrumbSchema, SITE_URL, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Major Public Holidays by Country and Year',
  description: 'Browse a starter list of major nationwide holidays by country and year for the United States, UK, Canada, Pakistan, India, Saudi Arabia, UAE and Australia.',
  alternates: { canonical: `${SITE_URL}/holidays` },
  openGraph: { url: `${SITE_URL}/holidays` },
}

export default function Page() {
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Worldwide Holidays', description: 'Browse major public holidays by country and year.', url: '/holidays' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Worldwide Holidays', url: '/holidays' }]),
      ]} />
      <h1>🎉 Worldwide Holidays</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Choose a country and year. Dates marked as estimates may depend on official announcements or moon sighting.</p>
      <HolidaysClient />
    </main>
  )
}
