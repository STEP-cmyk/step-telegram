import React from 'react'

export default function Input({ 
  className = '', 
  size = 'md',
  ...props 
}) {
  const baseClasses = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-4 py-3 text-base rounded-xl'
  }
  
  const classes = [
    baseClasses,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ')
  
  return <input {...props} className={classes} />
}
