'use client'

import Link from 'next/link'

const tools = [
  { href: '/age-calculator', icon: '🎂', label: 'Age Calculator', desc: 'Exact age and next birthday' },
  { href: '/date-calculator', icon: '➕', label: 'Date Calculator', desc: 'Add or subtract dates' },
  { href: '/date-countdown', icon: '🎯', label: 'Date Countdown', desc: 'Count down to any event' },
  { href: '/business-days-calculator', icon: '💼', label: 'Business Days', desc: 'Count weekdays between dates' },
  { href: '/week-number', icon: '🗓️', label: 'Week Number', desc: 'Find the ISO week number' },
  { href: '/unix-timestamp', icon: '💻', label: 'Unix Timestamp', desc: 'Epoch time converter' },
  { href: '/timer',         icon: '⏲️', label: 'Timer',          desc: 'Countdown with sound' },
  { href: '/alarm',         icon: '⏰', label: 'Alarm',          desc: 'Browser alarms' },
  { href: '/pomodoro',      icon: '🍅', label: 'Pomodoro',       desc: '25/5 focus cycles' },
  { href: '/study-clock',   icon: '📚', label: 'Study Clock',    desc: 'Quiet deep-work timer' },
  { href: '/classroom-timer', icon: '🏫', label: 'Classroom Timer', desc: 'Fullscreen teacher timer' },
  { href: '/exam-timer', icon: '📝', label: 'Exam Timer', desc: 'Reading and test time' },
  { href: '/random-name-picker', icon: '🎯', label: 'Name Picker', desc: 'Fair student selection' },
  { href: '/meeting-timer', icon: '👥', label: 'Meeting Timer', desc: 'Countdown and cost estimate' },
  { href: '/hours-calculator', icon: '➗', label: 'Hours Calculator', desc: 'Time between two times' },
  { href: '/time-card-calculator', icon: '🗓️', label: 'Time Card', desc: 'Weekly work hours' },
  { href: '/interval-timer', icon: '🔁', label: 'Interval Timer', desc: 'HIIT, Tabata and rounds' },
  { href: '/stopwatch',     icon: '⏱️', label: 'Stopwatch',      desc: 'High-precision laps' },
  { href: '/chess-clock',   icon: '♟️', label: 'Chess Clock',    desc: 'Two-player dual orientation' },
  { href: '/worldclock',    icon: '🌍', label: 'World Clock',    desc: 'Any city, side-by-side' },
  { href: '/converter',     icon: '🔄', label: 'Time Converter', desc: 'Convert between zones' },
  { href: '/time-from-now', icon: '➕', label: 'Time From Now',  desc: 'Add minutes/hours' },
  { href: '/calendar',      icon: '📅', label: 'Calendar',       desc: 'Events & reminders' },
  { href: '/todo',          icon: '✅', label: 'Todo',           desc: 'Lightweight task list' },
  { href: '/education-tools', icon: '🎓', label: 'Education Tools', desc: 'Students and teachers' },
  { href: '/work-tools', icon: '💼', label: 'Work Tools', desc: 'Offices and remote teams' },
  { href: '/sun-moon', icon: '🌅', label: 'Sun & Moon', desc: 'Sunrise, sunset and moon phase' },
  { href: '/islamic-calendar', icon: '☪️', label: 'Islamic Calendar', desc: 'Hijri date and monthly calendar' },
  { href: '/holidays', icon: '🎉', label: 'Worldwide Holidays', desc: 'Public holidays by country' },
]

export default function ToolsGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
      {tools.map(t => (
        <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
          <div className="hover-lift" style={{
            padding: '1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '0.85rem',
          }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{t.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{t.desc}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
