'use client'

import Link from 'next/link'
import { blogPosts } from '@/lib/blog'
import AdSlot from '@/components/layout/AdSlot'

export default function BlogPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>
        📚 BLOG
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Tips, guides, and insights on time management and productivity.
      </p>

      <AdSlot format="leaderboard" style={{ marginBottom: '2rem' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <div className="card hover-slide">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    {post.title}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '2rem',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.date}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.2rem' }}>{post.readTime}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
