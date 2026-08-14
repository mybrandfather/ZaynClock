import type { Metadata } from 'next'
import StopwatchClient from './StopwatchClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Stopwatch – Free Online Stopwatch with Laps',
  description: 'A precise online stopwatch with lap times, best/worst lap highlighting, and millisecond accuracy. Free, no signup.',
  alternates: { canonical: SITE_URL + '/stopwatch' },
}

const faqs = [
  { q: 'How accurate is the stopwatch?', a: 'It uses the high-resolution performance.now() timer in your browser, so it is accurate to the millisecond and never drifts as long as the tab is open.' },
  { q: 'Will it keep running if I switch tabs?', a: 'Yes. The stopwatch tracks elapsed time using the system clock, so it stays correct even if the tab is in the background.' },
  { q: 'Can I record laps?', a: 'Yes — press "Lap" at any moment. The list shows the lap split, the running total, and highlights your best and worst laps.' },
  { q: 'Can I share or export the laps?', a: 'You can copy the lap list as text and paste it anywhere. We don\'t upload anything to a server.' },
]

export default function Page() {
  return (
    <>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Stopwatch', description: 'Free online stopwatch with laps.', url: '/stopwatch' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Stopwatch', url: '/stopwatch' }]),
        faqSchema(faqs),
      ]} />
      <StopwatchClient />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <Faq items={faqs} />
      </div>
    </>
  )
}
