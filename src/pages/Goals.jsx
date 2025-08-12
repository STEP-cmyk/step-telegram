import React from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Progress from '../components/ui/Progress'
import { useApp } from '../store/app.jsx'
import { uid } from '../lib/utils'

export default function Goals(){
  const { data, setData } = useApp()
  const [form, setForm] = React.useState({ title:'Я зарабатываю 20000 ₽', deadline:'', unit:'шт', target:10, current:0 })

  const addGoal = () => setData(d => ({ ...d, goals:[...d.goals, { id:uid(), ...form }] }))
  const updateGoal = (id, patch) => setData(d => ({ ...d, goals: d.goals.map(g => g.id===id? {...g,...patch} : g) }))

  return (<div>
    <Section title="Добавить цель" tone="var(--clr-goal)">
      <div className="grid md:grid-cols-5 gap-2">
        <div className="md:col-span-2"><Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Я …" /></div>
        <Input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
        <Input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="единица (шт/км/кг/₽)" />
        <Input type="number" value={form.target} onChange={e=>setForm({...form,target:Number(e.target.value)})} placeholder="цель" />
      </div>
      <div className="mt-2"><Button variant="primary" onClick={()=>{ addGoal(); setForm({ title:'Я …', deadline:'', unit:'шт', target:10, current:0 }) }}>Сохранить</Button></div>
    </Section>

    <Section title="Мои цели" tone="var(--clr-goal)">
      {data.goals.length===0? <div className="text-sm opacity-60">Ещё нет целей.</div> :
        <div className="grid gap-2">
          {data.goals.map(g => (
            <div key={g.id} className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>
              <div className="font-medium">{g.title}</div>
              <div className="text-xs opacity-60 mb-2">Дедлайн: {g.deadline||'—'}</div>
              <Progress current={g.current||0} target={g.target||0} />
              <div className="mt-2 flex gap-2">
                <Button variant="primary" onClick={()=> updateGoal(g.id, { current: Math.min((g.current||0)+1, g.target||Infinity) })}>+1 {g.unit}</Button>
                <Button onClick={()=> updateGoal(g.id, { current: Math.max((g.current||0)-1, 0) })}>-1</Button>
              </div>
            </div>
          ))}
        </div>
      }
    </Section>
  </div>)
}
