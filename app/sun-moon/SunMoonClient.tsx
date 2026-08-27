'use client'

import { useEffect, useMemo, useState } from 'react'

const radians = Math.PI / 180

function julianDate(date: Date) {
  return date.getTime() / 86_400_000 + 2_440_587.5
}

function solar(date: Date, latitude: number, longitude: number) {
  const cycle = Math.round(julianDate(date) - 2_451_545.0009 + longitude / 360)
  const approximateNoon = 2_451_545.0009 - longitude / 360 + cycle
  const anomaly = (357.5291 + 0.98560028 * (approximateNoon - 2_451_545)) % 360
  const center = 1.9148 * Math.sin(anomaly * radians) + 0.02 * Math.sin(2 * anomaly * radians) + 0.0003 * Math.sin(3 * anomaly * radians)
  const eclipticLongitude = (anomaly + center + 180 + 102.9372) % 360
  const solarNoon = approximateNoon + 0.0053 * Math.sin(anomaly * radians) - 0.0069 * Math.sin(2 * eclipticLongitude * radians)
  const declination = Math.asin(Math.sin(eclipticLongitude * radians) * Math.sin(23.44 * radians))
  const hourAngleRatio = (Math.sin(-0.833 * radians) - Math.sin(latitude * radians) * Math.sin(declination)) /
    (Math.cos(latitude * radians) * Math.cos(declination))
  const noon = new Date((solarNoon - 2_440_587.5) * 86_400_000)

  if (hourAngleRatio > 1) return { rise: null, set: null, noon, dayLength: 0, polar: 'night' as const }
  if (hourAngleRatio < -1) return { rise: null, set: null, noon, dayLength: 24, polar: 'day' as const }

  const hourAngle = Math.acos(hourAngleRatio)
  const rise = new Date((solarNoon - hourAngle / (2 * Math.PI) - 2_440_587.5) * 86_400_000)
  const set = new Date((solarNoon + hourAngle / (2 * Math.PI) - 2_440_587.5) * 86_400_000)
  return { rise, set, noon, dayLength: (set.getTime() - rise.getTime()) / 3_600_000, polar: null }
}

function moon(date: Date) {
  const days = julianDate(date) - 2_451_550.1
  const phase = ((days / 29.53058867) % 1 + 1) % 1
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2
  const name = phase < 0.03 || phase > 0.97 ? 'New Moon'
    : phase < 0.22 ? 'Waxing Crescent'
      : phase < 0.28 ? 'First Quarter'
        : phase < 0.47 ? 'Waxing Gibbous'
          : phase < 0.53 ? 'Full Moon'
            : phase < 0.72 ? 'Waning Gibbous'
              : phase < 0.78 ? 'Last Quarter'
                : 'Waning Crescent'
  return { illumination, name }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0))
}

export default function SunMoonClient() {
  const [today, setToday] = useState<Date | null>(null)
  const [latitude, setLatitude] = useState(41.76)
  const [longitude, setLongitude] = useState(-72.68)
  const [status, setStatus] = useState('Manchester, Connecticut')

  useEffect(() => setToday(new Date()), [])

  const data = useMemo(() => {
    if (!today) return null
    return { solar: solar(today, latitude, longitude), moon: moon(today) }
  }, [today, latitude, longitude])

  const locate = () => {
    if (!navigator.geolocation) {
      setStatus('Location is not supported — enter coordinates manually')
      return
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setStatus('Your current location')
      },
      () => setStatus('Location unavailable — using manual coordinates'),
    )
  }

  if (!data) {
    return <div className="card" aria-busy="true" style={{ marginTop: '1.5rem', minHeight: 180 }}>Calculating today&apos;s sun and moon data…</div>
  }

  const formatTime = (date: Date | null, missing: string) => date
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : missing
  const polarMessage = data.solar.polar === 'day' ? 'Sun stays above horizon' : 'Sun stays below horizon'
  const dayHours = Math.floor(data.solar.dayLength)
  const dayMinutes = Math.round((data.solar.dayLength % 1) * 60)
  const cards = [
    ['🌅 Sunrise', formatTime(data.solar.rise, polarMessage)],
    ['🌇 Sunset', formatTime(data.solar.set, polarMessage)],
    ['☀️ Solar noon', formatTime(data.solar.noon, 'Unavailable')],
    ['⏳ Day length', `${dayHours}h ${dayMinutes}m`],
    ['🌙 Moon phase', data.moon.name],
    ['💡 Illumination', `${Math.round(data.moon.illumination * 100)}%`],
  ]

  return (
    <section>
      <div className="card" style={{ margin: '1.5rem 0', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'end' }}>
        <button className="btn-primary" onClick={locate}>Use my location</button>
        <label style={{ display: 'grid', gap: 4, flex: '1 1 150px' }}>
          Latitude
          <input type="number" min={-89.9} max={89.9} value={latitude} step=".01" onChange={event => setLatitude(clamp(Number(event.target.value), -89.9, 89.9))} />
        </label>
        <label style={{ display: 'grid', gap: 4, flex: '1 1 150px' }}>
          Longitude
          <input type="number" min={-180} max={180} value={longitude} step=".01" onChange={event => setLongitude(clamp(Number(event.target.value), -180, 180))} />
        </label>
        <span role="status" style={{ color: 'var(--text-secondary)', flex: '1 1 190px', paddingBottom: '.55rem' }}>{status}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12 }}>
        {cards.map(([label, value]) => (
          <div className="card" key={label}>
            <strong>{label}</strong>
            <div style={{ fontSize: 'clamp(1.15rem, 5vw, 1.6rem)', color: 'var(--accent)', marginTop: 8, overflowWrap: 'anywhere' }}>{value}</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 20, color: 'var(--text-secondary)' }}>
        Times are astronomical estimates shown in your device&apos;s local time zone. Horizon, elevation and local conditions can shift observed times by several minutes.
      </p>
    </section>
  )
}
