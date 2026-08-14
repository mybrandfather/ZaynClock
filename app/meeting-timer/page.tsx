import type { Metadata } from 'next'
import MeetingTimerClient from './MeetingTimerClient'
import AdSlot from '@/components/layout/AdSlot'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Meeting Timer & Cost Calculator – Free Full-Screen Tool',
  description: 'Keep meetings on time with a full-screen countdown, final-minutes warning, outcome reminder and live estimated meeting cost. Free and private.',
  alternates: { canonical: `${SITE_URL}/meeting-timer` },
  keywords: 'meeting timer, online meeting timer, meeting cost calculator, presentation timer, conference timer, fullscreen meeting countdown',
}

const faqs = [
  { q: 'How is the estimated meeting cost calculated?', a: 'It multiplies attendee count by estimated average hourly cost and elapsed meeting time. The figure is an estimate, not payroll data.' },
  { q: 'Are the salary or attendee inputs saved?', a: 'No. The meeting cost inputs remain in the current page and are not saved or sent to ZaynClock.' },
  { q: 'Can I use this as a presentation timer?', a: 'Yes. Enter the presentation title and target outcome, set the duration and switch to Fullscreen. The display turns red at your chosen warning point.' },
  { q: 'Can I extend a meeting while it is running?', a: 'Yes. The +5 minutes control updates the active countdown immediately.' },
]

export default function MeetingTimerPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Meeting Timer and Cost Calculator',
          description: 'Full-screen meeting countdown with time warning and estimated people cost.',
          url: '/meeting-timer',
          category: 'BusinessApplication',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Work Tools', url: '/work-tools' },
          { name: 'Meeting Timer', url: '/meeting-timer' },
        ]),
        faqSchema(faqs),
      ]} />

      <header style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 1.2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>
          Meeting Timer &amp; Cost Calculator
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Put the outcome, time remaining and estimated people cost where everyone can see them.
        </p>
      </header>

      <MeetingTimerClient />
      <AdSlot format="leaderboard" style={{ margin: '1.5rem 0 2rem' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
          Make meeting time—and cost—visible
        </h2>
        <p>
          Meetings drift when the purpose and time limit disappear from view. This timer keeps both visible throughout
          the discussion and adds a configurable final-minutes warning. The optional cost estimate makes the combined
          time investment concrete without recording any names or salary data.
        </p>
        <p>
          Use it for stand-ups, client calls, workshops, interviews, presentations and conference sessions. For shift
          totals and timesheets, open the <a href="/time-card-calculator" style={{ color: 'var(--accent)' }}>time-card calculator</a>.
        </p>
      </section>

      <Faq items={faqs} />
    </main>
  )
}
