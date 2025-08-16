import React, { useState } from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import IconPicker from '../components/ui/IconPicker'
import TagInput from '../components/ui/TagInput'
import SwipeableItem from '../components/ui/SwipeableItem'
import { useApp } from '../store/app.jsx'
import { uid, todayISO } from '../lib/utils'
import { useTranslation } from '../lib/i18n'
import { mountConfetti } from '../lib/confetti'
import { Plus, CheckSquare, Calendar, Bell, Target } from 'lucide-react'

// Helper function to calculate streak
function calcStreak(history) {
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const v = history?.[iso]
    const ok = v === true || (typeof v === 'number' && v > 0)
    if (ok) streak++
    else break
  }
  return streak
}

const HABIT_CATEGORIES = (t) => [
  { id: 'health', name: t('health'), icon: '💊', examples: ['Drink water', 'Take vitamins', 'Exercise'] },
  { id: 'finance', name: t('finance'), icon: '💰', examples: ['Save money', 'Track expenses', 'Invest'] },
  { id: 'fitness', name: t('fitness'), icon: '💪', examples: ['Workout', 'Run', 'Stretch'] },
  { id: 'hobby', name: t('hobby'), icon: '🎨', examples: ['Read books', 'Play music', 'Draw'] },
  { id: 'learning', name: t('learning'), icon: '📚', examples: ['Study language', 'Learn coding', 'Read'] },
  { id: 'business', name: t('business'), icon: '💼', examples: ['Network', 'Learn skills', 'Plan'] }
]

const ACTIVE_DAYS_OPTIONS = (t) => [
  { id: 'daily', name: t('everyDay'), description: t('sevenDaysWeek') },
  { id: 'weekdays', name: t('weekdaysOnly'), description: t('mondayToFriday') },
  { id: 'weekends', name: t('weekendsOnly'), description: t('saturdayAndSunday') },
  { id: 'custom', name: t('customDays'), description: t('chooseSpecificDays') }
]

const DURATION_OPTIONS = (t) => [
  { id: 'week', name: t('oneWeek'), description: t('sevenDays') },
  { id: 'month', name: t('oneMonth'), description: t('thirtyDays') },
  { id: 'quarter', name: t('threeMonths'), description: t('ninetyDays') },
  { id: 'year', name: t('oneYear'), description: t('threeHundredSixtyFiveDays') },
  { id: 'indefinite', name: t('indefinite'), description: t('noEndDate') }
]

