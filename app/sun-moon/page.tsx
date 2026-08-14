import type { Metadata } from 'next'
import SunMoonClient from './SunMoonClient'
export const metadata: Metadata={title:'Sunrise, Sunset and Moon Phase Today',description:'Estimate today’s sunrise, sunset, solar noon, day length, moon phase and moon illumination for your chosen coordinates.',alternates:{canonical:'/sun-moon'}}
export default function Page(){return <main style={{maxWidth:1000,margin:'0 auto',padding:'2rem 1rem'}}><h1>🌅 Sun & Moon Today</h1><p style={{color:'var(--text-secondary)'}}>Astronomy times calculated for your chosen location. Allow location access or enter coordinates manually.</p><SunMoonClient /></main>}
