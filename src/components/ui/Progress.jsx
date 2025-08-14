import React from 'react'
export default function Progress({current=0,target=0}){
  const pct = target>0 ? Math.min(100, Math.round((current/target)*100)) : 0
  return (<div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700">
    <div className="progress-bar h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300" style={{width:pct+'%'}} />
  </div>)
}
