import React from 'react'
import { safeGet, safeSet } from '../lib/safe-storage'

const LS_KEY = 'step_020'

export const DEFAULT = {
  settings: {
    theme: 'light',              // 'light' | 'dark' | 'dim' | 'amoled' | 'solarizedLight' | 'solarizedDark' | 'highContrast' | 'system'
    language: 'ru',             // 'en' | 'ru'
    defaultTab: 'summary',
    tipsOnHome: true,
    nickname: 'User',
    quietHours: { enabled: true, from: 22, to: 7 },
    currency: '₽',
    units: {
      currency: 'RUB',          // 'RUB' | 'USD' | 'EUR'
      weight: 'kg',             // 'kg' | 'lb'
      length: 'cm',             // 'cm' | 'ft'
    },
    visibility: {
      notes: true,              // Show/hide Notes section
      competitions: true,       // Show/hide Competitions section
    },
  },
  goals: [], 
  habits: [], 
  wishes: [],
  completedItems: [], // Store completed/deleted items
  journals: [{ id: 'inbox', name: 'Inbox', entries: [] }],
  competitions: {
    my: [],
    public: [{
      id:'pub_100_pushups', title:'100 отжиманий', type:'habit', duration:30,
      description:'30 дней без пропусков. Показываем ник и чистый прогресс.',
      leagues:[{id:'L1',name:'Лига 1 (0–15)'},{id:'L2',name:'Лига 2 (16–30)'},{id:'L3',name:'Лига 3 (31–50)'},{id:'L4',name:'Лига 4 (51+)'}]
    }]
  },
  tips: [
    { id:1, text:'Маленькие шаги каждый день сильнее мотивации раз в месяц.' },
    { id:2, text:'Записывай — голова отдыхает, система работает.' },
    { id:3, text:'Первый шаг не должен быть идеальным, он должен быть сделан.' },
  ]
}

export const AppCtx = React.createContext(null)
export const useApp = () => React.useContext(AppCtx)

export function load(){ 
  try{ 
    const stored = safeGet(LS_KEY)
    if (stored) {
      // Normalize goals to ensure they have all required properties
      const normalizedGoals = (stored.goals || []).map(goal => ({
        tags: [],
        unit: '',
        current: 0,
        target: 10,
        priority: 'Medium',
        description: '',
        attachments: [],
        category: 'Personal',
        completed: false,
        deleted: false,
        ...goal
      }))
      
      // Normalize habits to ensure they have all required properties
      const normalizedHabits = (stored.habits || []).map(habit => ({
        tags: [],
        type: 'binary',
        quantTarget: 8,
        category: 'health',
        activeDays: 'daily',
        customDays: [],
        duration: 'indefinite',
        reminders: [],
        description: '',
        streak: 0,
        lastCompleted: null,
        history: [],
        completed: false,
        deleted: false,
        ...habit
      }))
      
      // Normalize completed items as well
      const normalizedCompletedItems = (stored.completedItems || []).map(item => ({
        tags: [],
        unit: '',
        target: 10,
        priority: 'Medium',
        description: '',
        attachments: [],
        category: 'Personal',
        type: 'binary',
        quantTarget: 8,
        activeDays: 'daily',
        customDays: [],
        duration: 'indefinite',
        reminders: [],
        streak: 0,
        lastCompleted: null,
        history: [],
        ...item
      }))
      
      // Ensure all required arrays exist
      return {
        ...DEFAULT,
        ...stored,
        goals: normalizedGoals,
        habits: normalizedHabits,
        wishes: stored.wishes || [],
        completedItems: normalizedCompletedItems,
        journals: stored.journals || DEFAULT.journals,
        competitions: stored.competitions || DEFAULT.competitions,
        tips: stored.tips || DEFAULT.tips
      }
    }
    return DEFAULT
  } catch(error) {
    console.error('Error loading data:', error)
    return DEFAULT
  }
}

export function save(d){ 
  try {
    safeSet(LS_KEY, d)
  } catch(error) {
    console.error('Error saving data:', error)
  }
}

export function AppProvider({children}){
  const [data, setData] = React.useState(DEFAULT)
  const [ready, setReady] = React.useState(false)
  const [error, setError] = React.useState(null)
  
  React.useEffect(()=>{ 
    try {
      // Добавляем небольшую задержку для безопасной инициализации в Telegram Web App
      const timer = setTimeout(() => {
        const d = load()
        console.log('Loaded data:', d)
        
        // Ensure theme is properly set
        if (!d.settings || !d.settings.theme) {
          d.settings = { ...DEFAULT.settings, ...d.settings }
        }
        
        setData(d)
        setReady(true)
      }, 50)

      return () => clearTimeout(timer)
    } catch(err) {
      console.error('Error initializing app:', err)
      setError(err)
      setReady(true) // Still set ready so we can show error state
    }
  }, [])
  
  React.useEffect(()=>{ 
    if(ready && !error) {
      try {
        save(data) 
      } catch(err) {
        console.error('Error saving data:', err)
      }
    }
  }, [data, ready, error])
  
  const value = React.useMemo(()=>({ 
    data, 
    setData, 
    ready, 
    error 
  }), [data, ready, error])
  
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
