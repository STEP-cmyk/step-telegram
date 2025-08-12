import React from 'react'
export default function Button({children, variant='default', className='', ...rest}){
  const map={ primary:' btn-primary' }
  const v=map[variant]||''
  return <button {...rest} className={'btn'+v+(className?' '+className:'')}>{children}</button>
}
