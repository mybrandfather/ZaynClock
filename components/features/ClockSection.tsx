'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import HomeClock from '@/components/clock/HomeClock'
import QuickTimeAdder from '@/components/features/QuickTimeAdder'
import { usePreferences } from '@/hooks/usePreferences'

const WeatherWidget = dynamic(() => import('@/components/features/WeatherWidget'), {
  loading: () => (
    <div style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
      Loading weather…
    </div>
  ),
})

export default function ClockSection() {
  const { prefs } = usePreferences()
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  return (
    <div
      id="clock-section"
      style={{
        background: 'var(--bg-primary)',
        borderRadius: isFs ? 0 : '1rem',
        marginBottom: isFs ? 0 : '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: isFs ? '100dvh' : undefined,
        justifyContent: isFs ? 'center' : undefined,
        position: isFs ? 'relative' : undefined,
      }}
    >
      {/* Main clock — large in fullscreen */}
      <HomeClock large={isFs} />

      {/* Preset quick-time cards — hidden in fullscreen */}
      {!isFs && (
        <div style={{ width: '100%', maxWidth: 680, padding: '0 1rem 1.25rem' }}>
          <QuickTimeAdder />
        </div>
      )}

      {/* Fullscreen weather — full widget, wider card */}
      {isFs && prefs.fullscreenWeather && (
        <div style={{
          width: '100%',
          maxWidth: 520,
          padding: '0 1.5rem 1rem',
          animation: 'fadeIn 0.35s ease',
        }}>
          <WeatherWidget />
        </div>
      )}

      {/* Ad bar — bottom of fullscreen */}
      {isFs && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0.6rem 1rem',
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 60,
          borderTop: '1px solid var(--border)',
        }}>
          {/* AdSense banner — replace data-ad-slot with your slot ID */}
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Advertisement
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
