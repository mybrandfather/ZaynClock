import type { Metadata } from 'next'
import RandomNamePickerClient from './RandomNamePickerClient'
import AdSlot from '@/components/layout/AdSlot'
import EducationToolLinks from '@/components/features/EducationToolLinks'
import Faq from '@/components/seo/Faq'
import JsonLd, { breadcrumbSchema, faqSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Random Name Picker – Free Classroom Student Picker',
  description: 'Paste a class list and pick students fairly with this free random name picker for teachers. No login, no saved names, and optional no-repeat selection.',
  alternates: { canonical: `${SITE_URL}/random-name-picker` },
  keywords: 'random name picker, student name picker, classroom name picker, random student picker, teacher name picker, pick a random name',
}

const faqs = [
  { q: 'Does ZaynClock save student names?', a: 'No. Names remain only in the current browser tab. They are not uploaded, stored in an account or added to browser storage.' },
  { q: 'Can I prevent the same student being picked twice?', a: 'Yes. Keep “Remove each name after it is picked” selected. Every chosen name leaves the available pool until you reset.' },
  { q: 'Can I paste names from a spreadsheet?', a: 'Yes. Copy a column of names and paste it into the box. New lines and commas are both recognized.' },
  { q: 'Is the selection fair?', a: 'The picker uses the browser’s cryptographic random-number generator when available and rejection sampling to avoid modulo bias.' },
]

export default function RandomNamePickerPage() {
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Random Name Picker',
          description: 'Privacy-friendly random student name picker for classrooms.',
          url: '/random-name-picker',
          category: 'EducationalApplication',
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Education Tools', url: '/education-tools' },
          { name: 'Random Name Picker', url: '/random-name-picker' },
        ]),
        faqSchema(faqs),
      ]} />

      <header style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)', marginBottom: '0.45rem' }}>
          Random Name Picker for Teachers
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Paste your class list, choose whether names can repeat, and select students fairly—without creating an account.
        </p>
      </header>

      <RandomNamePickerClient />
      <AdSlot format="leaderboard" style={{ margin: '1.5rem 0 2rem' }} />

      <section style={{ maxWidth: 820, margin: '0 auto', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.35rem', marginBottom: '0.6rem' }}>
          Fair classroom participation without exposing a class list
        </h2>
        <p>
          Random selection gives every student the same chance to participate and removes the appearance of favoritism.
          This picker deliberately does not save the entered names, which makes it suitable for quick classroom use on a
          shared computer. When the tab closes, the list is gone.
        </p>
        <p>
          Use no-repeat mode for attendance checks, presentations or ensuring everyone answers once. Allow repeats for
          review games where every round should begin with the full class. Pair it with the{' '}
          <a href="/classroom-timer" style={{ color: 'var(--accent)' }}>classroom timer</a> for timed answers and activities.
        </p>
      </section>

      <Faq items={faqs} />
      <EducationToolLinks exclude="/random-name-picker" />
    </main>
  )
}
