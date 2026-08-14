import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ClockSection from '@/components/features/ClockSection'
import HolidayCountdown from '@/components/features/HolidayCountdown'
import QuickActions from '@/components/features/QuickActions'
import PopularTools from '@/components/features/PopularTools'
import AdSlot from '@/components/layout/AdSlot'
import JsonLd, {
  breadcrumbSchema, softwareAppSchema, SITE_URL,
} from '@/components/seo/JsonLd'

const WeatherWidget = dynamic(() => import('@/components/features/WeatherWidget'), {
  loading: () => (
    <div className="card" style={{ minHeight: 120, padding: '1.25rem' }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading weather…</p>
    </div>
  ),
})

export const metadata: Metadata = {
  title: { absolute: 'ZaynClock – Free Online Clock, Timer, Alarm & World Time Tools' },
  description: 'Free online clock and time tools: classroom and exam timers, hours and time-card calculators, meeting timer, Pomodoro, alarm, stopwatch, world clock and more.',
  alternates: { canonical: SITE_URL + '/' },
  keywords: 'online clock, classroom timer, exam timer, hours calculator, time card calculator, meeting timer, study timer, world clock, stopwatch',
}

const blogPreviews = [
  { slug: 'classroom-timer-ideas-for-teachers', title: '12 Classroom Timer Ideas for Teachers', emoji: '🏫' },
  { slug: 'study-timer-methods-for-exams', title: 'Study Timer Methods for Exam Prep', emoji: '📚' },
  { slug: 'how-to-run-shorter-meetings', title: 'How to Run Shorter Meetings', emoji: '👥' },
  { slug: 'what-is-pomodoro-technique',      title: 'What Is the Pomodoro Technique?',         emoji: '🍅' },
  { slug: 'how-to-use-online-countdown-timer', title: 'How to Use an Online Countdown Timer',    emoji: '⏲️' },
  { slug: 'world-time-zones-explained',       title: 'World Time Zones Explained',              emoji: '🌍' },
]

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock', description: 'Free online clock and time tools.', url: '/' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }]),
      ]} />

      {/* 1. Main clock + centered presets + fullscreen weather */}
      <ClockSection />

      {/* 2. Advertisement */}
      <AdSlot format="leaderboard" style={{ marginBottom: '1.75rem' }} />

      {/* 3. Tool / info cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        maxWidth: 980,
        margin: '0 auto 2rem',
      }}>
        <WeatherWidget />
        <HolidayCountdown />
        <QuickActions />
      </div>

      {/* 4. Popular tool cards */}
      <div style={{ marginBottom: '2.5rem' }}>
        <PopularTools />
      </div>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        maxWidth: 980,
        margin: '0 auto 2.5rem',
      }}>
        <Link href="/education-tools" className="card hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.45rem' }}>🎓</div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Tools for Students &amp; Teachers</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
            Classroom timers, exam clocks, study sessions, planning and a private random name picker.
          </p>
        </Link>
        <Link href="/work-tools" className="card hover-lift" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.45rem' }}>💼</div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Time Tools for Work</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.55 }}>
            Meeting timer, hours and time-card calculators, world clocks and remote-team scheduling.
          </p>
        </Link>
      </section>

      <AdSlot format="rectangle" style={{ marginBottom: '2.5rem' }} />

      {/* 5. SEO copy */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '0.5rem 0 1.5rem' }}>
        <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
          The free online clock that does everything time-related
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.9rem' }}>
          ZaynClock is a single beautifully-built website for everything you ever needed to do with time. The home page
          shows a giant customizable clock with Neon 3D, orbit dial, classic digital and analog styles that follows your timezone and your 12h / 24h preference. Two clicks change the
          accent color. One click goes fullscreen. Everything you tweak is saved in your browser, so the next time you
          open the page it looks exactly the way you left it.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '0.9rem' }}>
          Beyond the clock you get a full suite of free tools: a <Link style={{ color: 'var(--accent)' }} href="/timer">countdown timer</Link>,
          a <Link style={{ color: 'var(--accent)' }} href="/alarm">browser alarm</Link>,
          a <Link style={{ color: 'var(--accent)' }} href="/pomodoro"> Pomodoro timer</Link>, a quiet
          <Link style={{ color: 'var(--accent)' }} href="/study-clock"> study clock</Link> with 25 / 50 / 90 minute presets, a
          high-precision <Link style={{ color: 'var(--accent)' }} href="/stopwatch">stopwatch with laps</Link>, a mobile-friendly
          <Link style={{ color: 'var(--accent)' }} href="/chess-clock"> chess clock</Link> with three layout modes, a
          <Link style={{ color: 'var(--accent)' }} href="/worldclock"> world clock</Link> for any city,
          a <Link style={{ color: 'var(--accent)' }} href="/converter">time zone converter</Link>, a
          <Link style={{ color: 'var(--accent)' }} href="/time-from-now"> time-from-now calculator</Link>, a
          <Link style={{ color: 'var(--accent)' }} href="/calendar"> monthly calendar</Link> and a clean
          <Link style={{ color: 'var(--accent)' }} href="/todo"> todo list</Link> that links to it. Teachers can project a
          <Link style={{ color: 'var(--accent)' }} href="/classroom-timer"> classroom timer</Link> or run a formal
          <Link style={{ color: 'var(--accent)' }} href="/exam-timer"> exam timer</Link>. Office users can calculate
          <Link style={{ color: 'var(--accent)' }} href="/hours-calculator"> hours between two times</Link>, total a
          <Link style={{ color: 'var(--accent)' }} href="/time-card-calculator"> weekly time card</Link>, or keep a
          <Link style={{ color: 'var(--accent)' }} href="/meeting-timer"> meeting and its estimated cost</Link> visible.
        </p>
      </section>

      {/* 6. Blog CTA — replaces FAQ */}
      <section style={{ maxWidth: 820, margin: '0 auto 3rem' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '1.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                📝 Time Tips &amp; Guides
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Practical articles on productivity, time tools, and getting the most from ZaynClock.
              </p>
            </div>
            <Link href="/blog"
              className="hover-fade"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1.2rem', borderRadius: '0.5rem',
                background: 'var(--accent)', color: 'var(--bg-primary)',
                fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              View all posts →
            </Link>
          </div>

          {/* 4 preview cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '0.75rem',
          }}>
            {blogPreviews.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="hover-lift"
                style={{
                  display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  padding: '0.9rem', borderRadius: '0.65rem',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-primary)',
                  textDecoration: 'none', color: 'var(--text-primary)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{post.emoji}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.4 }}>{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
