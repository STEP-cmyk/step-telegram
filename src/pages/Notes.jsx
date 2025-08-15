import React from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import { useApp } from '../store/app.jsx'
import { uid } from '../lib/utils'

export default function Notes(){
  const { data, setData } = useApp()
  const [jform, setJForm] = React.useState({ name:'Новый журнал' })
  const [entry, setEntry] = React.useState({ journalId: data.journals[0]?.id||'inbox', title:'', content:'' })

  const addJournal = () => setData(d => ({ ...d, journals:[...d.journals, { id:uid(), entries:[], ...jform }] }))
  const addEntry = () => setData(d => ({ ...d, journals:d.journals.map(j => j.id===entry.journalId? { ...j, entries:[{ id:uid(), date:new Date().toISOString(), title: entry.title, content: entry.content }, ...j.entries] } : j) }))

  return (<div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
    <Section title="Журналы" tone="var(--clr-note)">
      <div className="flex flex-wrap gap-2 mb-3">
        {data.journals.map(j => (<div key={j.id} className="rounded-2xl px-3 py-2" style={{border:'1px solid var(--border)'}}>{j.name}</div>))}
      </div>
      <div className="grid md:grid-cols-4 gap-2">
        <Input value={jform.name} onChange={e=>setJForm({...jform,name:e.target.value})} placeholder="Название журнала" />
        <Button variant="primary" onClick={()=>{ addJournal(); setJForm({ name:'Журнал' }) }}>Создать журнал</Button>
      </div>
    </Section>

    <Section title="Новая запись" tone="var(--clr-note)">
      <div className="grid md:grid-cols-4 gap-2">
        <select value={entry.journalId} onChange={e=>setEntry({...entry,journalId:e.target.value})} className="select">
          {data.journals.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
        </select>
        <Input value={entry.title} onChange={e=>setEntry({...entry,title:e.target.value})} placeholder="Заголовок (опц.)" />
        <div className="md:col-span-2"><Textarea value={entry.content} onChange={e=>setEntry({...entry,content:e.target.value})} placeholder="Текст…" /></div>
      </div>
      <div className="mt-2"><Button variant="primary" onClick={()=>{ if(entry.content.trim()){ addEntry(); setEntry({...entry, title:'', content:''}) } }}>Сохранить</Button></div>
    </Section>

    {data.journals.map(j => (
      <Section key={j.id} title={`Записи: ${j.name}`} tone="var(--clr-note)">
        {j.entries.length===0? <div className="text-sm opacity-60">Пока пусто.</div> : (
          <div className="grid gap-2">
            {j.entries.map(e => (
              <div key={e.id} className="rounded-2xl p-3" style={{border:'1px solid var(--border)'}}>
                <div className="text-xs opacity-60 mb-1">{new Date(e.date).toLocaleString()}</div>
                {e.title && <div className="font-medium">{e.title}</div>}
                <div className="whitespace-pre-wrap text-sm">{e.content}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    ))}
  </div>)
}
