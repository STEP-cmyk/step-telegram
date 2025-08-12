import React from 'react'
import Section from '../components/Section'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Switch from '../components/ui/Switch'
import Button from '../components/ui/Button'
import { useApp } from '../store/app.jsx'

export default function Settings(){
  const { data, setData } = useApp()
  const s = data.settings
  const setSettings = (patch) => setData(d => ({ ...d, settings:{ ...d.settings, ...patch } }))

  return (<div>
    <Section title="Профиль" tone="var(--clr-note)">
      <div className="grid md:grid-cols-3 gap-2">
        <Input value={s.nickname} onChange={e=>setSettings({ nickname:e.target.value })} placeholder="Ник" />
        <Select value={s.theme} onChange={e=>setSettings({ theme:e.target.value })}>
          <option value="light">Светлая</option>
          <option value="dark">Тёмная</option>
        </Select>
        <Select value={s.defaultTab} onChange={e=>setSettings({ defaultTab:e.target.value })}>
          <option value="summary">Сводка</option>
          <option value="goals">Цели</option>
          <option value="habits">Привычки</option>
          <option value="wishes">Хотелки</option>
          <option value="notes">Записи</option>
          <option value="competitions">Соревнования</option>
        </Select>
      </div>
    </Section>

    <Section title="Уведомления" tone="var(--clr-note)">
      <div className="flex flex-wrap items-center gap-3">
        <span>Тихий режим ночью</span>
        <Switch checked={s.quietHours.enabled} onChange={(v)=>setSettings({ quietHours:{...s.quietHours, enabled:v} })} />
        <Input type="number" value={s.quietHours.from} onChange={e=>setSettings({ quietHours:{...s.quietHours, from:Number(e.target.value)} })} placeholder="С" />
        <Input type="number" value={s.quietHours.to} onChange={e=>setSettings({ quietHours:{...s.quietHours, to:Number(e.target.value)} })} placeholder="До" />
      </div>
    </Section>

    <Section title="Данные" tone="var(--clr-note)">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={()=>{ const blob=new Blob([localStorage.getItem('step_020')||'{}'],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='step_020_export.json'; a.click(); URL.revokeObjectURL(url); }}>Экспорт JSON</Button>
        <Button onClick={()=>{ const el=document.createElement('input'); el.type='file'; el.accept='.json,application/json'; el.onchange=(e)=>{ const file=e.target.files?.[0]; if(!file) return; file.text().then(t=>{ try{ const obj=JSON.parse(t); localStorage.setItem('step_020', JSON.stringify(obj)); window.location.reload(); }catch(err){ alert('Некорректный файл'); } }); }; el.click(); }}>Импорт JSON</Button>
        <Button onClick={()=>{ localStorage.removeItem('step_020'); location.reload() }}>Сбросить данные</Button>
      </div>
    </Section>
  </div>)
}
