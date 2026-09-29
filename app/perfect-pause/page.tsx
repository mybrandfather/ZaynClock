import type { Metadata } from 'next'
import PerfectPauseGame from './PerfectPauseGame'

export const metadata: Metadata = {
  title: { absolute: 'ZaynClock Perfect Pause' },
  description: 'Stop the moving object at the perfect moment in ZaynClock Perfect Pause.',
  robots: { index: false, follow: false },
}

export default function PerfectPausePage() {
  return <PerfectPauseGame />
}
