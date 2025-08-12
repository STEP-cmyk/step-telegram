import React from 'react'
export default function Select(props){return <select {...props} className={'select'+(props.className?' '+props.className:'')}>{props.children}</select>}
