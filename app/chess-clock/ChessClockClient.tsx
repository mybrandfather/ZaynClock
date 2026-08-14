'use client'
import { useEffect, useRef, useState } from 'react'
import FullscreenButton from '@/components/features/FullscreenButton'

const PRESETS = [
  { label: '1+0 Bullet', main: 60, inc: 0 }, { label: '3+0 Blitz', main: 180, inc: 0 },
  { label: '3+2 Blitz', main: 180, inc: 2 }, { label: '5+0 Blitz', main: 300, inc: 0 },
  { label: '5+3 Blitz', main: 300, inc: 3 }, { label: '10+5 Rapid', main: 600, inc: 5 },
  { label: '15+10 Rapid', main: 900, inc: 10 }, { label: '30+0 Classical', main: 1800, inc: 0 },
]

type SideId = 'a' | 'b'
type Status = 'ready' | 'running' | 'paused' | 'finished'
const opponent = (side: SideId): SideId => side === 'a' ? 'b' : 'a'

function fmt(ms: number) {
  const safe = Math.max(0, ms)
  if (safe < 10_000) return `${(safe / 1000).toFixed(1)}s`
  const total = Math.ceil(safe / 1000)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export default function ChessClockClient() {
  const [main, setMain] = useState(300)
  const [inc, setInc] = useState(0)
  const [times, setTimes] = useState<Record<SideId, number>>({ a: 300_000, b: 300_000 })
  const [active, setActive] = useState<SideId | null>(null)
  const [status, setStatus] = useState<Status>('ready')
  const [moves, setMoves] = useState<Record<SideId, number>>({ a: 0, b: 0 })
  const [layout, setLayout] = useState<'stacked' | 'side' | 'parallel'>('stacked')
  const deadlineRef = useRef<number | null>(null)
  const activeRef = useRef<SideId | null>(null)
  const statusRef = useRef<Status>('ready')
  const timesRef = useRef<Record<SideId, number>>({ a: 300_000, b: 300_000 })
  const inputLockRef = useRef(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  const setActiveSafe = (value: SideId | null) => { activeRef.current = value; setActive(value) }
  const setStatusSafe = (value: Status) => { statusRef.current = value; setStatus(value) }
  const setTimesSafe = (value: Record<SideId, number>) => { timesRef.current = value; setTimes(value) }


  const clickSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const ctx = audioContextRef.current ?? new AudioCtx()
      audioContextRef.current = ctx
      if (ctx.state === 'suspended') void ctx.resume()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 1000
      osc.type = 'square'
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch {}
  }

  useEffect(() => () => {
    if (audioContextRef.current) void audioContextRef.current.close()
  }, [])

  useEffect(() => {
    const adapt = () => { if (window.innerWidth < 768 && layout === 'side') setLayout('stacked') }
    adapt(); window.addEventListener('resize', adapt)
    return () => window.removeEventListener('resize', adapt)
  }, [layout])

  useEffect(() => {
    if (status !== 'running' || !active || deadlineRef.current === null) return
    const update = () => {
      const left = Math.max(0, deadlineRef.current! - Date.now())
      const nextTimes = { ...timesRef.current, [active]: left }
      setTimesSafe(nextTimes)
      if (left <= 0) {
        deadlineRef.current = null
        setStatusSafe('finished')
        setActiveSafe(null)
      }
    }
    update()
    const id = window.setInterval(update, 50)
    const onVisibility = () => { if (!document.hidden) update() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', onVisibility) }
  }, [status, active])

  const apply = (p: { main: number; inc: number }) => {
    const seconds = Math.min(24 * 3600, Math.max(1, p.main))
    const increment = Math.min(600, Math.max(0, p.inc))
    setMain(seconds); setInc(increment)
    setTimesSafe({ a: seconds * 1000, b: seconds * 1000 })
    setMoves({ a: 0, b: 0 }); setActiveSafe(null); setStatusSafe('ready'); deadlineRef.current = null
    inputLockRef.current = false
  }

  const pressClock = (pressed: SideId) => {
    const currentStatus = statusRef.current
    const currentActive = activeRef.current
    if (currentStatus === 'finished' || inputLockRef.current) return

    inputLockRef.current = true
    window.setTimeout(() => { inputLockRef.current = false }, 80)

    // On a new game, the player panel selected by the user starts first.
    // After that initial start, pressing the active clock switches turns below.
    if (currentStatus === 'ready') {
      setActiveSafe(pressed)
      setStatusSafe('running')
      deadlineRef.current = Date.now() + timesRef.current[pressed]
      clickSound()
      return
    }

    // While paused, only Resume restarts the saved turn. Ignore the inactive panel.
    if (currentStatus === 'paused' || currentActive !== pressed) return

    const now = Date.now()
    const exactRemaining = Math.max(0, (deadlineRef.current ?? now) - now)
    if (exactRemaining <= 0) {
      setTimesSafe({ ...timesRef.current, [pressed]: 0 })
      setActiveSafe(null)
      setStatusSafe('finished')
      deadlineRef.current = null
      return
    }

    const credited = exactRemaining + inc * 1000
    const next = opponent(pressed)
    setTimesSafe({ ...timesRef.current, [pressed]: credited })
    setMoves(prev => ({ ...prev, [pressed]: prev[pressed] + 1 }))
    setActiveSafe(next)
    deadlineRef.current = now + timesRef.current[next]
    clickSound()
  }


  const pause = () => {
    if (status !== 'running' || !active) return
    const left = Math.max(0, (deadlineRef.current ?? Date.now()) - Date.now())
    setTimesSafe({ ...timesRef.current, [active]: left }); deadlineRef.current = null
    if (left <= 0) { setActiveSafe(null); setStatusSafe('finished') } else setStatusSafe('paused')
  }
  const resume = () => {
    if (status !== 'paused' || !active) return
    deadlineRef.current = Date.now() + timesRef.current[active]; setStatusSafe('running')
  }
  const reset = () => apply({ main, inc })

  const Side = ({ side, rotate = 0 }: { side: SideId; rotate?: number }) => {
    const flag = times[side] <= 0
    const isActive = status === 'running' && active === side
    const canPress = status === 'ready' || isActive
    return (
      <button
        type="button"
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) return
          event.preventDefault()
          pressClock(side)
        }}
        onClick={(event) => {
          // Keyboard activation produces a click with detail 0. Pointer input is
          // handled above so mouse, touch and pen cannot fire the clock twice.
          if (event.detail === 0) pressClock(side)
        }}
        disabled={flag || !canPress}
        aria-label={`Player ${side === 'a' ? '1' : '2'} clock, ${fmt(times[side])}${isActive ? ', running' : ''}`}
        style={{ width: '100%', minHeight: 220, height: '100%', border: 'none', borderRadius: '1rem', padding: '1rem',
          background: flag ? '#7f1d1d' : isActive ? 'var(--bg-card)' : 'var(--bg-secondary)',
          color: flag ? '#fee2e2' : isActive ? 'var(--accent)' : 'var(--text-primary)',
          cursor: canPress && !flag ? 'pointer' : 'default', fontFamily: 'var(--font-display)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: rotate ? `rotate(${rotate}deg)` : 'none',
          boxShadow: isActive ? 'var(--glow)' : 'none', opacity: status === 'running' && !isActive ? 0.62 : 1,
          touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <div style={{ fontSize: 'clamp(2.8rem, 12vw, 5.5rem)', lineHeight: 1 }}>{flag ? 'FLAG' : fmt(times[side])}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', marginTop: 8, opacity: 0.75 }}>
          Player {side === 'a' ? '1' : '2'} · {moves[side]} moves {isActive ? '· TURN' : ''}
        </div>
      </button>
    )
  }

  const grid = layout === 'parallel'
    ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', minHeight: 320 }
    : layout === 'side'
      ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', minHeight: 460 }
      : { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', minHeight: 460 }

  return <div id="chess-fs" style={{ background: 'var(--bg-primary)' }}>
    <style>{`@media (max-width:767px){.chess-rotate-btn{display:none!important}}`}</style>
    <div role="status" aria-live="polite" style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '.75rem', minHeight: 24 }}>
      {status === 'ready' && 'Press either player clock to start that player’s time.'}
      {status === 'running' && `Player ${active === 'a' ? '1' : '2'} is thinking. Press that clock after the move.`}
      {status === 'paused' && `Paused on Player ${active === 'a' ? '1' : '2'}’s turn.`}
      {status === 'finished' && `${times.a <= 0 ? 'Player 1' : 'Player 2'} ran out of time. Reset or choose a time control for a new game.`}
    </div>
    <div style={{ display:'flex',justifyContent:'center',gap:'.4rem',marginBottom:'.75rem',flexWrap:'wrap' }}>
      <button onClick={()=>setLayout('stacked')} className="btn-ghost">☰ Stacked</button>
      <button onClick={()=>setLayout('side')} className="btn-ghost chess-rotate-btn">⤢ Rotated</button>
      <button onClick={()=>setLayout('parallel')} className="btn-ghost">▣▣ Parallel</button>
    </div>
    <div style={grid}>
      {layout === 'side' ? <><Side side="b" rotate={90}/><Side side="a" rotate={-90}/></>
       : layout === 'parallel' ? <><Side side="a"/><Side side="b"/></>
       : <><Side side="b" rotate={180}/><Side side="a"/></>}
    </div>
    <div style={{display:'flex',justifyContent:'center',gap:'.5rem',marginBottom:'1rem',flexWrap:'wrap'}}>
      {status === 'running' && <button className="btn-primary" onClick={pause}>⏸ Pause</button>}
      {status === 'paused' && <button className="btn-primary" onClick={resume}>▶ Resume</button>}
      <button className="btn-ghost" onClick={reset}>↺ Reset</button><FullscreenButton targetId="chess-fs"/>
    </div>
    <div className="card"><h3 style={{fontWeight:700,fontSize:'.95rem',marginBottom:'.5rem'}}>Time control</h3>
      <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem',marginBottom:'.75rem'}}>{PRESETS.map(p=><button key={p.label} className="btn-ghost" onClick={()=>apply(p)}>{p.label}</button>)}</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:'.5rem',alignItems:'end'}}>
        <label style={{fontSize:'.75rem'}}>Main time (min)<input type="number" min={1} max={1440} value={Math.floor(main/60)} onChange={e=>setMain(Math.min(86400,Math.max(60,(Number(e.target.value)||1)*60)))} style={{width:'100%',display:'block',padding:'.5rem',background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border)',borderRadius:'.4rem'}}/></label>
        <label style={{fontSize:'.75rem'}}>Increment (sec)<input type="number" min={0} max={600} value={inc} onChange={e=>setInc(Math.min(600,Math.max(0,Number(e.target.value)||0)))} style={{width:'100%',display:'block',padding:'.5rem',background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border)',borderRadius:'.4rem'}}/></label>
        <button className="btn-primary" onClick={()=>apply({main,inc})}>Apply</button>
      </div>
    </div>
  </div>
}
