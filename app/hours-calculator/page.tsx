import type { Metadata } from 'next'
import Link from 'next/link'
import HoursCalculatorClient from './HoursCalculatorClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Hours Calculator With Breaks & Decimal Hours',
  description: 'Calculate hours and minutes between two times, subtract an unpaid break, handle overnight shifts, copy results and see decimal hours instantly.',
  alternates: { canonical: `${SITE_URL}/hours-calculator` },
  openGraph: { title: 'Hours Calculator With Breaks & Decimal Hours', description: 'Find hours between two times with breaks, overnight shifts and copyable results.', url: `${SITE_URL}/hours-calculator` },
}

const faqs = [
  { q: 'How do I calculate hours between two times?', a: 'Enter the start and end times. ZaynClock immediately shows the duration in hours and minutes, decimal hours and total minutes.' },
  { q: 'Can the hours calculator subtract a lunch break?', a: 'Yes. Enter the unpaid break length in minutes and it will be deducted from the total.' },
  { q: 'Does it calculate overnight shifts?', a: 'Yes. If the end is earlier than the start, it is automatically treated as the following day. You can also select the next-day checkbox explicitly.' },
  { q: 'Can I copy the calculated hours?', a: 'Yes. Copy result puts the hours and minutes, decimal hours and total minutes on your clipboard.' },
  { q: 'What are decimal hours?', a: 'Decimal hours express minutes as a fraction of an hour. For example, 7 hours 30 minutes equals 7.50 decimal hours.' },
]

export default function HoursCalculatorPage() {
  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Hours Calculator', description: 'Calculate time between two times with breaks, overnight shifts and decimal-hour conversion.', url: '/hours-calculator' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Work Tools', url: '/work-tools' }, { name: 'Hours Calculator', url: '/hours-calculator' }]),
        faqSchema(faqs),
      ]} />
      <header style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>Hours Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Find time between a start and end time, subtract an unpaid break, and copy the result in standard and decimal hours.</p>
      </header>
      <HoursCalculatorClient />
      <section style={{ maxWidth: 840, margin: '2rem auto 0', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem' }}>Calculate hours between two times</h2>
        <p>Enter the start and end time for a work shift, class or project session. Add only unpaid break minutes. The results show net hours and minutes, decimal hours, total minutes and the duration before the break.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Overnight shifts and decimal hours</h2>
        <p>If the end time is earlier than the start time, the calculator treats it as the next day. Decimal hours convert minutes into hundredths of an hour: 15 minutes is 0.25, 30 minutes is 0.50 and 45 minutes is 0.75.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Related work-hour tools</h2>
        <p>To total several days and separate weekly overtime, use the <Link href="/time-card-calculator" style={{ color: 'var(--accent)' }}>time-card calculator</Link>. For a direct conversion, try the <Link href="/decimal-hours" style={{ color: 'var(--accent)' }}>decimal-hours converter</Link> or calculate deadlines with the <Link href="/business-days-calculator" style={{ color: 'var(--accent)' }}>business-days calculator</Link>.</p>
      </section>
      <Faq items={faqs} />
    </main>
  )
}
