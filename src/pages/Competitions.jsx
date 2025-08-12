import React from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useApp } from '../store/app.jsx'
import { uid } from '../lib/utils'

export default function Competitions(){
  const { data, setData } = useApp()
  const [join, setJoin] = React.useState({ compId: data.competitions.public[0]?.id||'', startingValue: 10 })
  const [form, setForm] = React.useState({ title:'Мой челлендж', type:'habit', duration:30, rule:{mode:'streak'}, visibility:'public', description:'', leagues: DEFAULT_LEAGUES })

  const joinPublicCompetition = () => {
    const pub = data.competitions.public.find(c => c.id===join.compId)
    if (!pub) return
    const me = { id:uid(), nick:data.settings.nickname, progress:0, league:'L1' }
    setData(d => ({ ...d, competitions:{ ...d.competitions, my:[...d.competitions.my, { ...pub, participants:[me] }] } }))
  }

  const createCompetition = () => {
    setData(d => ({ ...d, competitions:{ ...d.competitions, my:[...d.competitions.my, { id:uid(), inviteCode:uid().slice(0,6).toUpperCase(), ...form, participants:[], leaderboard:[] }] } }))
  }

  return (<div>
    <Section title="Публичные челленджи" tone="var(--clr-compet)">
      <div className="grid md:grid-cols-2 gap-2">
        {data.competitions.public.map(c => (
          <div key={c.id} className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>
            <div className="font-medium">{c.title}</div>
            <div className="text-xs opacity-60 mb-2">{c.description}</div>
            <div className="text-xs opacity-60 mb-1">Лиги:</div>
            <div className="flex flex-wrap gap-1 mb-2">{c.leagues.map(l => <Badge key={l.id}>{l.name}</Badge>)}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Присоединиться к челленджу" tone="var(--clr-compet)">
      <div className="grid md:grid-cols-3 gap-2">
        <Select value={join.compId} onChange={e=>setJoin({...join, compId:e.target.value})}>{data.competitions.public.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</Select>
        <Input type="number" value={join.startingValue} onChange={e=>setJoin({...join, startingValue:Number(e.target.value)})} placeholder="Твой стартовый уровень" />
        <Button variant="primary" onClick={joinPublicCompetition}>Присоединиться</Button>
      </div>
      <div className="text-xs opacity-60 mt-2">Показываем ник и прогресс. Названия целей/привычек скрываем.</div>
    </Section>

    <Section title="Создать свой челлендж" tone="var(--clr-compet)">
      <div className="grid md:grid-cols-3 gap-2">
        <Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Название" />
        <Select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option value="habit">Привычка</option>
          <option value="goal">Цель</option>
        </Select>
        <Input type="number" value={form.duration} onChange={e=>setForm({...form,duration:Number(e.target.value)})} placeholder="Дней" />
        <Select value={form.rule.mode} onChange={e=>setForm({...form,rule:{mode:e.target.value}})}>
          <option value="streak">Стрик</option>
          <option value="count">Количество</option>
        </Select>
        <Select value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}>
          <option value="public">Публичный</option>
          <option value="code">По коду</option>
        </Select>
        <Input value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Описание" />
      </div>
      <div className="mt-2"><Button variant="primary" onClick={createCompetition}>Создать</Button></div>
    </Section>
  </div>)
}

const DEFAULT_LEAGUES=[
  { id:'L1', name:'Лига 1 (0–15)' },
  { id:'L2', name:'Лига 2 (16–30)' },
  { id:'L3', name:'Лига 3 (31–50)' },
  { id:'L4', name:'Лига 4 (51+)' },
]
