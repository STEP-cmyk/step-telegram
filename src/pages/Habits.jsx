import React from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useApp } from '../store/app.jsx'
import { uid, todayISO } from '../lib/utils'

export default function Habits(){
  const { data, setData } = useApp()
  const [form, setForm] = React.useState({ title:'Пить воду', type:'binary', quantTarget:8 })
  const t = todayISO()

  const addHabit = () => setData(d => ({ ...d, habits:[...d.habits, { id:uid(), history:{}, streak:0, best:0, ...form }] }))
  const markHabit = (id,val) => setData(d => ({ ...d, habits:d.habits.map(h=>{
    if(h.id!==id) return h
    const history={...(h.history||{})}; history[t]=val ?? (h.type==='binary' ? !(history[t]===true) : (history[t]||0)+1)
    const streak=calcStreak(history); return {...h,history,streak,best:Math.max(h.best||0,streak)}
  }) }))

  return (<div>
    <Section title="Добавить привычку" tone="var(--clr-habit)">
      <div className="grid md:grid-cols-4 gap-2">
        <Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Название" />
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="select">
          <option value="binary">галочка</option>
          <option value="quant">количественная</option>
        </select>
        <Input type="number" value={form.quantTarget} onChange={e=>setForm({...form,quantTarget:Number(e.target.value)})} placeholder="цель/день" />
        <Button variant="primary" onClick={()=>{ addHabit(); setForm({ title:'', type:'binary', quantTarget:8 }) }}>Сохранить</Button>
      </div>
    </Section>

    <Section title="Мои привычки" tone="var(--clr-habit)">
      {data.habits.length===0? <div className="text-sm opacity-60">Ещё нет привычек.</div> :
        <div className="grid gap-2">
          {data.habits.map(h => (
            <div key={h.id} className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{h.title}</div>
                  <div className="text-xs opacity-60">серия: {h.streak} · лучшая: {h.best}</div>
                </div>
                <Button variant="primary" onClick={()=> markHabit(h.id, h.type==='binary'? true : (Number(h.history?.[t]||0)+1))}>
                  {h.type==='binary'? (h.history?.[t]===true? 'Снять' : 'Сделано') : '+1'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      }
    </Section>
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
