import { getBlogPost, blogPosts } from '@/lib/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
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
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactNode[] = []
    let key = 0
    for (const line of lines) {
      if (line.startsWith('## ')) {
        elements.push(<h2 key={key++} style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.5rem 0 0.5rem', color: 'var(--text-primary)' }}>{line.slice(3)}</h2>)
      } else if (line.match(/^[0-9]+\. /)) {
        elements.push(<li key={key++} style={{ margin: '0.3rem 0 0.3rem 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{line.replace(/^[0-9]+\. /, '')}</li>)
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.*?)\*\*: (.*)/)
        if (match) {
          elements.push(<li key={key++} style={{ margin: '0.3rem 0 0.3rem 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}><strong style={{ color: 'var(--text-primary)' }}>{match[1]}:</strong> {match[2]}</li>)
        }
      } else if (line.trim() === '') {
        elements.push(<br key={key++} />)
      } else {
        elements.push(<p key={key++} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, margin: '0.5rem 0' }}>{line}</p>)
      }
    }
    return elements
  }

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
