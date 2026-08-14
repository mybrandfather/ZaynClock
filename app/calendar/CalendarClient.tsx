'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import SectionTabs from '@/components/layout/SectionTabs'
import { useEvents, useTodos, dateKey, EventType, CalEvent } from '@/lib/calendarStore'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TYPE_LABEL: Record<EventType, { label: string; color: string; emoji: string }> = {
  general:     { label: 'General',     color: '#3b82f6', emoji: '📌' },
  appointment: { label: 'Appointment', color: '#a855f7', emoji: '🩺' },
  reminder:    { label: 'Reminder',    color: '#f59e0b', emoji: '🔔' },
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(1 - first.getDay())
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

export default function CalendarClient() {
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState<string | null>(dateKey(today))
  const { events, add, remove } = useEvents()
  const { todos } = useTodos()

  const days = useMemo(() => buildGrid(view.year, view.month), [view])
  const todosByDate = useMemo(() => {
    const m: Record<string, typeof todos> = {}
    todos.filter(t => t.date).forEach(t => {
      m[t.date!] = m[t.date!] || []
      m[t.date!].push(t)
    })
    return m
  }, [todos])
  const eventsByDate = useMemo(() => {
    const m: Record<string, CalEvent[]> = {}
    events.forEach(e => {
      m[e.date] = m[e.date] || []
      m[e.date].push(e)
    })
    return m
  }, [events])

  const monthLabel = new Date(view.year, view.month).toLocaleString(undefined, { month: 'long', year: 'numeric' })
  const todayKey = dateKey(today)

  const goPrev = () => {
    const d = new Date(view.year, view.month - 1, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }
  const goNext = () => {
    const d = new Date(view.year, view.month + 1, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }
  const goToday = () => {
    const t = new Date()
    setView({ year: t.getFullYear(), month: t.getMonth() })
    setSelected(dateKey(t))
  }

  const selDate = selected
  const selEvents = selDate ? eventsByDate[selDate] || [] : []
  const selTodos = selDate ? todosByDate[selDate] || [] : []

  return (
    <>
      <SectionTabs />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Calendar</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
        Plan your month. Click any day to add events, or to see tasks with that date from your <a href="/todo" style={{ color: 'var(--accent)' }}>todo list</a>.
      </p>
      <nav aria-label="Calendar type" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span className="btn-primary" aria-current="page">Gregorian Calendar</span>
        <Link href="/islamic-calendar" className="btn-ghost" style={{ textDecoration: 'none' }}>Islamic Calendar</Link>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,340px)', gap: '1rem' }}
        className="cal-grid">
        <Card hover={false}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button className="btn-ghost" onClick={goPrev} aria-label="Previous month" style={{ padding: '0.35rem 0.7rem' }}>‹</button>
              <button className="btn-ghost" onClick={goToday} style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}>Today</button>
              <button className="btn-ghost" onClick={goNext} aria-label="Next month" style={{ padding: '0.35rem 0.7rem' }}>›</button>
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{monthLabel}</h2>
            <div style={{ width: 100 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 6, fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {DOW.map(d => <div key={d}>{d}</div>)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {days.map(d => {
              const k = dateKey(d)
              const isOther = d.getMonth() !== view.month
              const isToday = k === todayKey
              const isSel = k === selected
              const ev = eventsByDate[k] || []
              const td = todosByDate[k] || []
              const total = ev.length + td.length
              return (
                <button
                  key={k}
                  onClick={() => setSelected(k)}
                  style={{
                    aspectRatio: '1 / 1',
                    minHeight: 56,
                    padding: '0.35rem',
                    border: '1px solid ' + (isSel ? 'var(--accent)' : 'var(--border)'),
                    background: isToday ? 'rgba(255,255,255,0.04)' : 'var(--bg-primary)',
                    borderRadius: '0.5rem',
                    color: isOther ? 'var(--text-secondary)' : 'var(--text-primary)',
                    opacity: isOther ? 0.45 : 1,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between',
                    transition: 'border-color 0.15s, background 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: isToday ? 800 : 500,
                    color: isToday ? 'var(--accent)' : undefined,
                  }}>{d.getDate()}</span>
                  {total > 0 && (
                    <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {ev.slice(0, 3).map(e => (
                        <span key={e.id} title={e.title} style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_LABEL[e.type].color }} />
                      ))}
                      {td.length > 0 && <span title={`${td.length} task(s)`} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        <Card hover={false}>
          {selDate ? (
            <SidePanel
              dateKey={selDate}
              events={selEvents}
              todos={selTodos}
              onAdd={(title, type, time, notes) => add({ date: selDate, title, type, time, notes })}
              onRemove={remove}
            />
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select a date to see events and tasks.</p>
          )}
        </Card>
      </div>

      <style jsx>{`
        @media (max-width: 820px) { :global(.cal-grid) { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}

function SidePanel({
  dateKey: k,
  events,
  todos,
  onAdd,
  onRemove,
}: {
  dateKey: string
  events: CalEvent[]
  todos: { id: string; title: string; done: boolean }[]
  onAdd: (title: string, type: EventType, time?: string, notes?: string) => void
  onRemove: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EventType>('general')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), type, time || undefined, notes.trim() || undefined)
    setTitle(''); setNotes(''); setTime(''); setType('general'); setAdding(false)
  }

  const dt = new Date(k + 'T00:00')
  const label = dt.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{label}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{events.length} event(s) · {todos.length} task(s)</div>
        </div>
        <button className="btn-primary" onClick={() => setAdding(a => !a)} style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}>
          {adding ? '✕' : '+ Add'}
        </button>
      </div>

      {adding && (
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: '0.5rem' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" autoFocus
            style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <select value={type} onChange={e => setType(e.target.value as EventType)} style={inputStyle}>
              <option value="general">General</option>
              <option value="appointment">Appointment</option>
              <option value="reminder">Reminder</option>
            </select>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <button type="submit" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem' }}>Save Event</button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {events.length === 0 && todos.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Nothing here yet. Tap + Add to create an event.</p>
        )}
        {events.map(e => {
          const t = TYPE_LABEL[e.type]
          return (
            <div key={e.id} style={{
              padding: '0.6rem', borderRadius: '0.5rem',
              background: 'var(--bg-primary)',
              borderLeft: `3px solid ${t.color}`,
              display: 'flex', justifyContent: 'space-between', gap: 8,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.emoji} {e.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {t.label}{e.time ? ` · ${e.time}` : ''}
                </div>
                {e.notes && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>{e.notes}</div>}
              </div>
              <button onClick={() => onRemove(e.id)} aria-label="Delete" className="btn-ghost"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>✕</button>
            </div>
          )
        })}
        {todos.map(t => (
          <div key={t.id} style={{
            padding: '0.6rem', borderRadius: '0.5rem',
            background: 'var(--bg-primary)',
            borderLeft: '3px solid var(--accent)',
          }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1 }}>
              ✅ {t.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>From todo list</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: '0.4rem',
  padding: '0.45rem 0.6rem',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
  fontFamily: 'inherit',
}
