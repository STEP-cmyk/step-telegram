import React from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useApp } from '../store/app.jsx'
import { todayISO } from '../lib/utils'
import { usePlugins } from '../plugins'

export default function Summary(){
  const { data, setData } = useApp()
  const t = todayISO()
  const habits = data.habits.slice(0,4)
  const { cards } = usePlugins()

  const markHabit = (id, value) => {
    setData(d => ({
      ...d,
      habits: d.habits.map(h => {
        if (h.id !== id) return h
        const history = { ...(h.history||{}) }
        history[t] = value ?? (h.type==='binary' ? !(history[t]===true) : (history[t]||0) + 1)
        const streak = calcStreak(history)
        return { ...h, history, streak, best: Math.max(h.best||0, streak) }
      })
    }))
  }

  return (<div>
    <Section title="Сегодня" right={<Badge>{new Date().toLocaleDateString()}</Badge>} tone="var(--clr-habit)">
      {habits.length===0? (
        <div className="text-sm opacity-70">Нет привычек на сегодня. Добавьте первую в разделе «Привычки».</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {habits.map(h => (
            <div key={h.id} className="flex items-center justify-between rounded-2xl" style={{border:'1px solid var(--border)', padding:8}}>
              <div>
                <div className="font-medium">{h.title}</div>
                <div className="text-xs opacity-60">{h.type==='binary' ? 'галочка' : `прогресс: ${Number(h.history?.[t]||0)} / ${h.quantTarget||0}`}</div>
              </div>
              <Button variant="primary" onClick={()=>markHabit(h.id, h.type==='binary'? true : (Number(h.history?.[t]||0)+1))}>
                {h.type==='binary'? (h.history?.[t]===true? 'Снять' : 'Сделано') : '+1'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Section>

    <Section title="Сводка" tone="var(--clr-note)">
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>Цели: <b>{data.goals.length}</b></div>
        <div className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>Привычки: <b>{data.habits.length}</b></div>
        <div className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>Хотелки: <b>{data.wishes.length}</b></div>
      </div>
    </Section>

    {data.settings.tipsOnHome && (
      <Section title="Мотивация дня" right={<Badge>on</Badge>} tone="var(--clr-compet)">
        <div className="text-sm">{data.tips[Math.floor(Math.random()*data.tips.length)]?.text}</div>
      </Section>
    )}

    {cards.map((C, idx) => <C key={idx} />)}
  </div>)
}

function calcStreak(history){
  let streak=0
  for(let i=0;i<365;i++){
    const d=new Date(); d.setDate(d.getDate()-i)
    const iso=d.toISOString().slice(0,10)
    const v=history?.[iso]; const ok=v===true || (typeof v==='number' && v>0)
    if(ok) streak++; else break
  }
  return streak
}
