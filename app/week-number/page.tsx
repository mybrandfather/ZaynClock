import type { Metadata } from 'next'
import Link from 'next/link'
import WeekNumberClient from './WeekNumberClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { SITE_URL, breadcrumbSchema, faqSchema, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Current Week Number & ISO Week Date Calculator',
  description: 'See the current ISO week number and its Monday–Sunday dates. Convert any date to a week number and view the complete current-year ISO week table.',
  alternates: { canonical: `${SITE_URL}/week-number` },
  openGraph: { title: 'Current Week Number & ISO Week Date Calculator', description: 'Find today’s ISO week, convert a date, and view every week of the current year.', url: `${SITE_URL}/week-number` },
}

export const revalidate = 3600

const faqs = [
  { q: 'What is the current week number?', a: 'The calculator at the top of this page automatically displays today’s ISO week number and its Monday and Sunday dates.' },
  { q: 'When does an ISO week begin?', a: 'ISO 8601 weeks begin on Monday and end on Sunday. Week 1 is the week containing January 4, or equivalently the year’s first Thursday.' },
  { q: 'Why can January 1 belong to the previous week-year?', a: 'The ISO week-year follows complete Monday-to-Sunday weeks. Dates near New Year can therefore belong to the final ISO week of the previous year or week 1 of the next year.' },
  { q: 'Which years have 53 ISO weeks?', a: 'An ISO year has 53 weeks when January 1 is a Thursday, or when a leap year begins on Wednesday. Most years have 52 weeks.' },
]

export default function WeekNumberPage() {
  const initialDate = new Date().toISOString().slice(0, 10)

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock ISO Week Number Calculator', description: 'Find the current ISO week and convert any date to a week number.', url: '/week-number' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Tools', url: '/tools' }, { name: 'Week Number', url: '/week-number' }]),
        faqSchema(faqs),
      ]} />
      <header style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', marginBottom: '0.45rem' }}>Current Week Number</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>See this week’s number and dates, or convert any date using the ISO 8601 week system.</p>
      </header>
      <WeekNumberClient initialDate={initialDate} />
      <section style={{ maxWidth: 840, margin: '2rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem' }}>How ISO week numbers work</h2>
        <p>ISO 8601 gives every Monday-to-Sunday week a number. Week 1 is the week containing January 4, so the ISO week-year can differ from the calendar year for a few days around New Year. This consistent rule makes week numbers useful for schedules, reporting and planning across countries.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Why some years have 53 weeks</h2>
        <p>A normal ISO year contains 52 complete weeks. A 53rd week occurs when January 1 is Thursday, or when a leap year begins Wednesday. The table above automatically includes week 53 only when the current ISO year has one.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Related date and time tools</h2>
        <p>
          Use the <Link href="/date-calculator" style={{ color: 'var(--accent)' }}>date calculator</Link> to add or subtract days, the <Link href="/date-countdown" style={{ color: 'var(--accent)' }}>date countdown</Link> for time remaining, or the <Link href="/time-card-calculator" style={{ color: 'var(--accent)' }}>time-card calculator</Link> to total a workweek.
        </p>
      </section>
      <Faq items={faqs} />
    </main>
  )
}
