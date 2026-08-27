import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ChessClockClient from './ChessClockClient'

vi.mock('@/components/features/FullscreenButton', () => ({
  default: () => <button type="button">Fullscreen</button>,
}))

describe('ChessClockClient input behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    cleanup()
  })

  const player = (number: 1 | 2) => screen.getByRole('button', { name: new RegExp(`Player ${number} clock`) })

  it('starts the selected player on a primary mouse press', () => {
    render(<ChessClockClient />)
    fireEvent.pointerDown(player(1), { pointerType: 'mouse', button: 0 })
    expect(screen.getByText(/Player 1 is thinking/)).toBeTruthy()
  })

  it('ignores right-clicks and other non-primary mouse buttons', () => {
    render(<ChessClockClient />)
    fireEvent.pointerDown(player(2), { pointerType: 'mouse', button: 2 })
    expect(screen.getByText(/Press either player clock/)).toBeTruthy()
  })

  it('handles one touch once even when the browser follows it with a click', () => {
    render(<ChessClockClient />)
    fireEvent.pointerDown(player(2), { pointerType: 'touch', button: 0 })
    fireEvent.click(player(2), { detail: 1 })
    expect(screen.getByText(/Player 2 is thinking/)).toBeTruthy()
  })

  it('supports keyboard activation and switches only from the active clock', () => {
    render(<ChessClockClient />)
    fireEvent.click(player(1), { detail: 0 })
    expect(screen.getByText(/Player 1 is thinking/)).toBeTruthy()
    vi.advanceTimersByTime(100)
    fireEvent.pointerDown(player(1), { pointerType: 'touch', button: 0 })
    expect(screen.getByText(/Player 2 is thinking/)).toBeTruthy()
  })
})
