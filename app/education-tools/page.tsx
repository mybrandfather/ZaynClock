import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd, { breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Online Tools for Students and Teachers',
  description: 'Free classroom timer, exam timer, study clock, random student name picker, calendar and planning tools for students, teachers and classrooms.',
  alternates: { canonical: `${SITE_URL}/education-tools` },
  keywords: 'tools for teachers, tools for students, classroom tools, online teaching tools, study tools, teacher timer, student timer',
}

const teacherTools = [
  { href: '/classroom-timer', icon: '🏫', title: 'Classroom Timer', description: 'Project a large visual countdown for activities, transitions and group work.' },
  { href: '/exam-timer', icon: '📝', title: 'Exam Timer', description: 'Run reading time and test time with a visible finishing clock.' },
  { href: '/random-name-picker', icon: '🎯', title: 'Random Name Picker', description: 'Choose students fairly without saving or uploading the class list.' },
  { href: '/hours-calculator', icon: '➗', title: 'Hours Calculator', description: 'Calculate tutoring, class, planning or professional-development hours.' },
]

const studentTools = [
  { href: '/study-clock', icon: '📚', title: 'Study Timer', description: 'Focused 25, 50 or 90-minute sessions with private progress history.' },
  { href: '/pomodoro', icon: '🍅', title: 'Pomodoro Timer', description: 'Alternate focused work and restorative breaks automatically.' },
  { href: '/calendar', icon: '📅', title: 'Assignment Calendar', description: 'Record exam dates, due dates, study blocks and reminders locally.' },
  { href: '/todo', icon: '✅', title: 'Homework List', description: 'A lightweight task list with due dates and no required account.' },
]

function ToolGrid({ tools }: { tools: typeof teacherTools }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
      {tools.map(tool => (
        <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none', color: 'inherit' }}>
          <article className="card hover-lift" style={{ height: '100%' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.45rem' }}>{tool.icon}</div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>{tool.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.55 }}>{tool.description}</p>
          </article>
        </Link>
      ))}
    </div>
  )
}

export default function EducationToolsPage() {
  return (
    <main style={{ maxWidth: 1050, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({
          name: 'ZaynClock Education Tools',
          description: 'Free browser-based time and classroom tools for students and teachers.',
          url: '/education-tools',
          category: 'EducationalApplication',
        }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Education Tools', url: '/education-tools' }]),
      ]} />

      <header style={{ maxWidth: 780, textAlign: 'center', margin: '0 auto 2rem' }}>
        <p style={{ color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>
          School &amp; study
        </p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0.35rem 0 0.65rem' }}>
          Free Online Tools for Students and Teachers
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Practical classroom and study tools that open instantly, work on Chromebooks and projectors, and require no account.
        </p>
      </header>

      <section style={{ marginBottom: '2.3rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.9rem' }}>For teachers and classrooms</h2>
        <ToolGrid tools={teacherTools} />
      </section>

      <section style={{ marginBottom: '2.3rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.9rem' }}>For students and independent study</h2>
        <ToolGrid tools={studentTools} />
      </section>

      <section className="card" style={{ maxWidth: 840, margin: '0 auto', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.55rem' }}>Built for shared school devices</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Core tools run in the browser without student accounts. The random picker does not save names, while personal
          calendars, tasks and study history remain in that browser’s local storage. Teachers should avoid entering
          sensitive student information on any shared display.
        </p>
      </section>
    </main>
  )
}
