import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of ZaynClock clocks, timers, alarms, calendars and other free browser tools.',
  alternates: { canonical: 'https://www.zaynclock.com/terms' },
}

const headingStyle = { color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.5rem' } as const

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Terms of Use', url: '/terms' }])} />
      <h1 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.9rem', marginBottom: '0.35rem' }}>Terms of Use</h1>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>Effective date: July 25, 2026</p>

      <p>By accessing ZaynClock, you agree to these terms. Stop using the site if you do not agree.</p>

      <h2 style={headingStyle}>Permitted use</h2>
      <p>You may use ZaynClock&apos;s publicly available tools for lawful personal, educational and business purposes. You may not misuse the service, interfere with its operation, attempt unauthorized access, introduce malicious code, scrape it in a way that materially disrupts service, or falsely represent ZaynClock as your own service.</p>

      <h2 style={headingStyle}>Accuracy and alarms</h2>
      <p>Clock and conversion results depend on your device, browser, selected time zone and third-party time-zone data. Alarms and notifications may fail when a browser tab is closed, sleeping, muted, suspended or restricted by the operating system. Do not rely on ZaynClock as the sole alert or timing source for medical, legal, safety-critical, financial, transportation or emergency purposes.</p>

      <h2 style={headingStyle}>User-created browser data</h2>
      <p>Calendar items, todo entries, alarms, preferences and custom sounds are generally stored in your browser. You are responsible for maintaining any backup you need. Clearing browser data, changing devices or browser behavior may permanently remove this information.</p>

      <h2 style={headingStyle}>Third-party services and advertising</h2>
      <p>ZaynClock may display third-party advertising and may request weather or place information from external providers. Third-party services have their own terms and policies. We do not control their availability or content.</p>

      <h2 style={headingStyle}>Intellectual property</h2>
      <p>ZaynClock branding, original interface elements and site content are protected by applicable intellectual-property laws. Third-party materials remain the property of their respective owners and are acknowledged on our <Link href="/credits" style={{ color: 'var(--accent)' }}>credits page</Link>.</p>

      <h2 style={headingStyle}>No warranty</h2>
      <p>The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of uninterrupted availability, fitness for a particular purpose or error-free operation, to the fullest extent permitted by law.</p>

      <h2 style={headingStyle}>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, ZaynClock and its operators will not be liable for indirect, incidental, special or consequential losses arising from use of, inability to use, or reliance on the service.</p>

      <h2 style={headingStyle}>Changes</h2>
      <p>We may update these terms or change, suspend or discontinue features. Material changes will be reflected by updating the effective date.</p>

      <h2 style={headingStyle}>Contact</h2>
      <p>Questions can be sent to <a href="mailto:hello@zaynclock.com" style={{ color: 'var(--accent)' }}>hello@zaynclock.com</a> or through the <Link href="/contact" style={{ color: 'var(--accent)' }}>contact page</Link>.</p>
    </div>
  )
}
