import type { Metadata } from 'next'
import TimeCardCalculatorClient from './TimeCardCalculatorClient'
import AdSlot from '@/components/layout/AdSlot'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Time Card Calculator – Free Weekly Work Hours Calculator',
  description: 'Free weekly time card calculator. Add start and end times for each day, subtract unpaid breaks, handle overnight shifts and total decimal hours.',
  alternates: { canonical: `${SITE_URL}/time-card-calculator` },
  keywords: 'time card calculator, timesheet calculator, weekly hours calculator, work hours calculator, time clock calculator, free timecard calculator',
}

const faqs = [
  { q: 'How does the weekly time card calculator work?', a: 'Enable each day worked, enter its start and end time, and add any unpaid break. Daily and weekly totals update immediately.' },
  { q: 'Can it calculate an overnight shift?', a: 'Yes. When an end time is earlier than its start time, the calculator treats the end as occurring the following day.' },
  { q: 'Does it show decimal hours?', a: 'Yes. The weekly result appears in both hours and minutes and decimal hours.' },
  { q: 'Can I use this as an official payroll record?', a: 'Use it to estimate and verify hours, but compare the result with your employer’s records and local break, rounding and overtime rules.' },
]

export default function TimeCardCalculatorPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Time Card Calculator',
          description: 'Weekly work-hours and timesheet calculator with break deductions.',
          url: '/time-card-calculator',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Work Tools', url: '/work-tools' },
          { name: 'Time Card Calculator', url: '/time-card-calculator' },
        ]),
        faqSchema(faqs),
      ]} />

      <header style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>
          Weekly Time Card Calculator
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Add daily clock-in, clock-out and break times to total your workweek in hours, minutes and decimal hours.
        </p>
      </header>

      <TimeCardCalculatorClient />
      <AdSlot format="leaderboard" style={{ margin: '1.5rem 0 2rem' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
          Check a weekly timesheet before you submit it
        </h2>
        <p>
          Use one row for each day worked. Break time is deducted from that day, and shifts that cross midnight are
          calculated automatically. The weekly total is shown in ordinary time and decimal time, making it easier to
          compare with workplace scheduling or timekeeping software.
        </p>
        <p>
          This calculator does not apply employer-specific rounding, paid-break or overtime policies. For one start and
          end time, use the simpler <a href="/hours-calculator" style={{ color: 'var(--accent)' }}>hours calculator</a>.
        </p>
      </section>

      <Faq items={faqs} />
    </main>
  )
}
