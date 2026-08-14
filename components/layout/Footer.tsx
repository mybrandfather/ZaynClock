import Link from 'next/link'

const linkStyle = { display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.25rem' } as const

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border)',
      padding: '2rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '0.75rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}<img src="/zaynclock-logo.png" alt="ZaynClock" width="160" height="40" style={{ width: 'auto', height: 40, display: 'block' }} />
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Free, customizable clock and time tools for everyone. No account required.
            </p>
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Clocks</p>
            {[
              ['/', 'Neon, Digital & Analog Clock'],
              ['/worldclock', 'World Clock'],
              ['/converter', 'Time Zone Converter'],
              ['/time-from-now', 'Time From Now'],
              ['/sun-moon', 'Sun & Moon Today'],
            ].map(([href, label]) => <Link key={href} href={href} style={linkStyle}>{label}</Link>)}
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Timers & Planning</p>
            {[
              ['/timer', 'Countdown Timer'],
              ['/alarm', 'Alarm Clock'],
              ['/pomodoro', 'Pomodoro Timer'],
              ['/interval-timer', 'Interval Timer'],
              ['/study-clock', 'Study Clock'],
              ['/stopwatch', 'Stopwatch'],
              ['/chess-clock', 'Chess Clock'],
              ['/calendar', 'Calendar'],
              ['/todo', 'Todo List'],
              ['/islamic-calendar', 'Islamic Calendar'],
              ['/holidays', 'Worldwide Holidays'],
            ].map(([href, label]) => <Link key={href} href={href} style={linkStyle}>{label}</Link>)}
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>School &amp; Work</p>
            {[
              ['/education-tools', 'Student & Teacher Tools'],
              ['/classroom-timer', 'Classroom Timer'],
              ['/exam-timer', 'Exam Timer'],
              ['/random-name-picker', 'Random Name Picker'],
              ['/work-tools', 'Office & Work Tools'],
              ['/meeting-timer', 'Meeting Timer'],
              ['/hours-calculator', 'Hours Calculator'],
              ['/time-card-calculator', 'Time Card Calculator'],
              ['/business-days-calculator', 'Business Days Calculator'],
              ['/age-calculator', 'Age Calculator'],
              ['/date-calculator', 'Date Calculator'],
              ['/date-countdown', 'Date Countdown'],
              ['/week-number', 'Week Number'],
              ['/unix-timestamp', 'Unix Timestamp'],
            ].map(([href, label]) => <Link key={href} href={href} style={linkStyle}>{label}</Link>)}
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>ZaynClock</p>
            {[
              ['/tools', 'All Tools'],
              ['/blog', 'Blog'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
              ['/privacy', 'Privacy Policy'],
              ['/terms', 'Terms of Use'],
              ['/disclaimer', 'Disclaimer'],
              ['/credits', 'Credits & Licenses'],
            ].map(([href, label]) => <Link key={href} href={href} style={linkStyle}>{label}</Link>)}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>© {new Date().getFullYear()} ZaynClock. All rights reserved.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>Terms</Link>
            <Link href="/disclaimer" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>Disclaimer</Link>
            <Link href="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
