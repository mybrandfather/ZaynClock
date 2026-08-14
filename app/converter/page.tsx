import type { Metadata } from 'next'
import ConverterClient from './ConverterClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Time Zone Converter – Free Online Tool',
  description: 'Convert any time between any two cities in the world. Daylight-saving aware. Pick a moment in one city, see it instantly in another.',
  alternates: { canonical: SITE_URL + '/converter' },
}

const faqs = [
  { q: 'How does the time zone converter work?', a: 'Pick a "from" city, a "to" city and a moment. We use the standard IANA database to compute the equivalent local time, including correct daylight-saving offsets.' },
  { q: 'Is this useful for scheduling meetings?', a: 'Yes — it\'s the fastest way to know what time a 10 AM meeting in New York is in London or Tokyo, without doing math in your head.' },
  { q: 'Can I share the converted time?', a: 'Yes — the URL updates as you change cities, so you can paste it into chat to share the same conversion.' },
]

export default function Page() {
  return (
    <>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Time Converter', description: 'Convert time between cities.', url: '/converter' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Converter', url: '/converter' }]),
        faqSchema(faqs),
      ]} />
      <ConverterClient />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <Faq items={faqs} />
      </div>
    </>
  )
}
