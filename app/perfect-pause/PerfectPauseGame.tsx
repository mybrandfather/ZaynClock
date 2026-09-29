'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import ObjectShape from './ObjectShape'
import { classifyPause, getTrackMetrics, LEVELS, type PauseResult } from './game'
import styles from './perfect-pause.module.css'

type Mode = 'play' | 'shorts'
type Phase = 'intro' | 'running' | 'result' | 'transition' | 'outro'

const RESULT_COPY: Record<PauseResult, string> = {
  perfect: 'PERFECT! 🎯',
  close: 'SO CLOSE! 😱',
  missed: 'MISSED!',
}

export default function PerfectPauseGame() {
  const [mode, setMode] = useState<Mode>('play')
  const [phase, setPhase] = useState<Phase>('intro')
  const [introBeat, setIntroBeat] = useState<'brand' | 'challenge'>('brand')
  const [levelIndex, setLevelIndex] = useState(0)
  const [result, setResult] = useState<PauseResult | null>(null)
  const [score, setScore] = useState(0)
  const [pausePrompt, setPausePrompt] = useState(false)

  const gameRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const moverRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const currentCenterRef = useRef(0)
  const metricsRef = useRef({ startCenter: 0, targetCenter: 0, endCenter: 0, objectSize: 1 })
  const promptRef = useRef(false)
  const level = LEVELS[levelIndex]

  const measureTrack = useCallback(() => {
    const track = trackRef.current
    const target = targetRef.current
    if (!track || !target) return metricsRef.current

    const width = track.getBoundingClientRect().width
    const objectSize = target.getBoundingClientRect().width
    const metrics = { ...getTrackMetrics(width, objectSize), objectSize }
    metricsRef.current = metrics
    target.style.left = `${metrics.targetCenter}px`
    return metrics
  }, [])

  const moveObject = useCallback((center: number) => {
    const mover = moverRef.current
    if (!mover) return
    currentCenterRef.current = center
    const size = metricsRef.current.objectSize
    mover.style.transform = `translate3d(${center - size / 2}px, -50%, 0)`
  }, [])

  const advance = useCallback(() => {
    setPausePrompt(false)
    promptRef.current = false
    setResult(null)
    if (levelIndex === LEVELS.length - 1) {
      setPhase('outro')
    } else {
      setLevelIndex(index => index + 1)
      setPhase('running')
    }
  }, [levelIndex])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const brandTimer = window.setTimeout(() => setIntroBeat('challenge'), 450)
    const startTimer = window.setTimeout(() => setPhase('running'), 1200)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(brandTimer)
      window.clearTimeout(startTimer)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'running') return

    let startedAt: number | null = null
    let active = true
    const metrics = measureTrack()
    moveObject(metrics.startCenter)

    const observer = new ResizeObserver(() => measureTrack())
    if (trackRef.current) observer.observe(trackRef.current)

    const frame = (now: number) => {
      if (!active) return
      if (startedAt === null) startedAt = now

      const liveMetrics = metricsRef.current
      const progress = Math.min((now - startedAt) / level.durationMs, 1)
      const center = liveMetrics.startCenter + (liveMetrics.endCenter - liveMetrics.startCenter) * progress
      moveObject(center)

      if (mode === 'shorts') {
        const promptRange = liveMetrics.objectSize * 0.78
        const shouldPrompt = Math.abs(center - liveMetrics.targetCenter) <= promptRange
        if (shouldPrompt !== promptRef.current) {
          promptRef.current = shouldPrompt
          setPausePrompt(shouldPrompt)
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(frame)
      } else if (mode === 'play') {
        setResult('missed')
        setPhase('result')
      } else {
        setPhase('transition')
      }
    }

    animationRef.current = requestAnimationFrame(frame)
    return () => {
      active = false
      observer.disconnect()
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    }
  }, [level, measureTrack, mode, moveObject, phase])

  useEffect(() => {
    if (phase !== 'result' && phase !== 'transition') return
    const delay = phase === 'result' ? 1150 : 300
    const timer = window.setTimeout(advance, delay)
    return () => window.clearTimeout(timer)
  }, [advance, phase])

  useEffect(() => {
    if (phase !== 'outro') return
    const timer = window.setTimeout(() => {
      setLevelIndex(0)
      setScore(0)
      setResult(null)
      setPhase('running')
    }, 1350)
    return () => window.clearTimeout(timer)
  }, [phase])

  const stopObject = useCallback(() => {
    if (mode !== 'play' || phase !== 'running') return
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)

    const metrics = metricsRef.current
    const nextResult = classifyPause(currentCenterRef.current - metrics.targetCenter, metrics.objectSize, level)
    window.dispatchEvent(new CustomEvent('zaynclock:perfect-pause', {
      detail: { result: nextResult, level: levelIndex + 1, object: level.object },
    }))
    if (nextResult === 'perfect') {
      moveObject(metrics.targetCenter)
      setScore(value => value + 1)
      navigator.vibrate?.(28)
    } else if (nextResult === 'close') {
      navigator.vibrate?.(12)
    }
    setResult(nextResult)
    setPhase('result')
  }, [level, levelIndex, mode, moveObject, phase])

  const chooseMode = (nextMode: Mode) => {
    if (nextMode === mode) return
    setMode(nextMode)
    setLevelIndex(0)
    setScore(0)
    setResult(null)
    setPausePrompt(false)
    promptRef.current = false
    setPhase('running')
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('[data-game-control]')) return
    stopObject()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') return
    if ((event.target as HTMLElement).closest('[data-game-control]')) return
    event.preventDefault()
    stopObject()
  }

  return (
    <section
      ref={gameRef}
      className={styles.viewport}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      aria-label="ZaynClock Perfect Pause game"
    >
      <div className={styles.gameShell} style={{ '--level-accent': level.accent } as React.CSSProperties}>
        <div className={styles.ambient} aria-hidden="true" />

        <header className={styles.topBar}>
          <div className={styles.brand}><span>ZAYN</span>CLOCK</div>
          <div className={styles.modeSwitch} role="group" aria-label="Game mode" data-game-control>
            <button type="button" className={mode === 'play' ? styles.activeMode : ''} onClick={() => chooseMode('play')} aria-pressed={mode === 'play'}>PLAY</button>
            <button type="button" className={mode === 'shorts' ? styles.activeMode : ''} onClick={() => chooseMode('shorts')} aria-pressed={mode === 'shorts'}>SHORTS</button>
          </div>
        </header>

        <div className={styles.levelHeader} aria-live="polite">
          <span className={styles.levelNumber}>LEVEL {levelIndex + 1}<i>/5</i></span>
          <h1>{level.name} <span aria-hidden="true">{level.emoji}</span></h1>
          <span className={styles.difficulty}>{level.difficulty}</span>
        </div>

        <div
          ref={trackRef}
          className={`${styles.track} ${phase === 'result' && result === 'perfect' ? styles.perfectTrack : ''}`}
          role={mode === 'play' ? 'button' : undefined}
          tabIndex={mode === 'play' ? 0 : -1}
          aria-label={mode === 'play' ? 'Tap or press Space to stop the moving object' : 'YouTube Shorts pause challenge animation'}
        >
          <div className={styles.speedLines} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles.targetLabel} aria-hidden="true">MATCH HERE</div>
          <div ref={targetRef} className={styles.targetObject} data-testid="target-object">
            <span className={styles.targetPulse} aria-hidden="true" />
            <ObjectShape kind={level.object} ghost label={`${level.name} target`} />
          </div>
          <div ref={moverRef} className={styles.movingObject} data-testid="moving-object">
            <ObjectShape kind={level.object} label={`Moving ${level.name}`} />
          </div>

          {pausePrompt && mode === 'shorts' && phase === 'running' && (
            <div className={styles.pausePrompt}>PAUSE NOW!</div>
          )}

          {phase === 'result' && result && (
            <div className={`${styles.result} ${styles[result]}`} role="status">
              <strong>{RESULT_COPY[result]}</strong>
              {result === 'perfect' && (
                <div className={styles.confetti} aria-hidden="true">
                  {Array.from({ length: 10 }, (_, index) => <i key={index} />)}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className={styles.gameFooter}>
          {mode === 'play' ? (
            <>
              <strong>{phase === 'running' ? 'TAP ANYWHERE TO STOP' : 'GET READY…'}</strong>
              <span>Match the object with its ghost</span>
              <div className={styles.scoreDots} aria-label={`${score} perfect matches`}>
                {LEVELS.map((item, index) => <i key={item.name} className={index < score ? styles.scored : ''} />)}
              </div>
            </>
          ) : (
            <>
              <strong>{pausePrompt ? 'PAUSE NOW!' : 'CAN YOU MATCH IT?'}</strong>
              <span>Pause the video when both shapes overlap</span>
              <div className={styles.progressDots} aria-label={`Level ${levelIndex + 1} of 5`}>
                {LEVELS.map((item, index) => <i key={item.name} className={index === levelIndex ? styles.current : ''} />)}
              </div>
            </>
          )}
          <small>ZaynClock.com</small>
        </footer>

        {phase === 'intro' && (
          <div className={styles.fullOverlay} role="status">
            {introBeat === 'brand' ? (
              <div className={styles.introBrand}><span>ZAYN</span>CLOCK</div>
            ) : (
              <div className={styles.introChallenge}>PAUSE AT THE<br /><b>PERFECT MOMENT 🎯</b></div>
            )}
          </div>
        )}

        {phase === 'outro' && (
          <div className={styles.fullOverlay} role="status">
            <div className={styles.outroText}>HOW MANY DID YOU GET? 👀<b>{mode === 'play' ? `${score}/5` : '5/5?'}</b></div>
          </div>
        )}
      </div>
    </section>
  )
}
