'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePreferences } from '@/hooks/usePreferences'

interface Weather {
  temp: number
  humidity: number
  apparentTemp: number
  weatherCode: number
  windSpeed: number
  sunrise: string
  sunset: string
  city: string
  aqi?: number
  pollen?: { grass?: number; tree?: number; weed?: number }
}

const WEATHER_DESC: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Rime fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  61: { label: 'Light rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '⛈️' },
  71: { label: 'Snow', icon: '🌨️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
}

function aqiCategory(aqi: number) {
  if (aqi <= 20) return { label: 'Good', color: '#22c55e' }
  if (aqi <= 40) return { label: 'Fair', color: '#84cc16' }
  if (aqi <= 60) return { label: 'Moderate', color: '#eab308' }
  if (aqi <= 80) return { label: 'Poor', color: '#f97316' }
  return { label: 'Very poor', color: '#ef4444' }
}

const cToF = (c: number) => Math.round(c * 9 / 5 + 32)

async function fetchWeather(lat: number, lon: number, city: string, hour12: boolean): Promise<Weather> {
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m' +
    '&daily=sunrise,sunset&timezone=auto&forecast_days=1',
  )
  if (!weatherResponse.ok) throw new Error('Weather request failed')
  const weather = await weatherResponse.json()

  let aqi: number | undefined
  let pollen: Weather['pollen']
  try {
    const airResponse = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
      '&current=european_aqi,grass_pollen,tree_pollen,weed_pollen',
    )
    if (airResponse.ok) {
      const air = await airResponse.json()
      aqi = air.current?.european_aqi
      pollen = {
        grass: air.current?.grass_pollen,
        tree: air.current?.tree_pollen,
        weed: air.current?.weed_pollen,
      }
    }
  } catch {}

  const sunrise = weather.daily?.sunrise?.[0] ?? ''
  const sunset = weather.daily?.sunset?.[0] ?? ''
  const formatSunTime = (value: string) => value
    ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 })
    : '—'

  return {
    temp: Math.round(weather.current.temperature_2m),
    apparentTemp: Math.round(weather.current.apparent_temperature),
    humidity: Math.round(weather.current.relative_humidity_2m),
    weatherCode: weather.current.weather_code,
    windSpeed: Math.round(weather.current.wind_speed_10m),
    sunrise: formatSunTime(sunrise),
    sunset: formatSunTime(sunset),
    city,
    aqi,
    pollen,
  }
}

export default function WeatherWidget({ compact = false }: { compact?: boolean }) {
  const { prefs, setTempUnit } = usePreferences()
  const [data, setData] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const tFmt = (c: number) => prefs.tempUnit === 'F' ? `${cToF(c)}°F` : `${Math.round(c)}°C`

  const load = useCallback(async (lat: number, lon: number, city: string) => {
    setLoading(true)
    setErr(null)
    try {
      setData(await fetchWeather(lat, lon, city, prefs.timeFormat === '12h'))
    } catch {
      setErr('Could not load weather')
    } finally {
      setLoading(false)
    }
  }, [prefs.timeFormat])

  useEffect(() => {
    let cancelled = false
    const loadFromTimezone = async () => {
      const timezoneCity = prefs.timezone.split('/').pop()?.replace(/_/g, ' ') || 'New York'
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(timezoneCity)}&count=1&language=en&format=json`)
        const result = await response.json()
        const match = result.results?.[0]
        if (!cancelled && match) {
          await load(match.latitude, match.longitude, match.name || timezoneCity)
          return
        }
      } catch {}
      if (!cancelled) await load(40.7128, -74.006, 'New York')
    }
    void loadFromTimezone()
    return () => { cancelled = true }
  }, [load, prefs.timezone])

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setErr('Location is not available in this browser')
      return
    }
    setLocating(true)
    setErr(null)
    navigator.geolocation.getCurrentPosition(
      async position => {
        let city = 'Your location'
        try {
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&count=1&language=en`,
          )
          const result = await response.json()
          city = result.results?.[0]?.name || city
        } catch {}
        await load(position.coords.latitude, position.coords.longitude, city)
        setLocating(false)
      },
      () => {
        setErr('Location permission was not granted')
        setLocating(false)
      },
      { timeout: 7000, maximumAge: 10 * 60 * 1000 },
    )
  }

  if (loading && !data) {
    return (
      <div className="card pop-card" style={{ padding: '1rem', minHeight: 110 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading weather…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card pop-card" style={{ padding: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{err || 'Weather unavailable'}</p>
        <button className="btn-ghost" onClick={useMyLocation} disabled={locating} style={{ padding: '0.4rem 0.7rem', fontSize: '0.78rem' }}>
          {locating ? 'Finding location…' : 'Use my location'}
        </button>
      </div>
    )
  }

  const desc = WEATHER_DESC[data.weatherCode] || { label: 'Unknown', icon: '🌡️' }
  const aqi = data.aqi !== undefined ? aqiCategory(data.aqi) : null

  if (compact) {
    return (
      <div className="card pop-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.6rem' }}>{desc.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{tFmt(data.temp)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{data.city} · {desc.label}</div>
        </div>
        <button className="btn-ghost" onClick={useMyLocation} disabled={locating} title="Use my location" style={{ padding: '0.3rem 0.45rem', fontSize: '0.75rem' }}>⌖</button>
      </div>
    )
  }

  return (
    <div className="card pop-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>🌤️ Weather</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button className="btn-ghost" onClick={useMyLocation} disabled={locating} title="Use my location" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
            {locating ? 'Locating…' : '⌖ My location'}
          </button>
          <div role="group" aria-label="Temperature unit" style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: '999px', overflow: 'hidden' }}>
            {(['C', 'F'] as const).map(unit => (
              <button key={unit} onClick={() => setTempUnit(unit)} aria-pressed={prefs.tempUnit === unit}
                style={{
                  padding: '0.2rem 0.55rem', fontSize: '0.7rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: prefs.tempUnit === unit ? 'var(--accent)' : 'transparent',
                  color: prefs.tempUnit === unit ? 'var(--bg-primary)' : 'var(--text-secondary)',
                }}>°{unit}</button>
            ))}
          </div>
        </div>
      </div>

      {err && <p style={{ color: 'var(--accent2)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{err}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '2.4rem' }}>{desc.icon}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--accent)', lineHeight: 1 }}>
            {tFmt(data.temp)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Feels like {tFmt(data.apparentTemp)} · {desc.label}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>📍 {data.city}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        <div>💧 Humidity: <strong style={{ color: 'var(--text-primary)' }}>{data.humidity}%</strong></div>
        <div>💨 Wind: <strong style={{ color: 'var(--text-primary)' }}>{data.windSpeed} km/h</strong></div>
        <div>🌅 Sunrise: <strong style={{ color: 'var(--text-primary)' }}>{data.sunrise}</strong></div>
        <div>🌇 Sunset: <strong style={{ color: 'var(--text-primary)' }}>{data.sunset}</strong></div>
        {aqi && <div>🌬️ AQI: <strong style={{ color: aqi.color }}>{data.aqi} · {aqi.label}</strong></div>}
        {data.pollen?.grass !== undefined && <div>🌾 Pollen: <strong style={{ color: 'var(--text-primary)' }}>{data.pollen.grass}</strong></div>}
      </div>
    </div>
  )
}
