import type { Metadata } from 'next'
import { Suspense } from 'react'
import TimerClient from './TimerClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Online Countdown Timer – Free, Beautiful & Fast',
  description: 'Free online countdown timer with hours, minutes and seconds. Perfect for cooking, study, workouts, meetings and any time-based task. Sound alerts, big display and zero clutter.',
  alternates: { canonical: `${SITE_URL}/timer` },
}

const faqs = [
  { q: 'Is this timer free to use?', a: 'Yes — every ZaynClock tool is 100% free, no signup, no app to install. Just open the page and start your timer.' },
  { q: 'Will it keep running if I switch tabs?', a: 'Yes. The timer is driven by a real timestamp, so leaving the tab or locking your screen does not slow it down. When you return, it shows the correct remaining time.' },
  { q: 'Can I get a sound when it ends?', a: 'Yes. A soft chime plays when the countdown finishes, and your browser will also flash a notification if you grant permission.' },
  { q: 'Can I run more than one timer at once?', a: 'Open the timer in a second browser tab — each tab keeps its own countdown.' },
  { q: 'What is a good timer length for studying?', a: 'Try 25 minutes (Pomodoro), 45 minutes for deep focus, or 90 minutes for ultra-deep work blocks. Our Study Clock at /study-clock has these as one-tap presets.' },
]

export default function TimerPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Countdown Timer', description: 'Free online countdown timer.', url: '/timer' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Timer', url: '/timer' }]),
        faqSchema(faqs),
      ]} />

      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>
        ⏲️ COUNTDOWN TIMER
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Set hours, minutes and seconds. Get a chime when it&apos;s done.
      </p>

      <Suspense fallback={<div style={{ minHeight: 200 }} />}>
        <TimerClient />
      </Suspense>

      <section style={{ padding: '2.5rem 0 1rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.6rem' }}>The simple online timer that just works</h2>
        <p>
          A great countdown timer should disappear into the task — that&apos;s the philosophy behind ZaynClock&apos;s timer.
          You set the duration, hit start, and a giant, glowing display tells you exactly how much time remains. There is
          nothing to download, nothing to sign up for, no popups, and no surprise paywalls. Open the tab, start the timer,
          and get on with the work.
        </p>
        <p>
          Use it as a kitchen timer, a workout interval timer, a meditation bell, a study session timer, a meeting
          time-keeper, or a homework limit for kids. The countdown is anchored to a real timestamp, which means it stays
          accurate even if your tab is in the background or your laptop sleeps for a few seconds — when you wake the
          screen, the timer reflects the true remaining time.
        </p>
        <p>
          Want something more focused? Try our <a style={{ color: 'var(--accent)' }} href="/pomodoro">Pomodoro Timer</a> for
          structured 25-minute work blocks, our <a style={{ color: 'var(--accent)' }} href="/study-clock">Study Clock</a> for
          long-form deep work, or our <a style={{ color: 'var(--accent)' }} href="/alarm">Alarm Clock</a> for time-of-day
          alerts. All of them are free and live forever in the browser tab.
        </p>
      </section>

      <Faq items={faqs} />
    </div>
  )
}
