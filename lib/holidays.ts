export interface Holiday {
  name: string
  emoji: string
  date: string // MM-DD format
  color: string
}

export const HOLIDAYS: Holiday[] = [
  { name: "New Year's Day", emoji: '🎆', date: '01-01', color: '#f59e0b' },
  { name: "Valentine's Day", emoji: '❤️', date: '02-14', color: '#ef4444' },
  { name: "St. Patrick's Day", emoji: '🍀', date: '03-17', color: '#22c55e' },
  { name: 'Easter Sunday', emoji: '🐣', date: '04-20', color: '#a855f7' },
  { name: "Mother's Day", emoji: '💐', date: '05-11', color: '#ec4899' },
  { name: 'Memorial Day', emoji: '🇺🇸', date: '05-26', color: '#3b82f6' },
  { name: "Father's Day", emoji: '👔', date: '06-15', color: '#0ea5e9' },
  { name: 'Independence Day', emoji: '🎇', date: '07-04', color: '#ef4444' },
  { name: 'Labor Day', emoji: '🔨', date: '09-01', color: '#6b7280' },
  { name: 'Halloween', emoji: '🎃', date: '10-31', color: '#f97316' },
  { name: 'Thanksgiving', emoji: '🦃', date: '11-27', color: '#d97706' },
  { name: 'Christmas', emoji: '🎄', date: '12-25', color: '#22c55e' },
  { name: "New Year's Eve", emoji: '🥂', date: '12-31', color: '#8b5cf6' },
]

export function getNextHoliday(): { holiday: Holiday; daysLeft: number } | null {
  const now = new Date()
  const year = now.getFullYear()

  const upcoming = HOLIDAYS.map(h => {
    const [month, day] = h.date.split('-').map(Number)
    let target = new Date(year, month - 1, day)
    if (target <= now) target = new Date(year + 1, month - 1, day)
    const diff = Math.ceil((target.getTime() - now.getTime()) / 86400000)
    return { holiday: h, daysLeft: diff }
  }).sort((a, b) => a.daysLeft - b.daysLeft)

  return upcoming[0] ?? null
}

export function getUpcomingHolidays(count = 3) {
  const now = new Date()
  const year = now.getFullYear()

  return HOLIDAYS.map(h => {
    const [month, day] = h.date.split('-').map(Number)
    let target = new Date(year, month - 1, day)
    if (target <= now) target = new Date(year + 1, month - 1, day)
    const diff = Math.ceil((target.getTime() - now.getTime()) / 86400000)
    return { holiday: h, daysLeft: diff }
  }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, count)
}
