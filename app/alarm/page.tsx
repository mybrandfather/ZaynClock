import type { Metadata } from 'next'
import AlarmClient from './AlarmClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Online Alarm Clock – Set Alarms in Your Browser',
  description: 'Set one or more alarms by time of day. Soft chime, custom labels, repeats. No download needed — just keep the tab open.',
  alternates: { canonical: `${SITE_URL}/alarm` },
}

const faqs = [
  { q: 'Will the alarm ring if my screen is locked?', a: 'The alarm rings as long as the browser tab is open and the device is not fully asleep. For mission-critical wake-ups, also set a backup alarm on your phone.' },
  { q: 'Can I set multiple alarms?', a: 'Yes, add as many as you like. Each one can have its own label and ring time, and they all run independently.' },
  { q: 'Will my alarms be saved?', a: 'Yes — alarms are stored in your browser. The next time you open the page, they will still be there.' },
  { q: 'How do I stop an alarm that is ringing?', a: 'Click the Snooze or Dismiss button on the alarm card. Snooze re-rings the alarm in 5 minutes.' },
  { q: 'Why a browser alarm?', a: 'No installs, no permissions to dig through, no battery drain. Just a tab that quietly rings when the time comes.' },
]

export default function AlarmPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Alarm', description: 'Free online alarm clock.', url: '/alarm' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Alarm', url: '/alarm' }]),
        faqSchema(faqs),
      ]} />
      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>⏰ ALARM CLOCK</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Set as many alarms as you need. Keep the tab open and it will ring on time.
      </p>
      <AlarmClient />

      <section style={{ padding: '2.5rem 0 1rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.6rem' }}>A free alarm clock that lives in your browser</h2>
        <p>
          ZaynClock&apos;s alarm is for the moments you don&apos;t want to fish around for your phone. Maybe you&apos;re cooking
          and want a 6:30pm reminder to take the lasagna out. Maybe you&apos;re working from home and need a hard stop at 5pm.
          Maybe you just want a quiet little pinger to tell you when to get up from the desk and stretch.
        </p>
        <p>
          Add an alarm, give it a label, and forget it. The page persists your alarms in this browser, so closing the tab
          and reopening it later is fine — they&apos;ll still be there. When the moment arrives, a soft chime plays and the
          alarm card highlights so you can&apos;t miss it.
        </p>
        <p>
          Pair the alarm with our <a style={{ color: 'var(--accent)' }} href="/timer">Countdown Timer</a> for short tasks,
          our <a style={{ color: 'var(--accent)' }} href="/pomodoro">Pomodoro</a> for focus sessions, and the
          <a style={{ color: 'var(--accent)' }} href="/worldclock"> World Clock</a> for international scheduling.
        </p>
      </section>

      <Faq items={faqs} />
    </div>
  )
}
