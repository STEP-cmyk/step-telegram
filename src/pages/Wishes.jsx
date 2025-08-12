import React from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Progress from '../components/ui/Progress'
import { useApp } from '../store/app.jsx'
import { uid, currency } from '../lib/utils'

export default function Wishes(){
  const { data, setData } = useApp()
  const [form, setForm] = React.useState({ title:'iPhone', targetAmount:200000, savedAmount:0, deadline:'', link:'' })

  const addWish = () => setData(d => ({ ...d, wishes:[...d.wishes, { id:uid(), ...form }] }))
  const updateWish = (id, patch) => setData(d => ({ ...d, wishes: d.wishes.map(w => w.id===id? {...w,...patch}:w) }))

  return (<div>
    <Section title="Добавить хотелку" tone="var(--clr-wish)">
      <div className="grid md:grid-cols-5 gap-2">
        <Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Название" />
        <Input type="number" value={form.targetAmount} onChange={e=>setForm({...form,targetAmount:Number(e.target.value)})} placeholder="Целевая сумма" />
        <Input type="number" value={form.savedAmount} onChange={e=>setForm({...form,savedAmount:Number(e.target.value)})} placeholder="Уже накоплено" />
        <Input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
        <Input value={form.link} onChange={e=>setForm({...form,link:e.target.value})} placeholder="Ссылка (опц.)" />
      </div>
      <div className="mt-2"><Button variant="primary" onClick={()=>{ addWish(); setForm({ title:'', targetAmount:0, savedAmount:0, deadline:'', link:'' }) }}>Сохранить</Button></div>
    </Section>

    <Section title="Мои хотелки" tone="var(--clr-wish)">
      {data.wishes.length===0? <div className="text-sm opacity-60">Ещё нет.</div> :
        <div className="grid gap-2">
          {data.wishes.map(w => (
            <div key={w.id} className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{w.title}</div>
                  <div className="text-xs opacity-60">Цель: {currency(w.targetAmount)} · Накоплено: {currency(w.savedAmount)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={()=> updateWish(w.id, { savedAmount: Math.min((w.savedAmount||0)+1000, w.targetAmount||Infinity) })}>+1 000</Button>
                  <Button onClick={()=> updateWish(w.id, { savedAmount: Math.max((w.savedAmount||0)-1000, 0) })}>-1 000</Button>
                </div>
              </div>
              <div className="mt-2"><Progress current={w.savedAmount||0} target={w.targetAmount||0} /></div>
              {w.link && <div className="mt-1 text-xs truncate"><a href={w.link} target="_blank" rel="noreferrer" style={{color:'#3b82f6'}}>{w.link}</a></div>}
            </div>
          ))}
        </div>
      }
    </Section>
  </div>)
}
