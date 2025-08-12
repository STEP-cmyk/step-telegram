import React from 'react'
export default function Progress({current=0,target=0}){
  const pct = target>0 ? Math.min(100, Math.round((current/target)*100)) : 0
  return (<div className="w-full h-3 rounded-full" style={{background:'var(--muted)'}}>
    <div className="h-full" style={{background:'var(--accent)', color:'var(--accentText)', width:pct+'%'}} />
  </div>)
}
