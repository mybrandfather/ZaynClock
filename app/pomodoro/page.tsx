import type { Metadata } from 'next'
import PomodoroClient from './PomodoroClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Pomodoro Timer – Free Online 25/5 Focus Timer',
  description: 'Free online Pomodoro timer with custom durations, browser notifications, and a daily session counter. Beat procrastination one tomato at a time.',
  alternates: { canonical: SITE_URL + '/pomodoro' },
}

const faqs = [
  { q: 'What is the Pomodoro Technique?', a: 'A time-management method by Francesco Cirillo: work for 25 focused minutes (a "Pomodoro"), take a 5-minute break, and after four Pomodoros take a longer 15–30 minute break.' },
  { q: 'Can I change the durations?', a: 'Yes — open the "Custom Durations" panel and set any focus, short break or long break length from 1 to 120 minutes.' },
  { q: 'Will I get a notification when a session ends?', a: 'Yes, if you allow browser notifications. Otherwise the page just visually switches and shows the next mode.' },
  { q: 'Why 25 minutes specifically?', a: 'Cirillo found that 25 minutes is short enough that almost anyone can commit to a single focused block, even when motivation is low — yet long enough to actually make progress.' },
  { q: 'How is this different from the Study Clock?', a: 'The Pomodoro alternates work / break automatically. The Study Clock is a single longer deep-work session (25/50/90 min) with no enforced break.' },
]

export default function Page() {
  return (
    <>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Pomodoro Timer', description: 'Free online Pomodoro 25/5 timer.', url: '/pomodoro' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Pomodoro', url: '/pomodoro' }]),
        faqSchema(faqs),
      ]} />
      <PomodoroClient />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <Faq items={faqs} />
      </div>
    </>
  )
}
