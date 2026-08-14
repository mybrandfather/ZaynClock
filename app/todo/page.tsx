import type { Metadata } from 'next'
import TodoClient from './TodoClient'
import JsonLd, { breadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Free Online Todo List and Daily Task Planner',
  description: 'A lightweight, privacy-friendly todo list. Add tasks, mark them done, and optionally tag a date so they appear on your calendar.',
  alternates: { canonical: SITE_URL + '/todo' },
  keywords: 'todo, task list, daily planner, simple todo, free todo app',
}

export default function TodoPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem' }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Todo', url: '/todo' }])]} />
      <TodoClient />
    </div>
  )
}
