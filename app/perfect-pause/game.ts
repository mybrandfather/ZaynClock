export type ObjectKind = 'tomato' | 'lemon' | 'soccer' | 'star' | 'diamond'

export type Level = {
  name: string
  emoji: string
  object: ObjectKind
  difficulty: string
  durationMs: number
  perfectRatio: number
  accent: string
}

export const LEVELS: readonly Level[] = [
  { name: 'Tomato', emoji: '🍅', object: 'tomato', difficulty: 'EASY', durationMs: 2600, perfectRatio: 0.16, accent: '#ff435d' },
  { name: 'Lemon', emoji: '🍋', object: 'lemon', difficulty: 'MEDIUM', durationMs: 2200, perfectRatio: 0.13, accent: '#ffe052' },
  { name: 'Soccer Ball', emoji: '⚽', object: 'soccer', difficulty: 'HARD', durationMs: 1850, perfectRatio: 0.105, accent: '#54e7ff' },
  { name: 'Star', emoji: '⭐', object: 'star', difficulty: 'VERY HARD', durationMs: 1550, perfectRatio: 0.082, accent: '#ffb82e' },
  { name: 'Diamond', emoji: '💎', object: 'diamond', difficulty: 'IMPOSSIBLE', durationMs: 1300, perfectRatio: 0.06, accent: '#8cf4ff' },
] as const

export type PauseResult = 'perfect' | 'close' | 'missed'

export function classifyPause(distance: number, objectSize: number, level: Level): PauseResult {
  const normalizedDistance = Math.abs(distance) / Math.max(objectSize, 1)
  if (normalizedDistance <= level.perfectRatio) return 'perfect'
  if (normalizedDistance <= 0.42) return 'close'
  return 'missed'
}

export function getTrackMetrics(width: number, objectSize: number) {
  const edgePadding = Math.max(44, width * 0.11)
  return {
    startCenter: -objectSize * 0.65,
    targetCenter: width - edgePadding - objectSize / 2,
    endCenter: width + objectSize * 0.7,
  }
}
