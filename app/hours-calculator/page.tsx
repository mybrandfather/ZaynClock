import type { Metadata } from 'next'
import HoursCalculatorClient from './HoursCalculatorClient'
import AdSlot from '@/components/layout/AdSlot'
import EducationToolLinks from '@/components/features/EducationToolLinks'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Hours Calculator – Time Between Two Times With Breaks',
  description: 'Calculate hours and minutes between two times, subtract breaks, handle overnight shifts and convert the result to decimal hours. Free online hours calculator.',
  alternates: { canonical: `${SITE_URL}/hours-calculator` },
  keywords: 'hours calculator, time duration calculator, calculate hours, time between two times, work hours calculator, decimal hours calculator',
}

const faqs = [
  { q: 'How do I calculate hours between two times?', a: 'Enter the start and end times. ZaynClock immediately shows the duration in hours and minutes, decimal hours and total minutes.' },
  { q: 'Can the hours calculator subtract a lunch break?', a: 'Yes. Enter the unpaid break length in minutes and it will be deducted from the total.' },
  { q: 'Does it calculate overnight shifts?', a: 'Yes. If the end is earlier than the start, ZaynClock treats it as the following day. You can also select the overnight checkbox explicitly.' },
  { q: 'What are decimal hours?', a: 'Decimal hours express minutes as a fraction of an hour. For example, 7 hours 30 minutes equals 7.50 decimal hours.' },
]

export default function HoursCalculatorPage() {
  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Hours Calculator',
          description: 'Calculate time between two times with breaks and decimal-hour conversion.',
          url: '/hours-calculator',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Work Tools', url: '/work-tools' },
          { name: 'Hours Calculator', url: '/hours-calculator' },
        ]),
        faqSchema(faqs),
      ]} />

      <header style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>
          Hours Calculator
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Find the exact time between a start and end time, subtract breaks, and get decimal hours for timesheets.
        </p>
      </header>

      <HoursCalculatorClient />
      <AdSlot format="leaderboard" style={{ margin: '1.5rem 0 2rem' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
          Calculate work, class or project hours without manual subtraction
        </h2>
        <p>
          Time subtraction becomes error-prone when minutes cross an hour, a break must be deducted or a shift passes
          midnight. This calculator handles those cases instantly. It is useful for employees checking a shift,
          freelancers preparing a timesheet, students logging study time and teachers calculating class or tutoring hours.
        </p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', margin: '1.4rem 0 0.55rem' }}>
          Hours and minutes versus decimal hours
        </h2>
        <p>
          Standard time uses 60 minutes per hour, while many payroll and billing systems use decimal hours. Thirty
          minutes is 0.50 hours, 15 minutes is 0.25 and 45 minutes is 0.75. ZaynClock shows both formats so you can copy
          the one your school, office or timesheet requires.
        </p>
        <p>
          Need to total an entire Monday-to-Sunday schedule? Use the{' '}
          <a href="/time-card-calculator" style={{ color: 'var(--accent)' }}>weekly time-card calculator</a>.
        </p>
      </section>

      <Faq items={faqs} />
      <EducationToolLinks exclude="/hours-calculator" />
    </main>
  )
}
