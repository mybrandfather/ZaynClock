'use client'

export default function ShareButtonClient() {
  const handleShare = async () => {
    const url = 'https://www.zaynclock.com'
    const text = '⏱️ Check out ZaynClock – beautiful free clock & time tools!'
    if (navigator.share) {
      try { await navigator.share({ title: 'ZaynClock', text, url }) } catch {}
    } else {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="btn-ghost"
      style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}
    >
      🔗 Share ZaynClock
    </button>
  )
}
