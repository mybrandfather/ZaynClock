import type { Metadata } from 'next'
import Link from 'next/link'
import TimeCardCalculatorClient from './TimeCardCalculatorClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Time Card Calculator – Hours, Breaks & Overtime',
  description: 'Calculate work hours from clock-in and clock-out times. Deduct breaks, total regular and overtime hours, estimate pay, print or export your time card free.',
  alternates: { canonical: `${SITE_URL}/time-card-calculator` },
  openGraph: { title: 'Free Time Card Calculator – Hours, Breaks & Overtime', description: 'Total weekly work hours, breaks, split or overnight shifts, overtime and estimated pay.', url: `${SITE_URL}/time-card-calculator` },
}

const faqs = [
  { q: 'How does the weekly time card calculator work?', a: 'Enable each day worked, enter its start and end time, and add any unpaid break. Daily, regular, overtime and weekly totals update immediately.' },
  { q: 'Can it calculate an overnight shift?', a: 'Yes. When an end time is earlier than its start time, the calculator treats the end as occurring the following day and marks the row +1d.' },
  { q: 'Can I change the weekly overtime threshold?', a: 'Yes. The default threshold is 40 hours, but you can set the weekly threshold required by your workplace or jurisdiction.' },
  { q: 'Can I print or export my time card?', a: 'Yes. Use Print time card for a printer-friendly result or Export CSV for a spreadsheet-compatible file.' },
  { q: 'Can I use this as an official payroll record?', a: 'Use it to estimate and verify hours, but compare the result with your employer’s records and applicable break, rounding and overtime rules.' },
  { q: 'Is a time card calculator the same as a punch clock calculator?', a: 'Both total time between clock-in and clock-out punches. This calculator also deducts unpaid breaks, handles split and overnight shifts, and separates weekly regular and overtime hours.' },
  { q: 'How are minutes converted to decimal hours?', a: 'Minutes are divided by 60. For example, 30 minutes is 0.50 hours, 15 minutes is 0.25 hours, and 45 minutes is 0.75 hours.' },
  { q: 'Can I enter two shifts on the same day?', a: 'Yes. Turn on “Add a second shift each day” to enter a second clock-in and clock-out period for split shifts.' },
  { q: 'How is estimated gross pay calculated?', a: 'Regular hours are multiplied by the hourly rate. Overtime hours are multiplied by the hourly rate and your chosen overtime multiplier. It is an estimate before taxes or deductions.' },
  { q: 'Does this calculator round employee punches?', a: 'No. It uses the exact times entered and does not apply employer-specific rounding rules.' },
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
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>Free Time Card Calculator</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Enter your daily clock-in and clock-out times to calculate hours worked, unpaid breaks, regular hours, overtime and estimated gross pay.</p>
      </header>
      <TimeCardCalculatorClient />
      <section style={{ maxWidth: 840, margin: '2rem auto 0', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem' }}>How to use this online time card</h2>
        <ol>
          <li>Check each day worked and enter the first clock-in and clock-out time.</li>
          <li>Enter unpaid break minutes, or enable a second daily shift when you have two separate work periods.</li>
          <li>Adjust the weekly overtime threshold if your workplace does not use 40 hours.</li>
          <li>Optionally enter an hourly rate to estimate gross regular and overtime pay.</li>
          <li>Print the completed card or export its rows and totals to CSV.</li>
        </ol>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>How hours worked are calculated</h2>
        <p>For each enabled day, the calculator subtracts clock-in from clock-out, adds a second work period when entered, and then deducts the unpaid break. Daily net minutes are added for the weekly total. Decimal hours equal total minutes divided by 60, so 7 hours 30 minutes becomes 7.50 hours.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Regular hours and weekly overtime</h2>
        <p>The default overtime threshold is 40 hours per week. Hours up to the threshold are regular; hours above it are overtime. When you enter a pay rate, estimated gross pay equals regular hours × hourly rate plus overtime hours × hourly rate × overtime multiplier. The tool does not calculate taxes, daily overtime, double time or employer-specific rounding.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Worked time-card examples</h2>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>Standard shift with a lunch break</h3>
        <p>A 9:00 AM–5:00 PM shift is 8 hours. After a 30-minute unpaid lunch, the result is 7 hours 30 minutes, or 7.50 decimal hours.</p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>Overnight shift</h3>
        <p>A 10:00 PM–6:00 AM shift crosses midnight and lasts 8 hours. After a 30-minute unpaid break, the result is 7 hours 30 minutes.</p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>Weekly overtime and estimated pay</h3>
        <p>For 45 hours at $20 per hour with a 40-hour threshold and 1.5× overtime rate, the estimate is $800 regular pay plus $150 overtime pay, or $950 before taxes and deductions.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Common time-card mistakes</h2>
        <p>Enter only unpaid breaks, check AM/PM carefully, and treat an end time earlier than its start as an overnight shift. Do not assume every workplace uses the same rounding or overtime rules. Compare the result with official records before using it for payroll.</p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', marginTop: '1.4rem' }}>Related work-hour tools</h2>
        <p>For one shift, use the <Link href="/hours-calculator" style={{ color: 'var(--accent)' }}>hours worked calculator</Link>. Browse all <Link href="/work-tools" style={{ color: 'var(--accent)' }}>work and office time tools</Link>, or use the <Link href="/business-days-calculator" style={{ color: 'var(--accent)' }}>business-days calculator</Link> for date-based planning.</p>
        <p style={{ fontSize: '0.86rem' }}>Calculations run in your browser and the time-card entries are not sent to ZaynClock. Method and examples reviewed September 9, 2026. Found a calculation problem? <Link href="/contact" style={{ color: 'var(--accent)' }}>Report it to ZaynClock</Link>.</p>
      </section>
      <Faq items={faqs} />
    </main>
  )
}
