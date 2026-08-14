import type { MetadataRoute } from 'next'
export default function manifest():MetadataRoute.Manifest{return{name:'ZaynClock – Clock & Time Tools',short_name:'ZaynClock',description:'Free clocks, timers, calculators and productivity tools.',start_url:'/',display:'standalone',background_color:'#080910',theme_color:'#080910',icons:[{src:'/zaynclock-logo.png',sizes:'512x512',type:'image/png'}]}}
