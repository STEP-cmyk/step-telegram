import React from 'react'
import Card from './ui/Card'
export default function Section({title,right,children,tone}){
  return (<div className="section" style={{'--tone': tone}}>
    <div className="section-head">
      <div className="section-title"><span className="dot" />{title}</div>{right}
    </div>
    <Card>{children}</Card>
  </div>)
}
