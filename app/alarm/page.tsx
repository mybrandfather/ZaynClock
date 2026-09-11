import type { Metadata } from 'next'
import AlarmClient from './AlarmClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema } from '@/components/seo/JsonLd'
import styles from './alarm.module.css'

export const metadata: Metadata = {
  title: { absolute: 'Free Online Alarm Clock - Set Alarms in Your Browser | ZaynClock' },
  description: 'Set free browser alarms for any time with labels, sound choices, quick shortcuts, snooze, and local saving. Keep the browser and device awake to hear them.',
  alternates: { canonical: 'https://zaynclock.com/alarm' },
  openGraph: { url: 'https://zaynclock.com/alarm' },
}

const faqs = [
  { q: 'Will the alarm ring if my screen is locked?', a: 'The alarm rings as long as the browser tab is open and the device is not fully asleep. For mission-critical wake-ups, also set a backup alarm on your phone.' },
  { q: 'Can I set multiple alarms?', a: 'Yes, add as many as you like. Each one can have its own label and ring time, and they all run independently.' },
  { q: 'Are my alarms saved?', a: 'Yes. ZaynClock stores alarms locally in this browser, so they remain available after a refresh or when you reopen the page. Clearing browser storage removes them.' },
  { q: 'How do I stop an alarm?', a: 'When an alarm rings, choose Stop Alarm to silence it or Snooze 5 Minutes to schedule it again five minutes later.' },
  { q: 'Why use a browser alarm clock?', a: 'A browser alarm is convenient when you are already working, studying, cooking, or presenting on a computer. There is nothing to install or sign up for.' },
]

export default function AlarmPage() {
  return (
    <main className={styles.page}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Alarm', description: 'Free online alarm clock.', url: '/alarm' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Alarm', url: '/alarm' }]),
        faqSchema(faqs),
      ]} />
      <header className={styles.hero}><h1>Free Online Alarm Clock</h1><p>Set an alarm in your browser for any time. Simple, reliable, and free.</p></header>
      <AlarmClient />

      <section className={styles.content}>
        <h2>A free alarm clock that lives in your browser</h2>
        <p>
          ZaynClock&apos;s alarm is for the moments you don&apos;t want to fish around for your phone. Maybe you&apos;re cooking
          and want a 6:30pm reminder to take the lasagna out. Maybe you&apos;re working from home and need a hard stop at 5pm.
          Maybe you just want a quiet little pinger to tell you when to get up from the desk and stretch.
        </p>
        <p>
          Add an alarm, give it a label, and forget it. The page persists your alarms in this browser, so closing the tab
          and reopening it later is fine — they&apos;ll still be there. When the moment arrives, a soft chime plays and the
          alarm card clearly shows whether it is active and how long remains.
        </p>
        <p>
          Pair the alarm with our <a style={{ color: 'var(--accent)' }} href="/timer">Countdown Timer</a> for short tasks,
          our <a href="/pomodoro">Pomodoro Timer</a> for focus sessions, the <a href="/worldclock">World Clock</a> for
          international scheduling, or the <a href="/stopwatch">Stopwatch</a> when you need to measure elapsed time.
        </p>
        <p>
          Keep this page open and keep your browser and device awake when you need to hear an alarm. Browser alarms may not
          sound while a computer or phone is completely asleep, suspended, powered off, or when browser audio is blocked.
          Use a device alarm as a backup for anything critical.
        </p>
      </section>

      <Faq items={faqs} />
    </main>
  )
}
