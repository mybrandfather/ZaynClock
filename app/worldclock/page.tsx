import type { Metadata } from 'next'
import WorldClockClient from './WorldClockClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'World Clock – Live Time in Every City',
  description: 'See the current time in any city in the world. Pin your favorites, search by name, daylight saving aware. Free online world clock.',
  alternates: { canonical: SITE_URL + '/worldclock' },
}

const faqs = [
  { q: 'How many cities are supported?', a: 'Hundreds of major cities across every continent, including all of the IANA timezone database. If your city isn\'t there, find a nearby one in the same timezone.' },
  { q: 'Does it handle daylight saving time?', a: 'Yes — every clock uses the standard IANA timezone database, so DST transitions are handled automatically and correctly.' },
  { q: 'Can I save my favorite cities?', a: 'Yes. Pinned cities are saved to your browser and appear at the top the next time you visit.' },
  { q: 'How is this different from the converter?', a: 'The world clock shows live current time in many cities. The converter is for finding the equivalent of a specific moment between two cities.' },
]

export default function Page() {
  return (
    <>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock World Clock', description: 'Live time across the world.', url: '/worldclock' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'World Clock', url: '/worldclock' }]),
        faqSchema(faqs),
      ]} />
      <WorldClockClient />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <Faq items={faqs} />
      </div>
    </>
  )
}
