import type { Metadata } from 'next'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important limitations for ZaynClock time, alarm, weather and productivity tools.',
  alternates: { canonical: 'https://www.zaynclock.com/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Disclaimer', url: '/disclaimer' }])} />
      <h1 style={{ color: 'var(--text-primary)', fontSize: '1.9rem', fontWeight: 800, marginBottom: '1rem' }}>Disclaimer</h1>
      <p>ZaynClock provides general-purpose clock, timer, planning, weather and productivity tools for convenience. Results can be affected by device-clock accuracy, browser throttling, tab suspension, network availability, time-zone database changes, location permission and third-party service availability.</p>
      <p style={{ marginTop: '1rem' }}>Do not use this site as the only source for emergencies, medication timing, legal deadlines, financial trading, aviation, navigation, transportation departures, workplace safety or any other activity where a missed alert or inaccurate result could cause harm.</p>
      <p style={{ marginTop: '1rem' }}>Weather, air-quality and pollen information is informational and may be delayed or incomplete. Follow official local authorities for warnings and safety decisions.</p>
      <p style={{ marginTop: '1rem' }}>Links and advertisements may lead to third-party websites. Their products, claims, availability and policies are controlled by those third parties and are not endorsements by ZaynClock.</p>
    </div>
  )
}
