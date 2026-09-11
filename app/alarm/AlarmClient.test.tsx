import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AlarmClient from './AlarmClient'

const stop = vi.fn()
const playSound = vi.fn<(pack: string, volume: number, custom?: string, loop?: boolean) => { stop: () => void }>(() => ({ stop }))
const previewSound = vi.fn<(pack: string, volume: number, custom?: string) => void>()

vi.mock('@/hooks/usePreferences', () => ({
  usePreferences: () => ({
    prefs: { soundPack: 'chime', soundVolume: 0.6, soundEnabled: true, customSoundDataUrl: undefined },
    setSoundPack: vi.fn(), toggleSound: vi.fn(), setSoundVolume: vi.fn(), setCustomSound: vi.fn(),
  }),
}))
vi.mock('@/lib/sounds', () => ({
  SOUND_PACKS: [{ value: 'chime', label: 'Classic Chime', emoji: '🎐', group: 'Alerts' }],
  playSound: (pack: string, volume: number, custom?: string, loop?: boolean) => playSound(pack, volume, custom, loop),
  previewSound: (pack: string, volume: number, custom?: string) => previewSound(pack, volume, custom),
  stopPreviewSound: vi.fn(),
}))

describe('AlarmClient', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-11T09:00:00'))
  })
  afterEach(() => { cleanup(); vi.useRealTimers() })

  it('creates, toggles, deletes, and persists multiple alarms', () => {
    const { unmount } = render(<AlarmClient />)
    fireEvent.change(screen.getByLabelText('Alarm label (optional)'), { target: { value: 'Morning Alarm' } })
    fireEvent.click(screen.getByRole('button', { name: 'Set Alarm' }))
    fireEvent.change(screen.getByLabelText('Alarm time'), { target: { value: '08:30' } })
    fireEvent.click(screen.getByRole('button', { name: 'Set Alarm' }))
    expect(screen.getByText('2 alarms')).toBeTruthy()
    expect(screen.getByText('Morning Alarm')).toBeTruthy()

    const firstCard = screen.getByText('Morning Alarm').closest('article')!
    fireEvent.click(within(firstCard).getByRole('switch'))
    expect(within(firstCard).getByText('Alarm disabled')).toBeTruthy()
    fireEvent.click(within(firstCard).getByRole('button', { name: /Delete/ }))
    expect(screen.getByText('1 alarm')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('zaynclock_alarms') || '[]')).toHaveLength(1)
    unmount()
  })

  it('sets every quick alarm for the exact future time and previews sound', () => {
    render(<AlarmClient />)
    for (const name of ['+5 min', '+10 min', '+15 min', '+30 min', '+1 hour']) {
      fireEvent.click(screen.getByRole('button', { name }))
    }
    const saved = JSON.parse(localStorage.getItem('zaynclock_alarms') || '[]')
    expect(saved.map((alarm: { time: string }) => alarm.time)).toEqual(['09:05', '09:10', '09:15', '09:30', '10:00'])
    expect(saved[0].scheduledFor).toBe(new Date('2026-09-11T09:05:00').toISOString())
    fireEvent.click(screen.getByRole('button', { name: /Test Sound/ }))
    expect(previewSound).toHaveBeenCalledWith('chime', 0.6, undefined)
  })

  it('restores existing alarms from the original local storage key', () => {
    localStorage.setItem('zaynclock_alarms', JSON.stringify([{ id: 'saved', time: '14:45', label: 'Saved alarm', enabled: true }]))
    render(<AlarmClient />)
    expect(screen.getByText('Saved alarm')).toBeTruthy()
    expect(screen.getByText('2:45 PM')).toBeTruthy()
  })

  it('rings, snoozes five minutes, and stops', () => {
    render(<AlarmClient />)
    fireEvent.click(screen.getByRole('button', { name: '+5 min' }))
    act(() => vi.advanceTimersByTime(5 * 60_000))
    expect(screen.getByRole('alertdialog')).toBeTruthy()
    expect(playSound).toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Snooze 5 Minutes' }))
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(stop).toHaveBeenCalled()
    const saved = JSON.parse(localStorage.getItem('zaynclock_alarms') || '[]')
    expect(saved[0].time).toBe('09:10')

    act(() => vi.advanceTimersByTime(5 * 60_000))
    fireEvent.click(screen.getByRole('button', { name: 'Stop Alarm' }))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })
})
