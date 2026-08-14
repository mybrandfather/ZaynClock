import type { Metadata } from 'next'
import TimeFromNowClient from './TimeFromNowClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Time From Now Calculator – What Time Will It Be in X Minutes / Hours?',
  description: 'Quickly calculate the time and date X minutes, hours or days from now. Free and instant.',
  alternates: { canonical: `${SITE_URL}/time-from-now` },
}

const faqs = [
  { q: 'What time will it be in 90 minutes from now?', a: 'Set 90 minutes in the input below and the answer appears instantly. The result respects your timezone and 12h/24h preference.' },
  { q: 'Can I subtract time as well?', a: 'Yes — enter a negative value or use the "Time ago" preset to compute backwards from now.' },
  { q: 'Is it accurate across daylight saving changes?', a: 'Yes — the calculation uses your system clock and timezone via the standard Intl API, so DST is handled correctly.' },
  { q: 'Why would I use this?', a: 'For meeting reminders ("8h from now"), cooking ("when will the pizza be ready in 18 min?"), shipping ("plus 3 business days"), and quick mental math without doing arithmetic.' },
]

export default function TimeFromNowPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'Time From Now Calculator', description: 'Calculate the time X minutes/hours/days from now.', url: '/time-from-now' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Time From Now', url: '/time-from-now' }]),
        faqSchema(faqs),
      ]} />
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>➕ TIME FROM NOW</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        What time will it be in X minutes / hours / days?
      </p>
      <TimeFromNowClient />

      <section style={{ padding: '2.5rem 0 1rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.6rem' }}>Stop doing time math in your head</h2>
        <p>
          Mental math on time is famously annoying. &quot;If it&apos;s 4:47pm now and the meeting is in 1h 23m, what time
          do I need to be on the call?&quot; You can either pull out a calculator and convert minutes, or you can type
          &quot;1h 23m&quot; into ZaynClock&apos;s Time From Now and read the answer instantly. We do the same trick for
          hours, for full days, and for going backwards (&quot;3 hours ago was…&quot;).
        </p>
        <p>
          The result respects your selected timezone and time format from the home page settings, so it always reads in the
          way you&apos;re used to. If you&apos;re scheduling across time zones, pair this with the
          <a style={{ color: 'var(--accent)' }} href="/converter"> Time Converter</a> to find the equivalent moment in
          another city.
        </p>
      </section>

      <Faq items={faqs} />
    </div>
  )
}
