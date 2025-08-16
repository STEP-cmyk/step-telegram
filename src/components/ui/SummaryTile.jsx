import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tooltip from './Tooltip'

export default function SummaryTile({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue',
  onClick,
  route,
  trend = null, // 'up', 'down', or null
  delta = null  // Optional delta text like "vs last week"
}) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (route) {
      navigate(route)
    }
  }

  // Modern gradient-based color system with glassmorphism for light theme
  const colorConfig = {
    blue: {
      gradient: 'from-blue-50/80 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20',
      border: 'border-blue-200/60 dark:border-blue-800/30',
      accent: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-blue-950 dark:text-blue-100',
      number: 'text-blue-950 dark:text-blue-50',
      icon: 'text-blue-600 dark:text-blue-400',
      shadow: 'shadow-blue-200/30 dark:shadow-blue-900/40'
    },
    green: {
      gradient: 'from-emerald-50/80 to-emerald-100/60 dark:from-emerald-950/30 dark:to-emerald-900/20',
      border: 'border-emerald-200/60 dark:border-emerald-800/30',
      accent: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      text: 'text-emerald-950 dark:text-emerald-100',
      number: 'text-emerald-950 dark:text-emerald-50',
      icon: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-200/30 dark:shadow-emerald-900/40'
    },
    purple: {
      gradient: 'from-purple-50/80 to-purple-100/60 dark:from-purple-950/30 dark:to-purple-900/20',
      border: 'border-purple-200/60 dark:border-purple-800/30',
      accent: 'bg-gradient-to-r from-purple-500 to-purple-600',
      text: 'text-purple-950 dark:text-purple-100',
      number: 'text-purple-950 dark:text-purple-50',
      icon: 'text-purple-600 dark:text-purple-400',
      shadow: 'shadow-purple-200/30 dark:shadow-purple-900/40'
    },
    orange: {
      gradient: 'from-orange-50/80 to-orange-100/60 dark:from-orange-950/30 dark:to-orange-900/20',
      border: 'border-orange-200/60 dark:border-orange-800/30',
      accent: 'bg-gradient-to-r from-orange-500 to-orange-600',
      text: 'text-orange-950 dark:text-orange-100',
      number: 'text-orange-950 dark:text-orange-50',
      icon: 'text-orange-600 dark:text-orange-400',
      shadow: 'shadow-orange-200/30 dark:shadow-orange-900/40'
    },
    red: {
      gradient: 'from-red-50/80 to-red-100/60 dark:from-red-950/30 dark:to-red-900/20',
      border: 'border-red-200/60 dark:border-red-800/30',
      accent: 'bg-gradient-to-r from-red-500 to-red-600',
      text: 'text-red-950 dark:text-red-100',
      number: 'text-red-950 dark:text-red-50',
      icon: 'text-red-600 dark:text-red-400',
      shadow: 'shadow-red-200/30 dark:shadow-red-900/40'
    }
  }

  const config = colorConfig[color]
  const trendIcons = { up: '↗', down: '↘' }
  
  // Check if title needs wrapping (estimate based on character count)
  const needsTooltip = title.length > 20
  const shouldWrap = title.length > 12 && title.length <= 20

  return (
    <Tooltip content={needsTooltip ? title : null}>
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative w-full h-28 rounded-2xl border backdrop-blur-md
          bg-gradient-to-br ${config.gradient} ${config.border}
          transition-all duration-300 ease-out
          hover:scale-[1.02] hover:shadow-lg ${config.shadow}
          focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
          active:scale-[0.98]
          overflow-hidden
        `}
        style={{ minWidth: '44px', minHeight: '112px' }}
      >
        {/* Subtle gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${config.accent} opacity-60`} />
        
        {/* Shimmer effect on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          transform -skew-x-12 -translate-x-full
          transition-transform duration-700 ease-out
          ${isHovered ? 'translate-x-full' : ''}
        `} />

        <div className="relative h-full p-3 flex flex-col justify-between">
          {/* Header with icon and title */}
          <div className="flex items-start gap-2 min-h-0">
            {icon && (
              <div className={`flex-shrink-0 w-4 h-4 flex items-center justify-center mt-0.5 ${config.icon}`}>
                {typeof icon === 'string' ? (
                  <span className="text-sm leading-none">{icon}</span>
                ) : (
                  React.cloneElement(icon, { size: 14 })
                )}
              </div>
            )}
            <h3 className={`
              text-xs font-medium leading-tight flex-1 ${config.text}
              ${shouldWrap ? 'line-clamp-2 break-words hyphens-none' : 'truncate'}
            `} style={{ hyphens: 'none', wordBreak: 'normal', overflowWrap: 'break-word' }}>
              {needsTooltip ? title.substring(0, 18) + '...' : title}
            </h3>
          </div>

          {/* Main value - centered vertically */}
          <div className="flex items-center justify-center flex-1 min-h-0">
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold leading-none ${config.number}`}>
                {value}
              </span>
              {trend && (
                <span className={`text-xs opacity-60 ${config.text}`}>
                  {trendIcons[trend]}
                </span>
              )}
            </div>
          </div>

          {/* Subtitle and delta */}
          <div className="flex items-center justify-between gap-1 min-h-0">
            {subtitle && (
              <span className={`text-xs opacity-75 leading-tight line-clamp-1 flex-1 ${config.text}`} style={{ hyphens: 'none', wordBreak: 'normal', overflowWrap: 'break-word' }}>
                {subtitle}
              </span>
            )}
            {delta && (
              <span className={`text-xs opacity-50 leading-tight truncate ${config.text}`}>
                {delta}
              </span>
            )}
          </div>
        </div>
      </button>
    </Tooltip>
  )
}
