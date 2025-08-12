import React from 'react'

const LS_KEY = 'step_020'

export const DEFAULT = {
  settings: {
    theme: 'dark',              // только 'light' | 'dark'
    defaultTab: 'summary',
    tipsOnHome: true,
    nickname: 'User',
    quietHours: { enabled: true, from: 22, to: 7 },
    currency: '₽',
  },
  goals: [], habits: [], wishes: [],
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

export function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)) || DEFAULT }catch{ return DEFAULT } }
export function save(d){ localStorage.setItem(LS_KEY, JSON.stringify(d)) }

export function AppProvider({children}){
  const [data, setData] = React.useState(DEFAULT)
  const [ready, setReady] = React.useState(false)
  React.useEffect(()=>{ const d=load(); setData(d); setReady(true) }, [])
  React.useEffect(()=>{ if(ready) save(data) }, [data, ready])
  const value = React.useMemo(()=>({ data, setData }), [data])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}
