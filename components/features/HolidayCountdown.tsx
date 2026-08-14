'use client'

import { useEffect, useRef, useState } from 'react'
import { getUpcomingHolidays } from '@/lib/holidays'

export default function HolidayCountdown() {
  const [holidays, setHolidays] = useState<ReturnType<typeof getUpcomingHolidays>>([])
  const [canScrollMore, setCanScrollMore] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHolidays(getUpcomingHolidays(13))
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const check = () => setCanScrollMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
    check()
    el.addEventListener('scroll', check)
    return () => el.removeEventListener('scroll', check)
  }, [holidays])

  if (!holidays.length) return null

  return (
    <div className="card pop-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', flexShrink: 0 }}>
        🗓️ Upcoming Holidays
      </h3>

      <div style={{ position: 'relative', flex: 1 }}>
        <style>{`
          .holiday-list::-webkit-scrollbar { width: 4px; }
          .holiday-list::-webkit-scrollbar-track { background: transparent; }
          .holiday-list::-webkit-scrollbar-thumb { background: transparent; border-radius: 2px; transition: background 0.2s; }
          .holiday-list:hover::-webkit-scrollbar-thumb { background: var(--border); }
          .holiday-list { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .holiday-list:hover { scrollbar-color: var(--border) transparent; }
        `}</style>
        <div
          ref={listRef}
          className="holiday-list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: 220,
            overflowY: 'auto',
            paddingRight: '0.25rem',
          }}
        >
          {holidays.map(({ holiday, daysLeft }) => (
            <div key={holiday.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{holiday.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.1rem' }}>{holiday.name}</p>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.max(5, 100 - Math.min(daysLeft, 365) / 3.65)}%`,
                    background: holiday.color,
                    borderRadius: 2,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                color: holiday.color,
                minWidth: 60,
                textAlign: 'right',
              }}>
                {daysLeft === 0 ? 'TODAY! 🎉' : daysLeft === 1 ? '1 day' : `${daysLeft} days`}
              </span>
            </div>
          ))}
        </div>

        {canScrollMore && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 40,
            background: 'linear-gradient(to bottom, transparent, var(--bg-card))',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 2,
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
              ↓ scroll for more
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
