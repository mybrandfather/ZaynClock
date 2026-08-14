'use client'

import { useEffect, useState, useCallback } from 'react'

export type EventType = 'general' | 'appointment' | 'reminder'

export interface CalEvent {
  id: string
  date: string
  time?: string
  title: string
  type: EventType
  notes?: string
}

export interface Todo {
  id: string
  title: string
  done: boolean
  date?: string
  createdAt: number
}

const EVENTS_KEY = 'zaynclock_events_v1'
const TODOS_KEY = 'zaynclock_todos_v1'

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch { return fallback }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('zaynclock-store', { detail: key }))
}

const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export function useEvents() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setEvents(read<CalEvent[]>(EVENTS_KEY, []))
    setReady(true)
    const onChange = (e: Event) => {
      const d = (e as CustomEvent).detail
      if (d === EVENTS_KEY || d === undefined) setEvents(read<CalEvent[]>(EVENTS_KEY, []))
    }
    window.addEventListener('zaynclock-store', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('zaynclock-store', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const add = useCallback((e: Omit<CalEvent, 'id'>) => {
    const ne: CalEvent = { ...e, id: id() }
    const next = [...read<CalEvent[]>(EVENTS_KEY, []), ne]
    write(EVENTS_KEY, next)
    return ne
  }, [])

  const update = useCallback((eid: string, patch: Partial<CalEvent>) => {
    const next = read<CalEvent[]>(EVENTS_KEY, []).map(e => e.id === eid ? { ...e, ...patch } : e)
    write(EVENTS_KEY, next)
  }, [])

  const remove = useCallback((eid: string) => {
    const next = read<CalEvent[]>(EVENTS_KEY, []).filter(e => e.id !== eid)
    write(EVENTS_KEY, next)
  }, [])

  return { events, ready, add, update, remove }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTodos(read<Todo[]>(TODOS_KEY, []))
    setReady(true)
    const onChange = (e: Event) => {
      const d = (e as CustomEvent).detail
      if (d === TODOS_KEY || d === undefined) setTodos(read<Todo[]>(TODOS_KEY, []))
    }
    window.addEventListener('zaynclock-store', onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('zaynclock-store', onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const add = useCallback((title: string, date?: string) => {
    const t: Todo = { id: id(), title, done: false, date, createdAt: Date.now() }
    write(TODOS_KEY, [t, ...read<Todo[]>(TODOS_KEY, [])])
    return t
  }, [])

  const toggle = useCallback((tid: string) => {
    const next = read<Todo[]>(TODOS_KEY, []).map(t => t.id === tid ? { ...t, done: !t.done } : t)
    write(TODOS_KEY, next)
  }, [])

  const remove = useCallback((tid: string) => {
    write(TODOS_KEY, read<Todo[]>(TODOS_KEY, []).filter(t => t.id !== tid))
  }, [])

  const update = useCallback((tid: string, patch: Partial<Todo>) => {
    const next = read<Todo[]>(TODOS_KEY, []).map(t => t.id === tid ? { ...t, ...patch } : t)
    write(TODOS_KEY, next)
  }, [])

  return { todos, ready, add, toggle, remove, update }
}

export function dateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateKey(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
