import type { Metadata } from 'next'
import BlogClient from './BlogClient'
import JsonLd, { breadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Time, Productivity & Focus Blog',
  description: 'Articles on time management, focus, productivity techniques, and how to make the most of your hours.',
  alternates: { canonical: SITE_URL + '/blog' },
}

export default function Page() {
  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }]),
      ]} />
      <BlogClient />
    </>
  )
}
