interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zaynclock.com').replace(/\/$/, '')
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export default function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? data : [data]
  return (
    <>
      {json.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJson(item) }}
        />
      ))}
    </>
  )
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'ZaynClock',
    url: `${SITE_URL}/`,
    description: 'Free online clocks, timers, alarms, world time and productivity tools.',
    inLanguage: 'en-US',
    publisher: { '@id': ORGANIZATION_ID },
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'ZaynClock',
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/zaynclock-logo.png`,
    },
    email: 'hello@zaynclock.com',
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

export function softwareAppSchema(options: {
  name: string
  description: string
  url: string
  category?: string
}) {
  const url = options.url.startsWith('http') ? options.url : `${SITE_URL}${options.url}`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#webapp`,
    name: options.name,
    description: options.description,
    url,
    applicationCategory: options.category || 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and a modern web browser.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': ORGANIZATION_ID },
  }
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}

export function articleSchema(options: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  const url = options.url.startsWith('http') ? options.url : `${SITE_URL}${options.url}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: options.title,
    description: options.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}/zaynclock-logo.png`,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: { '@type': 'Organization', name: options.author || 'ZaynClock Editorial', url: `${SITE_URL}/about` },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
  }
}
