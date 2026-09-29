import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import ObjectShape from './ObjectShape'
import { classifyPause, getTrackMetrics, LEVELS } from './game'

afterEach(cleanup)

describe('Perfect Pause mechanics', () => {
  it('defines five progressively faster levels', () => {
    expect(LEVELS.map(level => level.name)).toEqual(['Tomato', 'Lemon', 'Soccer Ball', 'Star', 'Diamond'])
    for (let index = 1; index < LEVELS.length; index += 1) {
      expect(LEVELS[index].durationMs).toBeLessThan(LEVELS[index - 1].durationMs)
      expect(LEVELS[index].perfectRatio).toBeLessThan(LEVELS[index - 1].perfectRatio)
    }
  })

  it('classifies stops from actual center distance', () => {
    const level = LEVELS[0]
    expect(classifyPause(0, 100, level)).toBe('perfect')
    expect(classifyPause(30, 100, level)).toBe('close')
    expect(classifyPause(70, 100, level)).toBe('missed')
  })

  it('places the exact target inside the track and moves fully through it', () => {
    const metrics = getTrackMetrics(390, 90)
    expect(metrics.startCenter).toBeLessThan(0)
    expect(metrics.targetCenter).toBeGreaterThan(300)
    expect(metrics.endCenter).toBeGreaterThan(390)
  })

  it('uses the same SVG geometry and view box for mover and target', () => {
    const { container } = render(
      <div>
        <ObjectShape kind="tomato" label="Moving tomato" />
        <ObjectShape kind="tomato" ghost label="Tomato target" />
      </div>,
    )
    const mover = screen.getByLabelText('Moving tomato')
    const target = screen.getByLabelText('Tomato target')
    expect(mover.getAttribute('viewBox')).toBe(target.getAttribute('viewBox'))
    expect(mover.getAttribute('data-shape')).toBe(target.getAttribute('data-shape'))
    expect(mover.innerHTML).toBe(target.innerHTML)
    expect(container.querySelectorAll('svg')).toHaveLength(2)
  })
})
