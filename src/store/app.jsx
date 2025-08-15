import React from 'react'

const LS_KEY = 'step_020'

export const DEFAULT = {
  settings: {
    theme: 'dark',              // 'light' | 'dark' | 'dim' | 'amoled' | 'solarizedLight' | 'solarizedDark' | 'highContrast' | 'system'
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
    // Проверяем, что мы в браузере и localStorage доступен
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, using default data')
      return DEFAULT
    }

    const stored = localStorage.getItem(LS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure all required arrays exist
      return {
        ...DEFAULT,
        ...parsed,
        goals: parsed.goals || [],
        habits: parsed.habits || [],
        wishes: parsed.wishes || [],
        completedItems: parsed.completedItems || [],
        journals: parsed.journals || DEFAULT.journals,
        competitions: parsed.competitions || DEFAULT.competitions,
        tips: parsed.tips || DEFAULT.tips
      }
    }
    return DEFAULT
  } catch(error) {
    console.error('Error loading data from localStorage:', error)
    return DEFAULT
  }
}

export function save(d){ 
  try {
    // Проверяем, что мы в браузере и localStorage доступен
    if (typeof window === 'undefined' || !window.localStorage) {
      console.log('localStorage not available, skipping save')
      return
    }

    localStorage.setItem(LS_KEY, JSON.stringify(d)) 
  } catch(error) {
    console.error('Error saving data to localStorage:', error)
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
