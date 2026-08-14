import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ZaynClock handles browser storage, location, weather data, notifications, advertising and server logs.',
  alternates: { canonical: 'https://www.zaynclock.com/privacy' },
}

const headingStyle = { color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, margin: '1.5rem 0 0.5rem' } as const

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: '/privacy' }])} />
      <h1 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.9rem', marginBottom: '0.35rem' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>Effective date: August 14, 2026</p>

      <p>ZaynClock is designed to work without an account. This policy explains what is stored in your browser, what may be sent to third-party services, and what choices you have.</p>

      <h2 style={headingStyle}>Information stored on your device</h2>
      <p>ZaynClock uses browser local storage to remember settings and data you choose to create, including clock preferences, time zone, theme, alarms, calendar events, todo items, pinned world clocks, study-session history and an optional custom alert sound. This information remains in your browser unless you clear site data or your browser removes it. It is not synchronized to a ZaynClock account.</p>

      <h2 style={headingStyle}>Location and weather</h2>
      <p>The weather feature can use your browser&apos;s geolocation permission. ZaynClock requests location only after you choose to use your location. When you approve, your coordinates are sent directly from your browser to Open-Meteo services to retrieve weather, air-quality and place-name results. Open-Meteo and your network provider may receive technical information such as your IP address. ZaynClock does not store your precise coordinates on its own servers.</p>

      <h2 style={headingStyle}>Browser notifications</h2>
      <p>Alarm, timer, Pomodoro and study tools may ask for notification permission after you interact with them. Notification permission is controlled by your browser or operating system and can be revoked in browser settings.</p>

      <h2 style={headingStyle}>Advertising and cookies</h2>
      <p>If Google AdSense is enabled, Google and its partners may use cookies, device identifiers or similar technologies to deliver, measure and limit advertisements. Where required, a consent message should appear before personalized advertising technologies are used. You can review or change advertising choices through the consent message when available and through Google&apos;s advertising controls.</p>

      <h2 style={headingStyle}>Analytics and website experience</h2>
      <p>ZaynClock uses Google Analytics to understand aggregate website traffic, including pages visited, approximate location, device type and how visitors found the site. Google may use cookies or similar technologies to provide these measurements.</p>
      <p style={{ marginTop: '0.75rem' }}>ZaynClock uses Microsoft Clarity to understand how visitors use the site through interaction data such as clicks, scrolling, navigation and anonymized session replays. This helps identify broken controls and confusing page areas. Clarity masks sensitive content by default and may use cookies or similar technologies to associate page views. Microsoft processes this information under its own privacy terms.</p>

      <h2 style={headingStyle}>Server and security logs</h2>
      <p>Our hosting and security providers may automatically process basic request information, such as IP address, browser type, requested URL, timestamps and error or security events. These logs are used to operate, protect and troubleshoot the website and are retained according to the provider&apos;s operational policies.</p>

      <h2 style={headingStyle}>Children&apos;s privacy</h2>
      <p>ZaynClock is a general-audience utility and is not designed to collect personal information from children. We do not knowingly provide account registration or ask children to submit personal profiles.</p>

      <h2 style={headingStyle}>Your choices</h2>
      <p>You can clear ZaynClock&apos;s locally stored information through your browser&apos;s site-data controls, deny or revoke location and notification permissions, block analytics cookies through browser or consent controls, and use advertising controls where shown. Blocking optional features may prevent weather, alerts or personalized advertising from working.</p>

      <h2 style={headingStyle}>External services and links</h2>
      <p>Third-party services operate under their own privacy policies. ZaynClock is not responsible for the privacy practices of external websites reached through links or third-party requests.</p>

      <h2 style={headingStyle}>Changes to this policy</h2>
      <p>We may update this policy when features or service providers change. The effective date at the top will be revised when a material update is published.</p>

      <h2 style={headingStyle}>Contact</h2>
      <p>Privacy questions can be sent to <a href="mailto:hello@zaynclock.com" style={{ color: 'var(--accent)' }}>hello@zaynclock.com</a>. You may also visit the <Link href="/contact" style={{ color: 'var(--accent)' }}>contact page</Link>.</p>
    </div>
  )
}
