import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SummaryTile({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'blue',
  onClick,
  route,
  trend = null // 'up', 'down', or null
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (route) {
      navigate(route)
    }
  }

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
  }

  const trendIcons = {
    up: '↗',
    down: '↘'
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full p-4 rounded-xl border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${colorClasses[color]}`}
      style={{ minHeight: '80px' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <div className="w-6 h-6 flex items-center justify-center">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium leading-tight" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}>
              {title}
            </h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {value}
            </span>
            {trend && (
              <span className="text-sm opacity-75">
                {trendIcons[trend]}
              </span>
            )}
          </div>
          
                      {subtitle && (
              <p className="text-xs opacity-75 mt-1 leading-tight" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word'
              }}>
                {subtitle}
              </p>
            )}
        </div>
      </div>
    </button>
  )
}
