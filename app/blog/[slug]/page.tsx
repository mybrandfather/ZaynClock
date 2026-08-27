import { getBlogPost, blogPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import AdSlot from '@/components/layout/AdSlot'
import JsonLd, { articleSchema, breadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.date,
    },
    twitter: { title: post.title, description: post.excerpt },
  }
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean)
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      return link[2].startsWith('/')
        ? <Link key={key} href={link[2]} style={{ color: 'var(--accent)' }}>{link[1]}</Link>
        : <a key={key} href={link[2]} rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{link[1]}</a>
    }
    return part
  })
}

function renderContent(content: string) {
  const blocks: ReactNode[] = []
  let listType: 'ol' | 'ul' | null = null
  let listItems: string[] = []

  const flushList = () => {
    if (!listType || listItems.length === 0) return
    const key = `list-${blocks.length}`
    const items = listItems.map((item, index) => (
      <li key={`${key}-${index}`} style={{ margin: '0.35rem 0', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {renderInline(item, `${key}-${index}`)}
      </li>
    ))
    blocks.push(listType === 'ol'
      ? <ol key={key} style={{ margin: '0.75rem 0 1rem', paddingLeft: '1.5rem' }}>{items}</ol>
      : <ul key={key} style={{ margin: '0.75rem 0 1rem', paddingLeft: '1.5rem' }}>{items}</ul>)
    listType = null
    listItems = []
  }

  for (const rawLine of content.trim().split('\n')) {
    const line = rawLine.trim()
    if (!line) {
      flushList()
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      blocks.push(<h2 key={`heading-${blocks.length}`} style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.5rem 0 0.5rem', color: 'var(--text-primary)' }}>{renderInline(line.slice(3), `heading-${blocks.length}`)}</h2>)
      continue
    }
    const ordered = line.match(/^\d+\.\s+(.*)$/)
    if (ordered) {
      if (listType !== 'ol') {
        flushList()
        listType = 'ol'
      }
      listItems.push(ordered[1])
      continue
    }
    const unordered = line.match(/^-\s+(.*)$/)
    if (unordered) {
      if (listType !== 'ul') {
        flushList()
        listType = 'ul'
      }
      listItems.push(unordered[1])
      continue
    }
    flushList()
    blocks.push(<p key={`paragraph-${blocks.length}`} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, margin: '0.65rem 0' }}>{renderInline(line, `paragraph-${blocks.length}`)}</p>)
  }
  flushList()
  return blocks
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={[
        articleSchema({ title: post.title, description: post.excerpt, url: `/blog/${post.slug}`, datePublished: post.date }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: post.title, url: `/blog/${post.slug}` }]),
      ]} />
      <Link href="/blog" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}>← Back to Blog</Link>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          {post.tags.map(tag => (<span key={tag} style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--accent)' }}>{tag}</span>))}
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>{post.title}</h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', gap: '1rem' }}>
          <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
        </div>
      </div>
      <AdSlot format="leaderboard" style={{ marginBottom: '2rem' }} />
      <article style={{ lineHeight: 1.8 }}>{renderContent(post.content)}</article>
      <AdSlot format="rectangle" style={{ marginTop: '2rem' }} />
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>More Articles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {blogPosts.filter(p => p.slug !== post.slug).slice(0, 3).map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.9rem' }}>→ {p.title}</Link>
          ))}
        </div>
      </div>
    </div>
  )
}
