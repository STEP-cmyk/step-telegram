import React from 'react'
import { Target, CheckSquare, Heart, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import { useApp } from '../store/app.jsx'
import { useTranslation } from '../lib/i18n'
import { todayISO } from '../lib/utils'
import { formatCurrency } from '../lib/currency'
import MotivationQuote from '../components/ui/MotivationQuote'
import SummaryTile from '../components/ui/SummaryTile'

export default function Summary() {
  const { data } = useApp()
  const { t } = useTranslation()
  const today = todayISO()

  // Calculate goals metrics
  const goals = data.goals || []
  const heavyGoals = goals.filter(g => g.priority === 'High').length
  const urgentGoals = goals.filter(g => {
    if (!g.deadline) return false
    const deadline = new Date(g.deadline)
    const now = new Date()
    const diffTime = deadline - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }).length
  const overdueGoals = goals.filter(g => {
    if (!g.deadline) return false
    const deadline = new Date(g.deadline)
    const now = new Date()
    return deadline < now
  }).length
  const completedThisWeek = goals.filter(g => {
    if (!g.completedAt) return false
    const completed = new Date(g.completedAt)
    const now = new Date()
    const diffTime = now - completed
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }).length

  // Calculate habits metrics
  const habits = data.habits || []
  const todayCompleted = habits.filter(h => h.history?.[today] === true || (typeof h.history?.[today] === 'number' && h.history[today] > 0)).length
  const totalHabits = habits.length
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0
  const streakAtRisk = habits.filter(h => {
    if (!h.history?.[today]) return false
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString().slice(0, 10)
    return h.history?.[yesterdayISO] && !h.history?.[today]
  }).length
  const missedYesterday = habits.filter(h => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayISO = yesterday.toISOString().slice(0, 10)
    return h.history?.[yesterdayISO] === false || (typeof h.history?.[yesterdayISO] === 'number' && h.history[yesterdayISO] === 0)
  }).length

  // Calculate wishes metrics
  const wishes = data.wishes || []
  const inProgress = wishes.filter(w => !w.completed && (w.savedAmount || 0) > 0).length
  const fullyFunded = wishes.filter(w => !w.completed && (w.savedAmount || 0) >= (w.targetAmount || 0)).length
  const averageCompletion = wishes.length > 0 
    ? Math.round(wishes.reduce((sum, w) => {
        const target = w.targetAmount || 1
        const saved = w.savedAmount || 0
        return sum + (saved / target * 100)
      }, 0) / wishes.length)
    : 0
  const largestWish = wishes.length > 0 
    ? Math.max(...wishes.map(w => (w.targetAmount || 0) - (w.savedAmount || 0)))
    : 0

  return (
    <div className="space-y-6 safe-padding max-w-7xl mx-auto">
      {/* Motivation Quote */}
      <MotivationQuote />

      {/* Goals Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target size={20} className="text-purple-600 dark:text-purple-400" />
          {t('goals')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
          <SummaryTile
            title={t('heavyGoals')}
            value={heavyGoals}
            subtitle={t('highPriority')}
            icon="🔥"
            color="red"
            route="/goals"
          />
          <SummaryTile
            title={t('urgentGoals')}
            value={urgentGoals}
            subtitle={t('dueThisWeek')}
            icon="⚡"
            color="orange"
            route="/goals"
          />
          <SummaryTile
            title={t('overdueGoals')}
            value={overdueGoals}
            subtitle={t('pastDeadline')}
            icon={<AlertTriangle size={14} />}
            color="red"
            route="/goals"
          />
          <SummaryTile
            title={t('completedThisWeek')}
            value={completedThisWeek}
            subtitle={t('achievements')}
            icon="✅"
            color="green"
            route="/goals"
          />
        </div>
      </div>

      {/* Habits Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <CheckSquare size={20} className="text-green-600 dark:text-green-400" />
          {t('habits')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
          <SummaryTile
            title={t('bestStreakToday')}
            value={longestStreak}
            subtitle={t('days')}
            icon="🔥"
            color="orange"
            route="/habits"
          />
          <SummaryTile
            title={t('streakAtRisk')}
            value={streakAtRisk}
            subtitle={t('needsAction')}
            icon="⚠️"
            color="red"
            route="/habits"
          />
          <SummaryTile
            title={t('missedYesterday')}
            value={missedYesterday}
            subtitle={t('catchUp')}
            icon="😔"
            color="purple"
            route="/habits"
          />
          <SummaryTile
            title={t('todayProgress')}
            value={`${todayCompleted}/${totalHabits}`}
            subtitle={t('completed')}
            icon="📊"
            color="blue"
            route="/habits"
          />
        </div>
      </div>

      {/* Wishes Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Heart size={20} className="text-pink-600 dark:text-pink-400" />
          {t('wishes')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
          <SummaryTile
            title={t('inProgress')}
            value={inProgress}
            subtitle={t('saving')}
            icon="💰"
            color="blue"
            route="/wishes"
          />
          <SummaryTile
            title={t('fullyFunded')}
            value={fullyFunded}
            subtitle={t('readyToBuy')}
            icon="🎉"
            color="green"
            route="/wishes"
          />
          <SummaryTile
            title={t('avgProgress')}
            value={`${averageCompletion}%`}
            subtitle={t('completion')}
            icon={<TrendingUp size={14} />}
            color="purple"
            route="/wishes"
          />
          <SummaryTile
            title={t('mostExpensive')}
            value={largestWish > 0 ? formatCurrency(largestWish, data) : formatCurrency(0, data)}
            subtitle={t('remaining')}
            icon="💎"
            color="orange"
            route="/wishes"
          />
        </div>
      </div>
      {/* Bottom spacer for Telegram WebApp mobile scrolling */}
      <div className="h-20" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 60px)' }}></div>
    </div>
  )
}
