import type { Metadata } from 'next'
import ClassroomTimerClient from './ClassroomTimerClient'
import AdSlot from '@/components/layout/AdSlot'
import EducationToolLinks from '@/components/features/EducationToolLinks'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Classroom Timer – Free Full-Screen Timer for Teachers',
  description: 'Free classroom timer for teachers. Project a large visual countdown for lessons, tests, transitions, group work and brain breaks. No login or download.',
  alternates: { canonical: `${SITE_URL}/classroom-timer` },
  keywords: 'classroom timer, online classroom timer, timer for teachers, visual classroom timer, full screen classroom timer, classroom countdown',
}

const faqs = [
  { q: 'Is this classroom timer free?', a: 'Yes. The ZaynClock Classroom Timer is free, requires no account and runs directly in a modern browser.' },
  { q: 'Can I display it on a projector or smartboard?', a: 'Yes. Open the timer on the classroom computer and select Fullscreen. Its high-contrast countdown is designed to be readable across a classroom.' },
  { q: 'What classroom activities can I time?', a: 'Teachers commonly use it for warm-ups, station rotations, independent work, quizzes, presentations, brain breaks, clean-up and transitions.' },
  { q: 'Does the timer store student information?', a: 'No student names or accounts are needed. The activity label stays in the open browser tab and is not sent to ZaynClock.' },
]

export default function ClassroomTimerPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Classroom Timer',
          description: 'Free full-screen visual classroom countdown timer for teachers and students.',
          url: '/classroom-timer',
          category: 'EducationalApplication',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Education Tools', url: '/education-tools' },
          { name: 'Classroom Timer', url: '/classroom-timer' },
        ]),
        faqSchema(faqs),
      ]} />

      <header style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>
          Free Online Classroom Timer
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          A large, calm countdown for lessons, tests, transitions and group work. Add an activity name, choose the time and project it full-screen.
        </p>
      </header>

      <ClassroomTimerClient />
      <AdSlot format="leaderboard" style={{ margin: '1.5rem 0 2rem' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
          A visual timer students can read from across the room
        </h2>
        <p>
          A visible end point helps a class understand how much working time remains without repeated verbal reminders.
          Use the activity label to show exactly what students should be doing, then choose a preset or enter a custom
          time. The progress bar makes elapsed time understandable even for younger learners who do not yet read a
          digital clock confidently.
        </p>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', margin: '1.4rem 0 0.55rem' }}>
          Practical classroom timer ideas
        </h2>
        <ul style={{ paddingLeft: '1.3rem' }}>
          <li><strong>1–3 minutes:</strong> think time, quick tidy-up or lining up.</li>
          <li><strong>5–10 minutes:</strong> warm-ups, exit tickets and partner discussion.</li>
          <li><strong>15–20 minutes:</strong> station rotations, silent reading and independent practice.</li>
          <li><strong>30–60 minutes:</strong> tests, extended writing and project work.</li>
        </ul>
        <p>
          For formal assessments with separate reading time and a visible finishing clock, use the{' '}
          <a href="/exam-timer" style={{ color: 'var(--accent)' }}>free online exam timer</a>.
        </p>
      </section>

      <Faq items={faqs} />
      <EducationToolLinks exclude="/classroom-timer" />
    </main>
  )
}
