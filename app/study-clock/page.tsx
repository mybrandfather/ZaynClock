import type { Metadata } from 'next'
import StudyClockClient from './StudyClockClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Study Clock – Free Online Study Timer for Students',
  description: '25 / 50 / 90 minute study sessions with a soft chime, minimal mode and session history. Built to help you actually finish that chapter.',
  alternates: { canonical: `${SITE_URL}/study-clock` },
}

const faqs = [
  { q: 'How long should a study session be?', a: 'Most students do well with 25 minutes (one Pomodoro), 50 minutes (a "study hour" with a 10-minute break), or 90 minutes for ultra-deep work. The Study Clock has all three as one-tap presets.' },
  { q: 'What is minimal mode?', a: 'Minimal mode hides everything except the time remaining so nothing on the screen distracts you. Toggle it from the settings panel inside the page.' },
  { q: 'Does it track my history?', a: 'Yes. Every completed session is saved in your browser, so you can see how many minutes you logged today, this week, or all-time.' },
  { q: 'Will the chime play if I&apos;m in another tab?', a: 'Yes — the timer keeps running and a soft chime plays when the session ends, even if the tab is in the background.' },
  { q: 'How is this different from the Pomodoro page?', a: 'The Pomodoro page enforces the 25/5 work/break cycle. The Study Clock is a single deep-work session with longer presets and a quieter UI.' },
]

export default function StudyClockPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Study Clock', description: 'Study timer with 25/50/90 presets.', url: '/study-clock' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Study Clock', url: '/study-clock' }]),
        faqSchema(faqs),
      ]} />
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>📚 STUDY CLOCK</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Quiet, distraction-free deep-work sessions. Pick 25, 50 or 90 minutes and go.
      </p>
      <StudyClockClient />

      <section style={{ padding: '2.5rem 0 1rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.6rem' }}>A study timer designed to disappear</h2>
        <p>
          Most study timers shout at you. Big buttons, ad banners, popups asking you to upgrade. The ZaynClock Study Clock
          does the opposite — once you start a session, the screen calms down to just the time remaining and a single
          progress ring, so the only signal in your peripheral vision is &quot;keep going.&quot;
        </p>
        <p>
          Three presets cover almost every studying scenario. <strong>25 minutes</strong> is the classic Pomodoro: short
          enough that even a tired brain can commit. <strong>50 minutes</strong> matches the rhythm of a university class
          and pairs nicely with a real 10-minute break. <strong>90 minutes</strong> aligns with the body&apos;s ultradian
          rhythm and is the sweet spot for ultra-deep work — finishing a problem set, drafting a long essay, or studying
          dense material.
        </p>
        <p>
          When the session ends, a soft chime plays and the day&apos;s progress is logged in your browser. Over time you
          build a quiet record of work done — useful for accountability, useful for motivation. If you want a stricter
          structure, try the <a style={{ color: 'var(--accent)' }} href="/pomodoro">Pomodoro Timer</a>; if you just need a
          quick countdown, use the <a style={{ color: 'var(--accent)' }} href="/timer">Timer</a>.
        </p>
      </section>

      <Faq items={faqs} />
    </div>
  )
}
