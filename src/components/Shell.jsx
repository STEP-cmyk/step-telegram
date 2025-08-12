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

import { Sun, Moon, Settings, Home, Target, CheckSquare, Heart, NotebookText, Trophy } from 'lucide-react'
import logo from '../assets/logo.svg'


export default function Shell({children}){
  const { data, setData } = useApp()
  const loc = useLocation()

  React.useEffect(()=>{
    applyTheme(data.settings.theme, { withFade: true })
  }, [data.settings.theme])

  React.useEffect(()=>{
    const un = bindParallax()
    return un
  }, [])
  React.useEffect(() => {
  const off = bindParallax()
  const conf = mountConfetti()

  // Сообщаем адаптеру как менять тему/ник через твой стейт
  initTG({
    setTheme: (theme, opts) => applyTheme(theme, opts),
    getNickname: () => data.settings.nickname,
    setNickname: (nickname) => setData(d => ({ ...d, settings:{ ...d.settings, nickname } })),
  })

  return () => { off?.(); conf?.destroy?.() }
}, [])

  const cycleTheme = () => {
    setData(d => ({ ...d, settings: { ...d.settings, theme: d.settings.theme === 'dark' ? 'light' : 'dark' } }))
  }

  const nav = [
    { to:'/',              label:'Сводка',       icon: Home },
    { to:'/goals',         label:'Цели',         icon: Target },
    { to:'/habits',        label:'Привычки',     icon: CheckSquare },
    { to:'/wishes',        label:'Хотелки',      icon: Heart },
    { to:'/notes',         label:'Записи',       icon: NotebookText },
    { to:'/competitions',  label:'Соревнования', icon: Trophy },
  ]
  const ThemeIcon = data.settings.theme === 'dark' ? Moon : Sun

  return (<div className="app-shell">
    <header className="header">
      <div className="header-inner container">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <img src={logo} alt="" style={{width:24,height:24,opacity:.85}} />
          STEP <span className="opacity-60">v0.2.0</span>
        </div>
        <div className="flex items-center gap-2">
          {data.settings.tipsOnHome && <Badge>Motivation ON</Badge>}
          <Button variant="primary" onClick={cycleTheme}><ThemeIcon size={16} className="mr-1"/> Theme: {data.settings.theme}</Button>
          <Link to="/settings" className="btn btn-primary"><Settings size={16} className="mr-1"/> Settings</Link>
        </div>
      </div>
    </header>

    {/* Key by route for fade/slide transition */}
    <main className="main container">
      <div key={loc.pathname} className="view">{children}</div>
    </main>

    <nav className="tabbar">
      <div className="tabbar-inner container">
        {nav.map(n => {
          const Icon = n.icon
          return (
            <Link key={n.to} to={n.to} className={'tab-item ' + (loc.pathname===n.to?'tab-active':'')}>
              <Icon size={16} className="tab-ico" />
              <span>{n.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  </div>)
}
