import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import Button from './ui/Button'
import Badge from './ui/Badge'
import Tooltip from './ui/Tooltip'

import { useApp } from '../store/app.jsx'
import { applyTheme } from '../lib/theme'      
import { applyUIScale } from '../lib/ui'
import { bindParallax } from '../lib/parallax'
import { mountConfetti } from '../lib/confetti'
import { initTG } from '../lib/tg'

import { Sun, Moon, Settings, Home, Target, CheckSquare, Heart, NotebookText, Trophy, Zap } from 'lucide-react'
import logo from '../assets/logo.svg'


export default function Shell({children}){
  const { data, setData, ready, error } = useApp()
  const loc = useLocation()

  // Show loading state while data is being initialized
  if (!ready) {
    return (
      <div className="min-h-dvh bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state if there was an error loading data
  if (error) {
    return (
      <div className="min-h-dvh bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
            Failed to load data
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            There was an error loading your data. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Ensure theme is applied even if it wasn't set properly
  React.useEffect(() => {
    if (ready && data?.settings?.theme) {
      console.log('Applying theme:', data.settings.theme)
      applyTheme(data.settings.theme, { withFade: true })
    } else if (ready) {
      // Fallback: apply default theme
      console.log('No theme set, applying default dark theme')
      applyTheme('dark', { withFade: false })
    }
  }, [data?.settings?.theme, ready])

  React.useEffect(()=>{
    const un = bindParallax()
    return un
  }, [])
  
  React.useEffect(() => {
    if (!ready) return
    
    const off = bindParallax()
    const conf = mountConfetti()

    // Сообщаем адаптеру как менять тему/ник через твой стейт
    initTG({
      setTheme: (theme, opts) => {
        console.log('TG setTheme called with:', theme)
        applyTheme(theme, opts)
      },
      getNickname: () => data?.settings?.nickname || 'User',
      setNickname: (nickname) => setData(d => ({ ...d, settings:{ ...d.settings, nickname } })),
    })

    return () => { off?.(); conf?.destroy?.() }
  }, [ready])

  const cycleTheme = () => {
    const newTheme = data?.settings?.theme === 'dark' ? 'light' : 'dark'
    console.log('Cycling theme from', data?.settings?.theme, 'to', newTheme)
    setData(d => ({ ...d, settings: { ...d.settings, theme: newTheme } }))
  }

  const nav = [
    { to:'/',              label:'Summary',      icon: Home },
    { to:'/goals',         label:'Goals',        icon: Target },
    { to:'/habits',        label:'Habits',       icon: CheckSquare },
    { to:'/wishes',        label:'Wishes',       icon: Heart },
    { to:'/notes',         label:'Notes',        icon: NotebookText },
    { to:'/competitions',  label:'Competitions', icon: Trophy },
  ]
  const ThemeIcon = data?.settings?.theme === 'dark' ? Moon : Sun

  console.log('Current location:', loc.pathname)
  console.log('Navigation items:', nav)

  return (
    <div className="app-container min-h-dvh bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-orange-900/20 text-zinc-900 dark:text-zinc-50">
      <header className="header">
        <div className="header-inner container">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="w-6 h-6 opacity-85" />
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg">STEP</span>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full font-medium">
                v0.3.0
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.settings?.tipsOnHome && (
              <Badge>
                <Zap size={14} className="mr-1"/>
                Motivation ON
              </Badge>
            )}
            <Button variant="primary" onClick={cycleTheme}>
              <ThemeIcon size={16} className="mr-1"/>
              Theme: {data?.settings?.theme}
            </Button>
            <Link to="/settings" className="btn btn-primary">
              <Settings size={16} className="mr-1"/>
              Settings
            </Link>
          </div>
        </div>
      </header>

      {/* Key by route for fade/slide transition */}
      <main className="main max-w-3xl mx-auto px-3 md:px-4 pt-2 md:pt-4">
        {children}
      </main>

      <nav className="tabbar">
        <div className="max-w-3xl mx-auto px-2 py-2 md:py-2">
          <div className="flex justify-between items-center w-full gap-1 md:gap-2">
            {nav.map((item, i) => {
              const Icon = item.icon
              const isActive = loc.pathname === item.to
              return (
                <Link
                  key={i}
                  to={item.to}
                  className={`tab-item flex-1 h-16 md:h-14 ${
                    isActive 
                      ? 'tab-active' 
                      : ''
                  }`}
                  style={{ textDecoration: 'none' }}
                >
                  <Icon size={20} className="tab-ico" />
                  <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
