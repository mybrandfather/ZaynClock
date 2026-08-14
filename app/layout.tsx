import type { Metadata, Viewport } from 'next'
import { Orbitron, Outfit, JetBrains_Mono, Major_Mono_Display, Share_Tech_Mono, VT323, Audiowide } from 'next/font/google'
import { PreferencesProvider } from '@/hooks/usePreferences'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/features/BackToTop'
import Script from 'next/script'
import JsonLd, { organizationSchema, websiteSchema } from '@/components/seo/JsonLd'
import '@/styles/globals.css'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' })
const major = Major_Mono_Display({ subsets: ['latin'], weight: '400', variable: '--font-major', display: 'swap' })
const share = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-share', display: 'swap' })
const vt323 = VT323({ subsets: ['latin'], weight: '400', variable: '--font-vt323', display: 'swap' })
const audiowide = Audiowide({ subsets: ['latin'], weight: '400', variable: '--font-audiowide', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zaynclock.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080910',
  colorScheme: 'dark light',
}

export const metadata: Metadata = {
  title: { default: 'ZaynClock – Free Online Clock & Time Tools', template: '%s | ZaynClock' },
  description: 'Free online clock, Pomodoro timer, stopwatch, world clock, and time zone converter. Beautiful, fast, and always accurate.',
  metadataBase: new URL(siteUrl),
  applicationName: 'ZaynClock',
  category: 'utilities',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/zaynclock-logo.png', apple: '/zaynclock-logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'ZaynClock',
    locale: 'en_US',
    url: `${siteUrl}/`,
    images: [{ url: '/zaynclock-logo.png', alt: 'ZaynClock' }],
  },
  twitter: { card: 'summary_large_image', images: ['/zaynclock-logo.png'] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID || 'G-2P3SL6QCHX'
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || 'y28u2dpogr'
  const fontVars = `${orbitron.variable} ${outfit.variable} ${jetbrains.variable} ${major.variable} ${share.variable} ${vt323.variable} ${audiowide.variable}`

  return (
    <html lang="en" className={fontVars}>
      <head>
        {adsenseId && (
          <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`} crossOrigin="anonymous" strategy="afterInteractive" />
        )}
        {analyticsId && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${analyticsId}');`}
            </Script>
          </>
        )}
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
          </Script>
        )}
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <PreferencesProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <BackToTop />
        </PreferencesProvider>
      </body>
    </html>
  )
}
