'use client'

import { usePreferences } from '@/hooks/usePreferences'
import DigitalClock from './DigitalClock'
import AnalogClock from './AnalogClock'
import NeonSegmentClock from './NeonSegmentClock'
import OrbitDialClock from './OrbitDialClock'
import SlideClock from './SlideClock'
import BouncyBlockClock from './BouncyBlockClock'
import ModernAnalogClock from './ModernAnalogClock'

export default function HomeClock({ large = false }: { large?: boolean }) {
  const { prefs } = usePreferences()
  const analogSize = large ? 500 : 300

  return (
    <div style={{ width: '100%', padding: '0.75rem 0 0.25rem' }}>
      {prefs.clockType === 'neon3d' && <NeonSegmentClock large={large} />}
      {prefs.clockType === 'digital' && <DigitalClock large={large} />}
      {prefs.clockType === 'orbit' && <OrbitDialClock large={large} />}
      {prefs.clockType === 'slide' && <SlideClock large={large} />}
      {prefs.clockType === 'bouncy' && <BouncyBlockClock large={large} />}
      {prefs.clockType === 'modernAnalog' && <ModernAnalogClock large={large} />}
      {prefs.clockType === 'analog' && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '2rem 0 1.5rem',
        }}>
          <AnalogClock size={analogSize} showSeconds={prefs.showSeconds} />
          <p style={{ color: 'var(--text-secondary)', fontSize: large ? '1.1rem' : '0.8rem', marginTop: '1rem' }}>
            📍 {prefs.timezone.replace(/_/g, ' ')}
          </p>
        </div>
      )}
    </div>
  )
}
