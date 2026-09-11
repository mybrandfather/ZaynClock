'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SoundPack } from '@/hooks/usePreferences'
import { usePreferences } from '@/hooks/usePreferences'
import { playSound, previewSound, SOUND_PACKS, stopPreviewSound, type PlayingSound } from '@/lib/sounds'
import styles from './alarm.module.css'

interface Alarm {
  id: string
  time: string
  label: string
  enabled: boolean
  sound?: SoundPack
  scheduledFor?: string
}

const STORE = 'zaynclock_alarms'
const QUICK_ALARMS = [
  { minutes: 5, label: '+5 min' }, { minutes: 10, label: '+10 min' },
  { minutes: 15, label: '+15 min' }, { minutes: 30, label: '+30 min' },
  { minutes: 60, label: '+1 hour' },
]

function formatInputTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function nextOccurrence(time: string, from = new Date()) {
  const [hours, minutes] = time.split(':').map(Number)
  const target = new Date(from)
  target.setHours(hours, minutes, 0, 0)
  if (target.getTime() <= from.getTime()) target.setDate(target.getDate() + 1)
  return target
}

function alarmTarget(alarm: Alarm, now = new Date()) {
  if (alarm.scheduledFor) {
    const scheduled = new Date(alarm.scheduledFor)
    if (!Number.isNaN(scheduled.getTime()) && scheduled.getTime() > now.getTime()) return scheduled
  }
  return nextOccurrence(alarm.time, now)
}

function formatAlarmTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hours, minutes))
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <div className={styles.liveClock} aria-live="off">
      <time className={styles.liveTime} dateTime={now?.toISOString()}>
        {now ? new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(now) : '--:--:-- --'}
      </time>
      <div className={styles.liveDate}>
        {now ? new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now) : 'Loading current date'}
      </div>
    </div>
  )
}

function RingsIn({ alarm }: { alarm: Alarm }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  const target = alarmTarget(alarm, new Date(now)).getTime()
  const totalMinutes = Math.max(1, Math.ceil((target - now) / 60_000))
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts = [days ? `${days} day${days === 1 ? '' : 's'}` : '', hours ? `${hours} hr` : '', minutes ? `${minutes} min` : ''].filter(Boolean)
  return <span>Rings in {parts.join(' ') || 'less than a minute'}</span>
}

