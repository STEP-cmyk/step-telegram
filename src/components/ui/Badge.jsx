import React from 'react'
export default function Badge({children,className=''}){return <span className={'badge'+(className?' '+className:'')}>{children}</span>}
