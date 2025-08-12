export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
export const todayISO = () => new Date().toISOString().slice(0,10)
export function currency(n, code='RUB'){ if(typeof n!=='number') return n; return new Intl.NumberFormat('ru-RU',{style:'currency',currency:code,maximumFractionDigits:0}).format(n) }
