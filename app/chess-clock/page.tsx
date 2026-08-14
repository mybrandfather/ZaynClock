import type { Metadata } from 'next'
import ChessClockClient from './ChessClockClient'
import Faq from '@/components/seo/Faq'
import JsonLd, { faqSchema, breadcrumbSchema, softwareAppSchema, SITE_URL } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Chess Clock Online – Free Dual Timer for Two Players',
  description: 'A free online chess clock with mobile-friendly dual orientation, time presets (3+2, 5+0, 10+5, 15+10) and fullscreen mode. Perfect for blitz, rapid and classical games.',
  alternates: { canonical: `${SITE_URL}/chess-clock` },
}

const faqs = [
  { q: 'Why are the two clocks rotated 180°?', a: 'So two players can sit across a phone or tablet and each one reads their own clock right-side-up. Player 1 sits at one end, Player 2 at the other.' },
  { q: 'Which time controls are supported?', a: 'You can pick from popular presets — 1+0 bullet, 3+2 blitz, 5+0 blitz, 10+5 rapid, 15+10 rapid — or build your own with custom main time and increment.' },
  { q: 'Does it support increment (Fischer time)?', a: 'Yes. The increment in seconds is added to the moving player\'s clock when they tap to end their turn.' },
  { q: 'Does it work without an internet connection?', a: 'After the page loads once, the clock runs entirely in your browser. You can lose connection and the clock keeps ticking.' },
  { q: 'Can I use this for other 2-player games?', a: 'Yes — it works for shogi, scrabble, debate timing, or any turn-based game where both sides need their own countdown.' },
  { q: 'How do I know whose turn it is?', a: 'The active player\'s clock is highlighted with the accent color and pulses gently. Tap your own clock to end your turn.' },
]

export default function ChessClockPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <JsonLd data={[
        softwareAppSchema({ name: 'ZaynClock Chess Clock', description: 'Online chess clock with presets.', url: '/chess-clock', category: 'GameApplication' }),
        breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Chess Clock', url: '/chess-clock' }]),
        faqSchema(faqs),
      ]} />

      <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>♟️ CHESS CLOCK</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Two players, one device. Tap your clock when your move is done.
      </p>

      <ChessClockClient />

      <section style={{ padding: '2.5rem 0 1rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '0.6rem' }}>The simplest way to play timed chess online</h2>
        <p>
          A chess clock should not need an instruction manual. ZaynClock&apos;s chess clock gives you two big tap targets,
          one for each player, and rotates the top clock 180° so the player on the other side of the table reads their own
          time right-side-up. Set a time control, then press one player’s clock to start the opponent’s time. After each move, the active player presses their own clock to stop it and start the opponent’s clock.
        </p>
        <p>
          You get all the popular formats out of the box — 1+0 bullet, 3+2 and 5+0 blitz, 10+5 and 15+10 rapid, plus full
          custom controls. The clock supports Fischer increment, so the side that just moved gets a few extra seconds added
          to their time. When time runs out, the flag falls and we visually highlight which player ran out first.
        </p>
        <p>
          Want a focus tool for the rest of your day? Try our <a style={{ color: 'var(--accent)' }} href="/pomodoro">Pomodoro</a>,
          a classic <a style={{ color: 'var(--accent)' }} href="/stopwatch">Stopwatch</a> or our quiet
          <a style={{ color: 'var(--accent)' }} href="/study-clock"> Study Clock</a>.
        </p>
      </section>

      <Faq items={faqs} />
    </div>
  )
}
