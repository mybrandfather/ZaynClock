import type { Metadata } from 'next'
import CalendarClient from './CalendarClient'
import JsonLd, { breadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Online Calendar',
  description: 'Free monthly calendar with events, appointments and reminders. Tasks with dates from the ZaynClock todo list show up automatically.',
  alternates: { canonical: SITE_URL + '/calendar' },
  keywords: 'calendar, monthly calendar, planner, events, reminders, appointments',
}

export default function CalendarPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Calendar', url: '/calendar' }])]} />
      <CalendarClient />
    </div>
  )
}
