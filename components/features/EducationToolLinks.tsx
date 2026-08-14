import Link from 'next/link'

const educationTools = [
  { href: '/classroom-timer', icon: '🏫', label: 'Classroom Timer', description: 'Projectable timer for lessons and transitions' },
  { href: '/exam-timer', icon: '📝', label: 'Exam Timer', description: 'Reading time, exam time and finish clock' },
  { href: '/study-clock', icon: '📚', label: 'Study Timer', description: '25, 50 and 90-minute focus sessions' },
  { href: '/hours-calculator', icon: '➗', label: 'Hours Calculator', description: 'Time between two times, minus breaks' },
  { href: '/random-name-picker', icon: '🎯', label: 'Random Name Picker', description: 'Fair classroom participation picker' },
]

export default function EducationToolLinks({ exclude }: { exclude?: string }) {
  const tools = educationTools.filter(tool => tool.href !== exclude)

  return (
    <section aria-labelledby="related-education-tools" style={{ marginTop: '2.5rem' }}>
      <h2 id="related-education-tools" style={{ fontSize: '1.2rem', marginBottom: '0.85rem' }}>
        More free tools for students and teachers
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
        {tools.map(tool => (
          <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="hover-lift" style={{
              height: '100%',
              padding: '1rem',
              border: '1px solid var(--border)',
              borderRadius: '0.8rem',
              background: 'var(--bg-card)',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{tool.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{tool.label}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem', lineHeight: 1.45 }}>
                {tool.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
