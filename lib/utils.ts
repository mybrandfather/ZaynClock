export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zaynclock.com'
export const SITE_NAME = 'ZaynClock'
export const SITE_DESCRIPTION = 'Free online clock, world time, Pomodoro timer, stopwatch, and time zone converter. Fast, beautiful, and ad-supported.'

export function generateMetadata(title: string, description?: string, path = '') {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const desc = description || SITE_DESCRIPTION
  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      site: '@zaynclock',
    },
    robots: { index: true, follow: true },
  }
}

export const WORLD_CITIES = [
  { city: 'New York', timezone: 'America/New_York', flag: '🇺🇸' },
  { city: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { city: 'Chicago', timezone: 'America/Chicago', flag: '🇺🇸' },
  { city: 'London', timezone: 'Europe/London', flag: '🇬🇧' },
  { city: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { city: 'Berlin', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { city: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { city: 'Mumbai', timezone: 'Asia/Kolkata', flag: '🇮🇳' },
  { city: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { city: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { city: 'São Paulo', timezone: 'America/Sao_Paulo', flag: '🇧🇷' },
  { city: 'Toronto', timezone: 'America/Toronto', flag: '🇨🇦' },
  { city: 'Seoul', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { city: 'Shanghai', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
]

export const ALL_TIMEZONES = Intl.supportedValuesOf
  ? Intl.supportedValuesOf('timeZone')
  : WORLD_CITIES.map(c => c.timezone)
