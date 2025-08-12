import React from 'react'
import Card from '../components/ui/Card'
const QUOTES=['Если хочешь — ищешь возможности, если не хочешь — ищешь причины.','Первый шаг не должен быть идеальным, он должен быть сделан.','Привычки — это дивиденды дисциплины.']
export default function DailyQuote(){ const q=QUOTES[Math.floor(Math.random()*QUOTES.length)]; return (<Card><div className="text-xs opacity-60 mb-1">Плагин • Ежедневная цитата</div><div className="text-sm">{q}</div></Card>) }