export default function Habits() {
  const { data, setData, ready, error } = useApp()
  const { t } = useTranslation()
  
  // Category to default icon mapping
  const getDefaultIconForCategory = (category) => {
    const iconMap = {
      'health': '💊',
      'finance': '💰',
      'fitness': '💪',
      'hobby': '🎨',
      'learning': '📚',
      'business': '💼'
    }
    return iconMap[category] || '✅'
  }
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    title: '',
    type: 'binary',
    quantTarget: 8,
    icon: 'CheckSquare',
    tags: [],
    category: 'health',
    activeDays: 'daily',
    customDays: [],
    duration: 'indefinite',
    reminders: [],
    description: ''
  })

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
          <p className="text-red-600 dark:text-red-400">{t('error')}: {error.message}</p>
        </div>
      </div>
    )
  }

  // Wait for data to be ready
  if (!ready || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 border-t-transparent rounded-full loading-spinner"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Safe data access with fallbacks and normalization
  const habits = (data?.habits || []).map(habit => ({
    tags: [],
    type: 'binary',
    quantTarget: 8,
    category: 'health',
    activeDays: 'daily',
    customDays: [],
    duration: 'indefinite',
    reminders: [],
    description: '',
    streak: 0,
    lastCompleted: null,
    history: [],
    completed: false,
    deleted: false,
    ...habit
  }))
  const completedItems = (data?.completedItems || []).map(item => ({
    tags: [],
    type: 'binary',
    quantTarget: 8,
    category: 'health',
    activeDays: 'daily',
    customDays: [],
    duration: 'indefinite',
    reminders: [],
    description: '',
    streak: 0,
    lastCompleted: null,
    history: [],
    ...item
  }))



  // Group habits by category
  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(habit)
    return acc
  }, {})

  const addHabit = () => {
    const newHabit = {
      id: uid(),
      ...form,
      createdAt: new Date().toISOString(),
      completed: false,
      deleted: false,
      streak: 0,
      lastCompleted: null,
      history: []
    }
    setData(d => ({ 
      ...d, 
      habits: [...(d.habits || []), newHabit] 
    }))
    setForm({
      title: '',
      type: 'binary',
      quantTarget: 8,
      icon: 'CheckSquare',
      tags: [],
      category: 'health',
      activeDays: 'daily',
      customDays: [],
      duration: 'indefinite',
      reminders: [],
      description: ''
    })
    setShowAddModal(false)
  }

  const updateHabit = (id, patch) => {
    setData(d => ({ 
      ...d, 
      habits: (d.habits || []).map(h => h.id === id ? {
        tags: [],
        type: 'binary',
        quantTarget: 8,
        category: 'health',
        activeDays: 'daily',
        customDays: [],
        duration: 'indefinite',
        reminders: [],
        description: '',
        streak: 0,
        lastCompleted: null,
        history: [],
        completed: false,
        deleted: false,
        ...h,
        ...patch
      } : h) 
    }))
  }

  const markHabit = (id, val) => {
    const t = todayISO()
    setData(d => ({ 
      ...d, 
      habits: (d.habits || []).map(h => {
        if (h.id !== id) return h
        const history = { ...(h.history || {}) }
        history[t] = val ?? (h.type === 'binary' ? !(history[t] === true) : (history[t] || 0) + 1)
        const streak = calcStreak(history)
        return { ...h, history, streak, best: Math.max(h.best || 0, streak) }
      }) 
    }))
  }

  const completeHabit = (id) => {
    const habit = habits.find(h => h.id === id)
    if (habit) {
      // Ensure the completed habit has all required properties
      const normalizedHabit = {
        tags: [],
        type: 'binary',
        quantTarget: 8,
        category: 'health',
        activeDays: 'daily',
        customDays: [],
        duration: 'indefinite',
        reminders: [],
        description: '',
        streak: 0,
        lastCompleted: null,
        history: [],
        completed: false,
        deleted: false,
        ...habit,
        completed: true,
        completedAt: new Date().toISOString()
      }
      
      setData(d => ({
        ...d,
        habits: habits.filter(h => h.id !== id),
        completedItems: [...(d.completedItems || []), normalizedHabit]
      }))
      
      // Show confetti animation
      const confetti = mountConfetti()
      confetti.fire()
      setTimeout(() => confetti.destroy(), 2000)
    }
  }

  const deleteHabit = (id) => {
    const habit = habits.find(h => h.id === id)
    if (habit) {
      // Ensure the deleted habit has all required properties
      const normalizedHabit = {
        tags: [],
        type: 'binary',
        quantTarget: 8,
        category: 'health',
        activeDays: 'daily',
        customDays: [],
        duration: 'indefinite',
        reminders: [],
        description: '',
        streak: 0,
        lastCompleted: null,
        history: [],
        completed: false,
        deleted: false,
        ...habit,
        deleted: true,
        deletedAt: new Date().toISOString()
      }
      
      setData(d => ({
        ...d,
        habits: habits.filter(h => h.id !== id),
        completedItems: [...(d.completedItems || []), normalizedHabit]
      }))
    }
  }

  const restoreItem = (item) => {
    // Ensure the restored item has all required properties
    const normalizedItem = {
      tags: [],
      type: 'binary',
      quantTarget: 8,
      category: 'health',
      activeDays: 'daily',
      customDays: [],
      duration: 'indefinite',
      reminders: [],
      description: '',
      streak: 0,
      lastCompleted: null,
      history: [],
      completed: false,
      deleted: false,
      ...item,
      completedAt: undefined,
      deletedAt: undefined
    }
    
    setData(d => ({
      ...d,
      completedItems: (d.completedItems || []).filter(i => i.id !== item.id),
      habits: [...(d.habits || []), normalizedItem]
    }))
  }

  const deleteForever = (item) => {
    try {
      setData(d => ({
        ...d,
        completedItems: (d.completedItems || []).filter(i => i.id !== item.id)
      }))
      
      // Show success toast
      setToast({
        type: 'success',
        message: `${t('habitDeletedForever')}: ${item.title}`,
      })
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000)
    } catch (error) {
      console.error('Error deleting habit forever:', error)
    }
  }

  const openDetailModal = (habit) => {
    setSelectedHabit(habit)
    setShowDetailModal(true)
  }

  const addReminder = () => {
    setForm(prev => ({
      ...prev,
      reminders: [...prev.reminders, { time: '08:00', message: '' }]
    }))
  }

  const updateReminder = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      reminders: prev.reminders.map((r, i) => 
        i === index ? { ...r, [field]: value } : r
      )
    }))
  }

  const removeReminder = (index) => {
    setForm(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index)
    }))
  }

  const getCategoryIcon = (categoryId) => {
    const category = HABIT_CATEGORIES(t).find(c => c.id === categoryId)
    return category?.icon || '📌'
  }

  const getCategoryName = (categoryId) => {
    const category = HABIT_CATEGORIES(t).find(c => c.id === categoryId)
    return category?.name || 'Other'
  }

  const renderWeeklyProgress = (habit) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    return (
      <div className="flex gap-1">
        {weekDays.map((day, index) => {
          const date = new Date(weekStart)
          date.setDate(weekStart.getDate() + index)
          const dateStr = date.toISOString().slice(0, 10)
          const isToday = dateStr === todayISO()
          const isCompleted = habit.history?.[dateStr]
          const isActive = habit.activeDays === 'daily' || 
                          (habit.activeDays === 'weekdays' && index > 0 && index < 6) ||
                          (habit.activeDays === 'weekends' && (index === 0 || index === 6))

          if (!isActive) {
            return (
              <div key={day} className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-xs text-gray-400">-</span>
              </div>
            )
          }

          return (
            <button
              key={day}
              onClick={() => markHabit(habit.id, habit.type === 'binary' ? !isCompleted : (isCompleted || 0) + 1)}
              className={`w-6 h-6 rounded border text-xs font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : isToday
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              title={`${day}: ${isCompleted ? 'Completed' : 'Click to mark'}`}
            >
              {isCompleted ? '✓' : day[0]}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">


      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <CheckSquare size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('habits')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('habitsDescription')}
        </p>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 text-lg"
        >
          <Plus size={20} className="mr-2" />
          {t('addHabit')}
        </Button>
      </div>

      {/* Active Habits */}
      <Section title={t('myHabits')} tone="text-green-600 dark:text-green-400">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t('noHabitsYet')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {getCategoryName(category)} ({categoryHabits.length})
                </h3>
                <div className="space-y-3">
                  {categoryHabits.map((habit, index) => (
                                        <SwipeableItem
                      key={habit.id}
                      onSwipeRight={() => completeHabit(habit.id)}
                      onSwipeLeft={() => deleteHabit(habit.id)}
                      onEdit={() => openDetailModal(habit)}
                      onDelete={() => deleteHabit(habit.id)}
                      className={`p-4 stagger-item`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div 
                        className="space-y-3 cursor-pointer"
                        onClick={() => openDetailModal(habit)}
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <CheckSquare size={20} className="text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{habit.title}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                                {getCategoryIcon(habit.category)} {getCategoryName(habit.category)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Target size={14} />
                                {habit.streak} day streak
                              </span>
                              <span className="flex items-center gap-1">
                                <Target size={14} />
                                Best: {habit.best}
                              </span>
                            </div>
                          </div>
                          
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markHabit(habit.id, habit.type === 'binary' ? true : (Number(habit.history?.[todayISO()] || 0) + 1));
                            }}
                          >
                            {habit.type === 'binary' 
                              ? (habit.history?.[todayISO()] === true ? 'Done' : 'Mark Done') 
                              : '+1'
                            }
                          </Button>
                        </div>

                        {/* Weekly Progress */}
                        <div>
                          <div className="text-xs text-gray-500 mb-2">This week's progress:</div>
                          {renderWeeklyProgress(habit)}
                        </div>

                        {/* Tags */}
                        {(habit.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(habit.tags || []).slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                {tag}
                            </span>
                            ))}
                            {(habit.tags || []).length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                +{(habit.tags || []).length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </SwipeableItem>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Completed/Deleted Items */}
      {completedItems.length > 0 && (
        <Section title="Completed & Deleted" tone="text-green-600 dark:text-green-400">
          <div className="space-y-2">
            {completedItems.map(item => (
              <div key={item.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium line-through opacity-60">{item.title}</span>
                      {item.completed && (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                          Completed
                        </span>
                      )}
                      {item.deleted && (
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                          Deleted
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.completedAt && `Completed: ${new Date(item.completedAt).toLocaleDateString()}`}
                      {item.deletedAt && `Deleted: ${new Date(item.deletedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <button 
                      onClick={() => restoreItem(item)}
                      className="flex-1 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                    >
                      {t('restore')}
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(t('deleteForeverConfirm'))) {
                          deleteForever(item)
                        }
                      }}
                      className="flex-1 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded transition-colors"
                    >
                      {t('deleteForever')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Add Habit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={t('addNewHabit')}
        size="lg"
      >
        <div className="space-y-4">


          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Habit Title</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="What habit do you want to build?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg">
                  {form.icon || getDefaultIconForCategory(form.category)}
                </div>
                <select
                  value={form.category}
                  onChange={e => {
                    const category = e.target.value
                    setForm({ 
                      ...form, 
                      category,
                      icon: getDefaultIconForCategory(category) // Auto-set default icon
                    })
                  }}
                  className="flex-1 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
                >
                  {HABIT_CATEGORIES(t).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t('type')}</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                <option value="binary">{t('typeBinary')}</option>
                <option value="quant">{t('typeQuantitative')}</option>
              </select>
            </div>
            
            {form.type === 'quant' && (
              <div>
                <label className="block text-sm font-medium mb-2">{t('dailyTarget')}</label>
                <Input
                  type="number"
                  value={form.quantTarget}
                  onChange={e => setForm({ ...form, quantTarget: Number(e.target.value) })}
                  placeholder={t('howManyPerDay')}
                />
              </div>
            )}
          </div>

          {/* Active Days */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('activeDays')}</label>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVE_DAYS_OPTIONS(t).map(option => (
                <button
                  key={option.id}
                  onClick={() => setForm({ ...form, activeDays: option.id })}
                  className={`p-3 text-left rounded-xl border transition-colors ${
                    form.activeDays === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium">{option.name}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('duration')}</label>
            <select
              value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
            >
              {DURATION_OPTIONS(t).map(option => (
                <option key={option.id} value={option.id}>
                  {option.name} - {option.description}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">{t('tags')}</label>
            <TagInput
              tags={form.tags}
              onChange={tags => setForm({ ...form, tags })}
              placeholder={t('tagsPlaceholder')}
            />
          </div>

          {/* Reminders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">{t('reminders')}</label>
              <Button onClick={addReminder} size="sm" variant="outline">
                <Bell size={14} className="mr-1" />
                {t('addReminder')}
              </Button>
            </div>
            {form.reminders.length > 0 ? (
              <div className="space-y-2">
                {form.reminders.map((reminder, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="time"
                      value={reminder.time}
                      onChange={e => updateReminder(index, 'time', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      value={reminder.message}
                      onChange={e => updateReminder(index, 'message', e.target.value)}
                      placeholder="Reminder message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeReminder(index)}
                      size="sm"
                      variant="outline"
                      className="px-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">
                No reminders set. Click "Add Reminder" to create one.
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details about your habit..."
              rows={3}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={addHabit} className="flex-1" disabled={!form.title.trim()}>
              Create Habit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Habit Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedHabit?.title || 'Habit Details'}
        size="lg"
      >
        {selectedHabit && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={selectedHabit.title}
                  onChange={e => updateHabit(selectedHabit.id, { title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedHabit.category}
                  onChange={e => updateHabit(selectedHabit.id, { category: e.target.value })}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
                >
                  {HABIT_CATEGORIES(t).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('type')}</label>
                <select
                  value={selectedHabit.type}
                  onChange={e => updateHabit(selectedHabit.id, { type: e.target.value })}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
                >
                  <option value="binary">{t('typeBinary')}</option>
                  <option value="quant">{t('typeQuantitative')}</option>
                </select>
              </div>
              
              {selectedHabit.type === 'quant' && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('dailyTarget')}</label>
                  <Input
                    type="number"
                    value={selectedHabit.quantTarget}
                    onChange={e => updateHabit(selectedHabit.id, { quantTarget: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('activeDays')}</label>
              <select
                value={selectedHabit.activeDays}
                onChange={e => updateHabit(selectedHabit.id, { activeDays: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                {ACTIVE_DAYS_OPTIONS(t).map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('duration')}</label>
              <select
                value={selectedHabit.duration}
                onChange={e => updateHabit(selectedHabit.id, { duration: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                {DURATION_OPTIONS(t).map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('tags')}</label>
              <TagInput
                tags={selectedHabit.tags || []}
                onChange={tags => updateHabit(selectedHabit.id, { tags })}
                placeholder={t('tagsPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={selectedHabit.description || ''}
                onChange={e => updateHabit(selectedHabit.id, { description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                {t('close')}
              </Button>
              <Button variant="primary" onClick={() => setShowDetailModal(false)} className="flex-1">
                {t('saveChanges')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Icon Picker Modal */}
      {showIconPicker && (
        <IconPicker
          selectedIcon={form.icon}
          onSelect={(icon) => {
        
            setForm({ ...form, icon })
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  )
}
