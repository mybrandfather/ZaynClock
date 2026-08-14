'use client'
import { useEffect, useRef, useState } from 'react'
import FullscreenButton from '@/components/features/FullscreenButton'

type Phase = 'ready'|'prepare'|'work'|'rest'|'done'|'paused'
const fmt=(ms:number)=>{const s=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
export default function IntervalTimerClient(){
 const [work,setWork]=useState(30),[rest,setRest]=useState(15),[rounds,setRounds]=useState(8),[prepare,setPrepare]=useState(10)
 const [phase,setPhase]=useState<Phase>('ready'),[round,setRound]=useState(1),[left,setLeft]=useState(0)
 const deadline=useRef<number|null>(null), resumePhase=useRef<Exclude<Phase,'paused'|'ready'|'done'>>('prepare')
 const duration=(p:Phase)=> (p==='prepare'?prepare:p==='work'?work:rest)*1000
 const begin=(p:'prepare'|'work'|'rest',ms=duration(p))=>{resumePhase.current=p;setPhase(p);setLeft(ms);deadline.current=Date.now()+ms}
 useEffect(()=>{if(!['prepare','work','rest'].includes(phase)||deadline.current===null)return;const tick=()=>{const n=Math.max(0,deadline.current!-Date.now());setLeft(n);if(n<=0){deadline.current=null;if(phase==='prepare')begin('work');else if(phase==='work')begin('rest');else if(round<rounds){setRound(r=>r+1);begin('work')}else setPhase('done')}};tick();const id=setInterval(tick,100);return()=>clearInterval(id)},[phase,round,rounds,work,rest,prepare])
 const start=()=>{setRound(1);prepare>0?begin('prepare'):begin('work')}
 const pause=()=>{if(!['prepare','work','rest'].includes(phase))return;setLeft(Math.max(0,(deadline.current??Date.now())-Date.now()));deadline.current=null;resumePhase.current=phase as any;setPhase('paused')}
 const resume=()=>begin(resumePhase.current,left)
 const reset=()=>{deadline.current=null;setPhase('ready');setRound(1);setLeft(0)}
 const progress=phase==='ready'||phase==='done'?0:Math.max(0,Math.min(100,100-left/duration(phase==='paused'?resumePhase.current:phase)*100))
 return <div id="interval-fs" style={{background:'var(--bg-primary)'}}>
  <div className="card" style={{textAlign:'center',padding:'2rem 1rem',marginBottom:'1.25rem'}}>
   <div style={{fontSize:'1rem',color:'var(--text-secondary)',textTransform:'uppercase'}}>{phase==='ready'?'Ready':phase==='done'?'Complete':phase==='paused'?`Paused · ${resumePhase.current}`:`${phase} · Round ${round}/${rounds}`}</div>
   <div style={{fontFamily:'var(--font-display)',fontSize:'clamp(4rem,16vw,8rem)',color:'var(--accent)',lineHeight:1,margin:'1rem 0'}}>{phase==='ready'?fmt(work*1000):phase==='done'?'DONE':fmt(left)}</div>
   <div aria-hidden style={{height:10,borderRadius:6,background:'var(--border)',overflow:'hidden',maxWidth:600,margin:'0 auto 1.25rem'}}><div style={{height:'100%',width:`${progress}%`,background:'var(--accent)',transition:'width .1s linear'}}/></div>
   <div style={{display:'flex',justifyContent:'center',gap:'.5rem',flexWrap:'wrap'}}>
    {(phase==='ready'||phase==='done')&&<button className="btn-primary" onClick={start}>▶ Start</button>}
    {['prepare','work','rest'].includes(phase)&&<button className="btn-primary" onClick={pause}>⏸ Pause</button>}
    {phase==='paused'&&<button className="btn-primary" onClick={resume}>▶ Resume</button>}
    <button className="btn-ghost" onClick={reset}>↺ Reset</button><FullscreenButton targetId="interval-fs"/>
   </div>
  </div>
  {phase==='ready'&&<div className="card"><h2 style={{fontSize:'1rem',marginBottom:'.75rem'}}>Interval settings</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:'.75rem'}}>
   {[['Prepare',prepare,setPrepare,0,600],['Work',work,setWork,1,3600],['Rest',rest,setRest,0,3600],['Rounds',rounds,setRounds,1,100]].map(([label,val,set,min,max]:any)=><label key={label} style={{fontSize:'.8rem',color:'var(--text-secondary)'}}>{label} {label==='Rounds'?'':'(sec)'}<input type="number" value={val} min={min} max={max} onChange={e=>set(Math.min(max,Math.max(min,Number(e.target.value)||min)))} style={{display:'block',width:'100%',marginTop:4,padding:'.55rem',background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border)',borderRadius:'.4rem'}}/></label>)}
  </div><div style={{display:'flex',gap:'.4rem',flexWrap:'wrap',marginTop:'1rem'}}>{[[20,10,8,'Tabata'],[45,15,10,'HIIT'],[180,60,5,'Boxing'],[1500,300,4,'Study cycles']].map(([w,r,n,l]:any)=><button key={l} className="btn-ghost" onClick={()=>{setWork(w);setRest(r);setRounds(n)}}>{l}</button>)}</div></div>}
 </div>
}
