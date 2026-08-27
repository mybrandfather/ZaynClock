import type { Metadata } from 'next'
import IslamicCalendarClient from './IslamicCalendarClient'
import JsonLd, { breadcrumbSchema, SITE_URL, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Islamic Calendar – Hijri Date Today and Monthly Calendar',
  description: 'View today’s Hijri date and browse a monthly Islamic calendar alongside Gregorian dates, with an optional moon-sighting adjustment.',
  alternates: { canonical: `${SITE_URL}/islamic-calendar` },
  openGraph: { url: `${SITE_URL}/islamic-calendar` },
}

export default function Page() {
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Islamic Calendar', description: 'Hijri date and monthly Islamic calendar with moon-sighting adjustment.', url: '/islamic-calendar' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Islamic Calendar', url: '/islamic-calendar' }]),
      ]} />
      <h1>☪️ Islamic Calendar</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Hijri dates use the Umm al-Qura calculation. Local moon sighting may differ by one day.</p>
      <IslamicCalendarClient />
    </main>
  )
}
