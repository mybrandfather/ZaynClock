'use client'

import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import SectionTabs from '@/components/layout/SectionTabs'
import { useTodos } from '@/lib/calendarStore'

export default function TodoClient() {
  const { todos, add, toggle, remove } = useTodos()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    add(title.trim(), date || undefined)
    setTitle(''); setDate('')
  }

  const filtered = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.done)
    if (filter === 'done') return todos.filter(t => t.done)
    return todos
  }, [todos, filter])

  const stats = useMemo(() => ({
    total: todos.length,
    done: todos.filter(t => t.done).length,
    active: todos.filter(t => !t.done).length,
  }), [todos])

  return (
    <>
      <SectionTabs />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Todo List</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        {stats.total === 0 ? 'No tasks yet — add one below.' : `${stats.active} active · ${stats.done} done`}.
        Tasks with a date show on your <a href="/calendar" style={{ color: 'var(--accent)' }}>calendar</a> automatically.
      </p>

      <Card hover={false}>
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.5rem' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What needs doing?" style={input} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={input} />
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>+ Add</button>
          </div>
        </form>
      </Card>

      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '1rem 0' }}>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid ' + (filter === f ? 'var(--accent)' : 'var(--border)'),
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
            {filter === 'done' ? 'No completed tasks yet.' : filter === 'active' ? 'All caught up! 🎉' : 'Add your first task above.'}
          </p>
        )}
        {filtered.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.6rem 0.75rem',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '0.6rem',
          }}>
            <button onClick={() => toggle(t.id)} aria-label={t.done ? 'Mark active' : 'Mark done'}
              style={{
                width: 22, height: 22, borderRadius: '50%',
                border: '2px solid ' + (t.done ? 'var(--accent)' : 'var(--border)'),
                background: t.done ? 'var(--accent)' : 'transparent',
                color: 'var(--bg-primary)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
              }}>{t.done ? '✓' : ''}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.92rem',
                textDecoration: t.done ? 'line-through' : 'none',
                opacity: t.done ? 0.6 : 1,
              }}>{t.title}</div>
              {t.date && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  📅 {new Date(t.date + 'T00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
            <button onClick={() => remove(t.id)} aria-label="Delete" className="btn-ghost" style={{ padding: '0.2rem 0.5rem' }}>✕</button>
          </div>
        ))}
      </div>
    </>
  )
}

const input: React.CSSProperties = {
  background: 'var(--bg-primary)',
  border: '1px solid var(--border)',
  borderRadius: '0.4rem',
  padding: '0.55rem 0.7rem',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
}
