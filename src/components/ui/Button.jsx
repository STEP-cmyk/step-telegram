import React from 'react'

export default function Button({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '', 
  disabled = false,
  ...rest 
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl'
  }
  
  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 border border-gray-300 focus:ring-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-gray-400',
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border border-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white border border-gray-600 focus:ring-gray-500',
    outline: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-500 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700 focus:ring-gray-500 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300'
  }
  
  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <button 
      {...rest} 
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
