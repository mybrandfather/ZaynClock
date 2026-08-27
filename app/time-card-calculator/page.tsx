import type { Metadata } from 'next'
import Link from 'next/link'
import TimeCardCalculatorClient from './TimeCardCalculatorClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Time Card Calculator With Breaks & Overtime',
  description: 'Calculate weekly regular and overtime hours from daily clock-in and clock-out times. Supports unpaid breaks, overnight shifts, decimal hours, print and CSV.',
  alternates: { canonical: `${SITE_URL}/time-card-calculator` },
  openGraph: { title: 'Time Card Calculator With Breaks & Overtime', description: 'Total weekly work hours, unpaid breaks, overnight shifts and configurable overtime.', url: `${SITE_URL}/time-card-calculator` },
}

const faqs = [
  { q: 'How does the weekly time card calculator work?', a: 'Enable each day worked, enter its start and end time, and add any unpaid break. Daily, regular, overtime and weekly totals update immediately.' },
  { q: 'Can it calculate an overnight shift?', a: 'Yes. When an end time is earlier than its start time, the calculator treats the end as occurring the following day and marks the row +1d.' },
  { q: 'Can I change the weekly overtime threshold?', a: 'Yes. The default threshold is 40 hours, but you can set the weekly threshold required by your workplace or jurisdiction.' },
  { q: 'Can I print or export my time card?', a: 'Yes. Use Print time card for a printer-friendly result or Export CSV for a spreadsheet-compatible file.' },
  { q: 'Can I use this as an official payroll record?', a: 'Use it to estimate and verify hours, but compare the result with your employer’s records and applicable break, rounding and overtime rules.' },
]

export default function TimeCardCalculatorPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Time Card Calculator', description: 'Weekly regular and overtime calculator with break deductions and overnight shifts.', url: '/time-card-calculator' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Work Tools', url: '/work-tools' }, { name: 'Time Card Calculator', url: '/time-card-calculator' }]),
        faqSchema(faqs),
      ]} />
      <header style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>Weekly Time Card Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Add clock-in, clock-out and unpaid break times to find regular, overtime and total hours for the week.</p>
      </header>
      <TimeCardCalculatorClient />
      <section style={{ maxWidth: 840, margin: '2rem auto 0', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem' }}>How to calculate a weekly time card</h2>
        <p>Enable each day worked, enter the start and end time, then enter only unpaid break minutes. The calculator deducts each break and totals the enabled rows. When an end time is earlier than its start time, it is treated as an overnight shift ending the next day.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Regular hours and weekly overtime</h2>
        <p>The default overtime threshold is 40 hours per week. Change it when a different weekly threshold applies. This tool separates hours above that threshold, but it does not apply daily overtime, double time, pay rates or employer-specific rounding rules.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Related work-hour tools</h2>
        <p>For one shift, use the <Link href="/hours-calculator" style={{ color: 'var(--accent)' }}>hours calculator</Link>. You can also use the <Link href="/decimal-hours" style={{ color: 'var(--accent)' }}>decimal-hours converter</Link> or <Link href="/business-days-calculator" style={{ color: 'var(--accent)' }}>business-days calculator</Link>.</p>
      </section>
      <Faq items={faqs} />
    </main>
  )
}
