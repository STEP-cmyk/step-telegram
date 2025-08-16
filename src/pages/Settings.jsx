import React from 'react'
import { useNavigate } from 'react-router-dom'
import Section from '../components/Section'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Switch from '../components/ui/Switch'
import Button from '../components/ui/Button'
import LanguageSelector from '../components/ui/LanguageSelector'
import UnitsSettings from '../components/ui/UnitsSettings'
import { useApp } from '../store/app.jsx'
import { Palette, Eye, EyeOff } from 'lucide-react'
import { useTranslation, getCurrentLanguage } from '../lib/i18n'

export default function Settings(){
  const navigate = useNavigate()
  const { data, setData } = useApp()
  const { t } = useTranslation()
  const s = data.settings
  const setSettings = (patch) => setData(d => ({ ...d, settings:{ ...d.settings, ...patch } }))

  // Expand Telegram WebApp viewport to ensure footer is visible
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.expand()
        console.log('Telegram WebApp viewport expanded for Settings footer visibility')
      } catch (error) {
        console.warn('Could not expand Telegram WebApp viewport:', error)
      }
    }
    
    // Debug: Log footer visibility
    console.log('Settings page mounted - footer should be visible at bottom')
  }, [])

  // Get current theme display name
  const getCurrentThemeName = () => {
    if (s.theme === 'system') return t('system')
    if (s.theme === 'solarizedLight') return t('solarizedLight')
    if (s.theme === 'solarizedDark') return t('solarizedDark')
    if (s.theme === 'highContrast') return t('highContrast')
    if (s.theme === 'amoled') return t('amoled')
    if (s.theme === 'dim') return t('dim')
    if (s.theme === 'dark') return t('dark')
    if (s.theme === 'light') return t('light')
    return t('dark')
  }

  return (
    <div className="settings-scroll-container">
      <div className="settings-scroll-content px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <Section title={t('profile')} tone="text-blue-600 dark:text-blue-400">
      <div className="grid md:grid-cols-2 gap-4">
                  <div>
            <label className="block text-sm font-medium mb-2">{t('nickname')}</label>
            <Input value={s.nickname} onChange={e=>setSettings({ nickname:e.target.value })} placeholder={t('nickname')} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('defaultTab')}</label>
                      <Select value={s.defaultTab} onChange={e=>setSettings({ defaultTab:e.target.value })}>
              <option value="summary">{t('summary')}</option>
              <option value="goals">{t('goals')}</option>
              <option value="habits">{t('habits')}</option>
              <option value="wishes">{t('wishes')}</option>
              <option value="notes">{t('notes')}</option>
              <option value="competitions">{t('competitions')}</option>
            </Select>
        </div>
      </div>
    </Section>

    <Section title={t('theme')} tone="text-purple-600 dark:text-purple-400">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Palette size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {t('currentTheme')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getCurrentThemeName()}
              </p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => {
              console.log('Theme button clicked, navigating to /themes')
              navigate('/themes')
            }}
            className="px-6"
          >
            {t('change')}
          </Button>
        </div>
      </div>
    </Section>

    <Section title={t('language')} tone="text-blue-600 dark:text-blue-400">
      <LanguageSelector />
    </Section>

    <Section title={t('unitsAndCurrency')} tone="text-green-600 dark:text-green-400">
      <UnitsSettings 
        units={s.units || { currency: 'RUB', weight: 'kg', length: 'cm' }}
        onUnitsChange={(units) => setSettings({ units })}
      />
    </Section>

    <Section title={t('visibility')} tone="text-orange-600 dark:text-orange-400">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Eye size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {t('notes')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('notesVisibilityDescription')}
              </p>
            </div>
          </div>
          <Switch 
            checked={s.visibility?.notes !== false} 
            onChange={(v) => setSettings({ 
              visibility: { ...s.visibility, notes: v } 
            })} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Eye size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {t('competitions')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('competitionsVisibilityDescription')}
              </p>
            </div>
          </div>
          <Switch 
            checked={s.visibility?.competitions !== false} 
            onChange={(v) => setSettings({ 
              visibility: { ...s.visibility, competitions: v } 
            })} 
          />
        </div>
      </div>
    </Section>

    <Section title={t('notifications')} tone="text-green-600 dark:text-green-400">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium mb-1">{t('quietMode')}</label>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('quietModeDescription')}</p>
          </div>
          <Switch checked={s.quietHours.enabled} onChange={(v)=>setSettings({ quietHours:{...s.quietHours, enabled:v} })} />
        </div>
        {s.quietHours.enabled && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('from')}</label>
              <Input type="number" min="0" max="23" value={s.quietHours.from} onChange={e=>setSettings({ quietHours:{...s.quietHours, from:Number(e.target.value)} })} placeholder="22" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('to')}</label>
              <Input type="number" min="0" max="23" value={s.quietHours.to} onChange={e=>setSettings({ quietHours:{...s.quietHours, to:Number(e.target.value)} })} placeholder="7" />
            </div>
          </div>
        )}
      </div>
    </Section>

    <Section title={t('data')} tone="text-orange-600 dark:text-orange-400">
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {t('dataDescription')}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={()=>{ 
              const blob=new Blob([localStorage.getItem('step_020')||'{}'],{type:'application/json'}); 
              const url=URL.createObjectURL(blob); 
              const a=document.createElement('a'); 
              a.href=url; 
              a.download='step_020_export.json'; 
              a.click(); 
              URL.revokeObjectURL(url); 
            }}
            variant="outline"
          >
            {t('exportJSON')}
          </Button>
          <Button 
            onClick={()=>{ 
              const el=document.createElement('input'); 
              el.type='file'; 
              el.accept='.json,application/json'; 
              el.onchange=(e)=>{ 
                const file=e.target.files?.[0]; 
                if(!file) return; 
                file.text().then(t=>{ 
                  try{ 
                    const obj=JSON.parse(t); 
                    localStorage.setItem('step_020', JSON.stringify(obj)); 
                    window.location.reload(); 
                  }catch(err){ 
                    alert(t('error')); 
                  } 
                }); 
              }; 
              el.click(); 
            }}
            variant="outline"
          >
            {t('importJSON')}
          </Button>
          <Button 
            onClick={()=>{ 
              if (confirm(t('resetDataConfirm'))) {
                localStorage.removeItem('step_020'); 
                location.reload() 
              }
            }}
            variant="outline"
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            {t('resetData')}
          </Button>
        </div>
      </div>
    </Section>

    {/* Made in Russia footer - Always visible in both themes */}
    <div className="settings-footer relative z-10 mt-8 pt-6 border-t border-gray-300 dark:border-gray-600 min-h-[2rem] mb-8">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-slate-800 dark:text-slate-200">{t('madeInRussia') || (getCurrentLanguage() === 'ru' ? 'Сделано в России' : 'Made in Russia')}</span>
        <svg 
          width="24" 
          height="16" 
          viewBox="0 0 24 16" 
          className="flex-shrink-0"
          aria-label="Russia flag"
          role="img"
        >
          <rect width="24" height="16" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.75"/>
          <rect x="0" y="0" width="24" height="5.33" fill="#ffffff"/>
          <rect x="0" y="5.33" width="24" height="5.34" fill="#0052cc"/>
          <rect x="0" y="10.67" width="24" height="5.33" fill="#d52b1e"/>
        </svg>
      </div>
    </div>
      </div>
      {/* Bottom spacer for safe areas and sticky elements */}
      <div className="h-6 md:h-8" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}></div>
    </div>
  )
}
