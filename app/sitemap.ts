import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog'
import { SITE_URL } from '@/components/seo/JsonLd'

const staticRoutes = [
  '/',
  '/about',
  '/week-number',
  '/unix-timestamp',
  '/date-countdown',
  '/date-calculator',
  '/business-days-calculator',
  '/age-calculator',
  '/alarm',
  '/blog',
  '/calendar',
  '/chess-clock',
  '/classroom-timer',
  '/contact',
  '/converter',
  '/credits',
  '/disclaimer',
  '/education-tools',
  '/exam-timer',
  '/hours-calculator',
  '/holidays',
  '/islamic-calendar',
  '/interval-timer',
  '/meeting-timer',
  '/pomodoro',
  '/privacy',
  '/random-name-picker',
  '/stopwatch',
  '/study-clock',
  '/terms',
  '/time-card-calculator',
  '/time-from-now',
  '/timer',
  '/todo',
  '/tools',
  '/worldclock',
  '/sun-moon',
  '/work-tools',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${SITE_URL}${route === '/' ? '/' : route}`,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
  }))

  return [...staticEntries, ...blogEntries]
}