export default function AlarmClient() {
  const { prefs, setSoundPack, toggleSound, setSoundVolume, setCustomSound } = usePreferences()
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [loaded, setLoaded] = useState(false)
  const [time, setTime] = useState('07:00')
  const [label, setLabel] = useState('')
  const [sound, setSound] = useState<SoundPack>(prefs.soundPack)
  const [ringing, setRinging] = useState<string | null>(null)
  const lastFired = useRef<Record<string, string>>({})
  const ringingSound = useRef<PlayingSound | null>(null)
  const soundFile = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORE)
    if (raw) try {
      const saved = JSON.parse(raw)
      if (Array.isArray(saved)) setAlarms(saved)
    } catch {}
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (loaded) localStorage.setItem(STORE, JSON.stringify(alarms))
  }, [alarms, loaded])
  useEffect(() => () => {
    ringingSound.current?.stop()
    stopPreviewSound()
  }, [])

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date()
      for (const alarm of alarms) {
        if (!alarm.enabled) continue
        const scheduled = alarm.scheduledFor ? new Date(alarm.scheduledFor).getTime() : null
        const dueByTimestamp = scheduled !== null && !Number.isNaN(scheduled) && now.getTime() >= scheduled && now.getTime() - scheduled < 60_000
        const dueByClock = !alarm.scheduledFor && alarm.time === formatInputTime(now)
        if (!dueByTimestamp && !dueByClock) continue
        const fireKey = alarm.scheduledFor || `${now.toDateString()}|${alarm.time}`
        if (lastFired.current[alarm.id] === fireKey) continue
        lastFired.current[alarm.id] = fireKey
        ringingSound.current?.stop()
        ringingSound.current = prefs.soundEnabled
          ? playSound(alarm.sound || prefs.soundPack, prefs.soundVolume, prefs.customSoundDataUrl, true)
          : null
        setRinging(alarm.id)
        setAlarms(current => current.map(item => item.id === alarm.id ? { ...item, scheduledFor: undefined } : item))
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(`Alarm: ${alarm.label || 'Alarm'}`, { body: formatAlarmTime(alarm.time) })
        }
      }
    }
    checkAlarms()
    const id = window.setInterval(checkAlarms, 1000)
    return () => window.clearInterval(id)
  }, [alarms, prefs.customSoundDataUrl, prefs.soundEnabled, prefs.soundPack, prefs.soundVolume])

  const activeAlarm = useMemo(() => alarms.find(alarm => alarm.id === ringing), [alarms, ringing])
  const requestNotifications = () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') void Notification.requestPermission().catch(() => {})
  }
  const addAlarm = (alarmTime = time, scheduledFor?: Date, alarmLabel = label) => {
    if (!alarmTime) return
    requestNotifications()
    const target = scheduledFor || nextOccurrence(alarmTime)
    setAlarms(current => [...current, {
      id: globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
      time: alarmTime, label: alarmLabel.trim(), enabled: true, sound, scheduledFor: target.toISOString(),
    }])
    setLabel('')
  }
  const addQuickAlarm = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60_000)
    const targetTime = formatInputTime(target)
    setTime(targetTime)
    addAlarm(targetTime, target, label || `${minutes}-minute alarm`)
  }
  const toggle = (id: string) => setAlarms(current => current.map(alarm => alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm))
  const remove = (id: string) => {
    if (ringing === id) { ringingSound.current?.stop(); ringingSound.current = null; setRinging(null) }
    setAlarms(current => current.filter(alarm => alarm.id !== id))
  }
  const dismiss = () => { ringingSound.current?.stop(); ringingSound.current = null; setRinging(null) }
  const snooze = (id: string) => {
    const target = new Date(Date.now() + 5 * 60_000)
    setAlarms(current => current.map(alarm => alarm.id === id ? { ...alarm, time: formatInputTime(target), enabled: true, scheduledFor: target.toISOString() } : alarm))
    dismiss()
  }
  const changeSound = (nextSound: SoundPack) => {
    setSound(nextSound)
    setSoundPack(nextSound)
  }
  const uploadSound = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file?.type.startsWith('audio/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setCustomSound(String(reader.result))
      setSound('custom')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={styles.tool}>
      <LiveClock />
      <section className={styles.setCard} aria-labelledby="set-alarm-heading">
        <div className={styles.cardHeading}>
          <div><span className={styles.eyebrow}>Alarm setup</span><h2 id="set-alarm-heading">Set Alarm</h2></div>
          <span className={styles.savedNote}>Saved in this browser</span>
        </div>
        <div className={styles.formGrid}>
          <label className={styles.field}><span>Alarm time</span><input className={styles.timeInput} type="time" value={time} onChange={event => setTime(event.target.value)} required /></label>
          <label className={styles.field}><span>Alarm label <small>(optional)</small></span><input type="text" value={label} onChange={event => setLabel(event.target.value)} placeholder="Morning Alarm" maxLength={60} /></label>
          <label className={styles.field}><span>Alarm sound</span><select value={sound} onChange={event => changeSound(event.target.value as SoundPack)}>
            {SOUND_PACKS.filter(option => option.value !== 'custom' || prefs.customSoundDataUrl).map(option => <option key={option.value} value={option.value}>{option.emoji} {option.label}</option>)}
          </select></label>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.testButton} onClick={() => previewSound(sound, prefs.soundVolume, prefs.customSoundDataUrl)}>▶ Test Sound</button>
          <button type="button" className={styles.setButton} onClick={() => addAlarm()}>Set Alarm</button>
        </div>
        <div className={styles.soundControls}>
          <button type="button" className={styles.soundToggle} aria-pressed={prefs.soundEnabled} onClick={toggleSound}>
            {prefs.soundEnabled ? 'Sound on' : 'Sound off'}
          </button>
          <label className={styles.volumeControl}>
            <span>Volume {Math.round(prefs.soundVolume * 100)}%</span>
            <input type="range" min={0} max={1} step={0.05} value={prefs.soundVolume} onChange={event => setSoundVolume(Number(event.target.value))} />
          </label>
          <input ref={soundFile} className="sr-only" type="file" accept="audio/*" onChange={uploadSound} aria-label="Upload custom alarm sound" />
          <button type="button" className={styles.uploadButton} onClick={() => soundFile.current?.click()}>Upload sound</button>
          {prefs.customSoundDataUrl && <button type="button" className={styles.removeSound} onClick={() => { setCustomSound(undefined); setSound('chime'); setSoundPack('chime') }}>Remove custom</button>}
        </div>
        <div className={styles.quickSection}><span>Quick alarm</span><div className={styles.quickButtons}>
          {QUICK_ALARMS.map(option => <button key={option.minutes} type="button" onClick={() => addQuickAlarm(option.minutes)}>{option.label}</button>)}
        </div></div>
      </section>

      <section className={styles.alarmList} aria-labelledby="saved-alarms-heading">
        <div className={styles.listHeading}><h2 id="saved-alarms-heading">Your Alarms</h2><span>{alarms.length} {alarms.length === 1 ? 'alarm' : 'alarms'}</span></div>
        {loaded && alarms.length === 0 && <div className={styles.emptyState}><span aria-hidden="true">⏰</span><p>No alarms set yet.</p><small>Choose a time above or use a quick alarm.</small></div>}
        {alarms.map(alarm => (
          <article key={alarm.id} className={`${styles.alarmCard} ${alarm.enabled ? styles.active : styles.disabled}`}>
            <div className={styles.statusDot} aria-hidden="true" />
            <div className={styles.alarmDetails}><time className={styles.alarmTime}>{formatAlarmTime(alarm.time)}</time><strong>{alarm.label || 'Alarm'}</strong><small>{alarm.enabled ? <RingsIn alarm={alarm} /> : 'Alarm disabled'}</small></div>
            <div className={styles.alarmControls}>
              <button type="button" className={styles.toggle} role="switch" aria-checked={alarm.enabled} aria-label={`${alarm.enabled ? 'Disable' : 'Enable'} ${alarm.label || 'alarm'} at ${formatAlarmTime(alarm.time)}`} onClick={() => toggle(alarm.id)}><span /></button>
              <button type="button" className={styles.deleteButton} onClick={() => remove(alarm.id)} aria-label={`Delete ${alarm.label || 'alarm'} at ${formatAlarmTime(alarm.time)}`}>Delete</button>
            </div>
          </article>
        ))}
      </section>

      {activeAlarm && <div className={styles.modalBackdrop} role="presentation"><section className={styles.ringingModal} role="alertdialog" aria-modal="true" aria-labelledby="ringing-title" aria-describedby="ringing-description">
        <span className={styles.ringingIcon} aria-hidden="true">⏰</span><span className={styles.eyebrow}>Now ringing</span><h2 id="ringing-title">Alarm!</h2>
        <p id="ringing-description" className={styles.ringingTime}>{formatAlarmTime(activeAlarm.time)}</p><strong>{activeAlarm.label || 'Alarm'}</strong>
        <div className={styles.modalActions}><button type="button" className={styles.stopButton} onClick={dismiss} autoFocus>Stop Alarm</button><button type="button" className={styles.snoozeButton} onClick={() => snooze(activeAlarm.id)}>Snooze 5 Minutes</button></div>
      </section></div>}
    </div>
  )
}
