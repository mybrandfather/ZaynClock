import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd, { breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Online Time Tools for Work and Offices',
  description: 'Free meeting timer, meeting cost calculator, hours calculator, time-card calculator, stopwatch, world clock and time-zone tools for offices and remote teams.',
  alternates: { canonical: `${SITE_URL}/work-tools` },
  keywords: 'office time tools, work hours calculator, meeting timer, time card calculator, work timer, remote team time tools',
}

const tools = [
  { href: '/meeting-timer', icon: '👥', title: 'Meeting Timer & Cost', description: 'Keep the outcome, deadline and estimated people cost visible.' },
  { href: '/hours-calculator', icon: '➗', title: 'Hours Calculator', description: 'Calculate time between two clock times and deduct breaks.' },
  { href: '/time-card-calculator', icon: '🗓️', title: 'Time Card Calculator', description: 'Total a full workweek in hours, minutes and decimal time.' },
  { href: '/stopwatch', icon: '⏱️', title: 'Stopwatch With Laps', description: 'Track tasks, presentations, tests or production cycles precisely.' },
  { href: '/worldclock', icon: '🌍', title: 'World Clock', description: 'See important office and client time zones side by side.' },
  { href: '/converter', icon: '🔄', title: 'Time Zone Converter', description: 'Convert a proposed meeting time between locations.' },
  { href: '/pomodoro', icon: '🍅', title: 'Focus Timer', description: 'Use structured focus and break cycles for individual work.' },
  { href: '/timer', icon: '⏲️', title: 'Countdown Timer', description: 'A flexible general-purpose timer with sound alerts.' },
]

export default function WorkToolsPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Work and Office Time Tools',
          description: 'Free browser-based timers, calculators and world-time tools for offices.',
          url: '/work-tools',
          category: 'BusinessApplication',
        }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Work Tools', url: '/work-tools' }]),
      ]} />

      <header style={{ maxWidth: 790, textAlign: 'center', margin: '0 auto 2rem' }}>
        <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>
          Work &amp; offices
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0.35rem 0 0.65rem' }}>
          Free Online Time Tools for Work
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Calculate work hours, control meetings, verify time cards and coordinate remote teams—without installing software.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.8rem' }}>
        {tools.map(tool => (
          <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className="card hover-lift" style={{ height: '100%' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.45rem' }}>{tool.icon}</div>
              <h2 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{tool.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.55 }}>{tool.description}</p>
            </article>
          </Link>
        ))}
      </div>

      <section className="card" style={{ maxWidth: 840, margin: '2.3rem auto 0', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.55rem' }}>Simple tools are easier to adopt</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          These tools are intentionally account-free. A team can open a meeting timer on a conference display, check
          weekly hours or convert a client’s time zone without onboarding, integrations or another subscription.
          Calculators provide estimates and should be checked against official workplace policies and records.
        </p>
      </section>
    </main>
  )
}
