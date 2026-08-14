import type { Metadata } from 'next'
import SectionTabs from '@/components/layout/SectionTabs'
import ToolsGrid from './ToolsGrid'
import JsonLd, { breadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Online Time Tools',
  description: 'Every ZaynClock tool in one place: timers, clocks, classroom tools, exam timer, hours and time-card calculators, meeting timer, planning and world time.',
  alternates: { canonical: SITE_URL + '/tools' },
  keywords: 'time tools, online timer, classroom timer, exam timer, hours calculator, time card calculator, meeting timer, world clock',
}

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Tools', url: '/tools' }])]} />
      <SectionTabs />
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>All Free Time Tools</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Clocks, calculators and timers for everyday life, school and work. Every tool is free and runs in your browser.
      </p>
      <ToolsGrid />
    </div>
  )
}
