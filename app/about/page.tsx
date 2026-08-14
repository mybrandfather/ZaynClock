import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about ZaynClock – the free, beautiful online clock and time tools platform.',
  alternates: { canonical: 'https://www.zaynclock.com/about' },
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--accent)' }}>
        About ZaynClock
      </h1>

      <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
          ZaynClock is a free, fast, and beautiful collection of online time tools built for everyone — from students and professionals to teams working across time zones.
        </p>

        <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem', margin: '1.5rem 0 0.5rem' }}>Our Tools</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          {[
            ['/', '🕐 Digital Clock', 'Current time in any time zone, fully customizable'],
            ['/pomodoro', '🍅 Pomodoro Timer', '25/5 focus sessions with session tracking'],
            ['/stopwatch', '⏱️ Stopwatch', 'Precision timing with lap tracking'],
            ['/worldclock', '🌍 World Clock', 'See current time in cities worldwide'],
            ['/converter', '🔄 Time Converter', 'Convert any time between supported time zones'],
          ].map(([href, name, desc]) => (
            <li key={href} style={{ marginBottom: '0.5rem' }}>
              <Link href={href} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>{name}</Link>
              {' – '}{desc}
            </li>
          ))}
        </ul>

        <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem', margin: '1.5rem 0 0.5rem' }}>Our Values</h2>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Free forever.</strong> All ZaynClock tools are free to use. We're ad-supported, which keeps the lights on while keeping everything accessible.
        </p>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Privacy-minded.</strong> Core preferences and planning data are stored locally in your browser. Optional weather, notifications and advertising are explained in our privacy policy.
        </p>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Fast & lightweight.</strong> ZaynClock is built with Next.js and optimized to load in under a second on any connection.
        </p>

        <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem', margin: '1.5rem 0 0.5rem' }}>Contact</h2>
        <p>Have a suggestion, bug report, or partnership inquiry? Reach us at <a href="mailto:hello@zaynclock.com" style={{ color: 'var(--accent)' }}>hello@zaynclock.com</a> or visit our <Link href="/contact" style={{ color: 'var(--accent)' }}>contact page</Link>.</p>
      </div>
    </div>
  )
}
