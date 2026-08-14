'use client'
import { useEffect, useState } from 'react'

export default function FullscreenButton({ targetId }: { targetId?: string }) {
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggle = () => {
    const el = (targetId ? document.getElementById(targetId) : document.documentElement) || document.documentElement
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <button
      onClick={toggle}
      className="btn-ghost"
      style={{ padding: '0.4rem 0.7rem', fontSize: '0.85rem' }}
      title="Toggle fullscreen"
      aria-label="Toggle fullscreen"
    >
      {isFs ? '🡼 Exit Fullscreen' : '⛶ Fullscreen'}
    </button>
  )
}
