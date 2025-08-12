import React from 'react'
export default function Switch({checked,onChange,className=''}){
  return (
    <button type="button" role="switch" aria-checked={checked}
      onClick={()=>onChange?.(!checked)}
      className={'switch '+(checked?'is-on ':'')+className}>
      <span className="switch-handle" />
    </button>
  )
}
