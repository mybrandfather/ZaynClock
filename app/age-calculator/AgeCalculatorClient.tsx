'use client'
import { useMemo, useState } from 'react'

function dateOnly(value: string) { const [y,m,d]=value.split('-').map(Number); return new Date(y,m-1,d) }
function diffParts(birth: Date, target: Date) {
  if (target < birth) return null
  let years = target.getFullYear()-birth.getFullYear()
  let months = target.getMonth()-birth.getMonth()
  let days = target.getDate()-birth.getDate()
  if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate() }
  if (months < 0) { years--; months += 12 }
  const totalDays = Math.floor((Date.UTC(target.getFullYear(),target.getMonth(),target.getDate())-Date.UTC(birth.getFullYear(),birth.getMonth(),birth.getDate()))/86400000)
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < target) nextBirthday.setFullYear(nextBirthday.getFullYear()+1)
  const untilBirthday = Math.ceil((Date.UTC(nextBirthday.getFullYear(),nextBirthday.getMonth(),nextBirthday.getDate())-Date.UTC(target.getFullYear(),target.getMonth(),target.getDate()))/86400000)
  return { years, months, days, totalDays, weeks: Math.floor(totalDays/7), hours: totalDays*24, untilBirthday }
}
export default function AgeCalculatorClient(){
  const today=new Date().toISOString().slice(0,10)
  const [birth,setBirth]=useState('1990-01-01'); const [target,setTarget]=useState(today)
  const result=useMemo(()=>diffParts(dateOnly(birth),dateOnly(target)),[birth,target])
  return <div className="card" style={{maxWidth:820,margin:'0 auto'}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1rem'}}>
      <label style={label}>Date of birth<input style={input} type="date" value={birth} max={target} onChange={e=>setBirth(e.target.value)}/></label>
      <label style={label}>Age on date<input style={input} type="date" value={target} min={birth} onChange={e=>setTarget(e.target.value)}/></label>
    </div>
    {!result ? <p style={{color:'var(--danger)',marginTop:'1rem'}}>The target date must be after the birth date.</p> : <>
      <div aria-live="polite" style={{marginTop:'1.4rem',padding:'1.2rem',borderRadius:12,background:'var(--bg-secondary)',border:'1px solid var(--border)',textAlign:'center'}}>
        <div style={{fontSize:'clamp(1.6rem,5vw,2.5rem)',fontFamily:'var(--font-display)',color:'var(--accent)'}}>{result.years} years, {result.months} months, {result.days} days</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:'.75rem',marginTop:'1rem'}}>
        <Stat label="Total days" value={result.totalDays.toLocaleString()}/><Stat label="Full weeks" value={result.weeks.toLocaleString()}/><Stat label="Approx. hours" value={result.hours.toLocaleString()}/><Stat label="Next birthday" value={`${result.untilBirthday} days`}/>
      </div>
    </>}
  </div>
}
function Stat({label:txt,value}:{label:string,value:string}){return <div style={{padding:'1rem',background:'var(--bg-secondary)',border:'1px solid var(--border)',borderRadius:10}}><div style={{fontSize:'.75rem',color:'var(--text-secondary)',textTransform:'uppercase'}}>{txt}</div><strong style={{display:'block',fontSize:'1.25rem',marginTop:'.3rem'}}>{value}</strong></div>}
const label={display:'grid',gap:'.45rem',color:'var(--text-secondary)',fontSize:'.88rem'} as const
const input={padding:'.75rem',borderRadius:8,border:'1px solid var(--border)',background:'var(--bg-primary)',color:'var(--text-primary)',colorScheme:'dark'} as const
