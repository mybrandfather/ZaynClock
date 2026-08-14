import type { Metadata } from 'next'
import ExamTimerClient from './ExamTimerClient'
import AdSlot from '@/components/layout/AdSlot'
import EducationToolLinks from '@/components/features/EducationToolLinks'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Exam Timer – Free Full-Screen Online Test Clock',
  description: 'Free online exam timer with optional reading time, large countdown, current time, automatic finish time and instructions. Designed for projectors and smartboards.',
  alternates: { canonical: `${SITE_URL}/exam-timer` },
  keywords: 'exam timer, online exam timer, test timer, exam clock, classroom exam timer, full screen exam timer',
}

const faqs = [
  { q: 'Can I add separate reading time?', a: 'Yes. Enter optional reading time before the exam. ZaynClock automatically changes from the reading countdown to the exam countdown and sounds an alert.' },
  { q: 'Does the exam timer show the finishing time?', a: 'Yes. It displays the current clock time and calculated finish time alongside the countdown.' },
  { q: 'Can I add extra time during an exam?', a: 'Yes. Select “+5 minutes” while the timer is running or paused. The countdown and displayed finish time both update.' },
  { q: 'Does this work on a classroom projector?', a: 'Yes. Select Fullscreen after starting the timer for a large, high-contrast display suitable for projectors, smartboards and shared screens.' },
]

export default function ExamTimerPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Exam Timer',
          description: 'Free full-screen online exam timer with reading time and finish clock.',
          url: '/exam-timer',
          category: 'EducationalApplication',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Education Tools', url: '/education-tools' },
          { name: 'Exam Timer', url: '/exam-timer' },
        ]),
        faqSchema(faqs),
      ]} />

      <header style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 1.2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>
          Free Online Exam Timer
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Set reading time and exam length, show clear instructions, and keep the finishing time visible to every student.
        </p>
      </header>

      <ExamTimerClient />
      <AdSlot format="leaderboard" style={{ margin: '1.5rem 0 2rem' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
          A clearer test timer for students and invigilators
        </h2>
        <p>
          Students should not have to calculate how long remains or repeatedly ask when an assessment finishes.
          ZaynClock keeps the countdown, current clock and finish time together on one screen. Optional instructions
          remain visible below the timer, and the display turns red during the final five minutes.
        </p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', margin: '1.4rem 0 0.55rem' }}>
          How to run an exam timer
        </h2>
        <ol style={{ paddingLeft: '1.3rem' }}>
          <li>Enter the assessment name and total working time.</li>
          <li>Add reading time if students must review the paper before writing.</li>
          <li>Type any instructions that need to stay visible.</li>
          <li>Start the timer and switch to full-screen on the classroom display.</li>
          <li>Use pause or add five minutes only when exam rules require it.</li>
        </ol>
        <p>
          For everyday activities and station rotations, the simpler{' '}
          <a href="/classroom-timer" style={{ color: 'var(--accent)' }}>classroom countdown timer</a> is a better fit.
        </p>
      </section>

      <Faq items={faqs} />
      <EducationToolLinks exclude="/exam-timer" />
    </main>
  )
}
