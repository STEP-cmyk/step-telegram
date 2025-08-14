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
    <Section title="Сегодня" right={<Badge>{new Date().toLocaleDateString()}</Badge>} tone="text-green-600 dark:text-green-400">
      {data.habits.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>No habits yet. Create your first habit to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.habits.slice(0, 3).map(h => (
            <div key={h.id} className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 p-2">
              <span className="text-sm">{h.title}</span>
              <Button size="sm" variant="primary">Mark Done</Button>
            </div>
          ))}
        </div>
      )}
    </Section>

    <Section title="Сводка" tone="text-cyan-600 dark:text-cyan-400">
      <div className="space-y-2">
        <div className="rounded-2xl p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">Цели: <b>{data.goals.length}</b></div>
        <div className="rounded-2xl p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">Привычки: <b>{data.habits.length}</b></div>
        <div className="rounded-2xl p-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">Хотелки: <b>{data.wishes.length}</b></div>
      </div>
    </Section>

    {data.settings.tipsOnHome && (
      <Section title="Мотивация дня" right={<Badge>on</Badge>} tone="text-orange-600 dark:text-orange-400">
        <div className="text-center py-4">
          <p className="text-lg font-medium mb-2">"{data.tips[0].text}"</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">— Daily Motivation</p>
        </div>
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
