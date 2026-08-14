'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  format?: 'auto' | 'rectangle' | 'leaderboard'
  style?: React.CSSProperties
}

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID

export default function AdSlot({ format = 'auto', style }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)
  const slot = format === 'rectangle'
    ? process.env.NEXT_PUBLIC_ADSENSE_RECTANGLE_SLOT
    : format === 'leaderboard'
      ? process.env.NEXT_PUBLIC_ADSENSE_LEADERBOARD_SLOT
      : process.env.NEXT_PUBLIC_ADSENSE_AUTO_SLOT

  useEffect(() => {
    if (!ADSENSE_ID || !slot) return
    if (pushed.current) return
    pushed.current = true
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [slot])

  // Never send made-up ad unit numbers to AdSense.
  if (!ADSENSE_ID || !slot) {
    const sizes: Record<string, string> = {
      auto: '728px',
      leaderboard: '728px',
      rectangle: '300px',
    }
    return (
      <div className="ad-slot" style={{
        width: '100%',
        maxWidth: sizes[format],
        height: format === 'rectangle' ? 250 : 90,
        margin: '0 auto',
        ...style,
      }}>
        Advertisement
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
