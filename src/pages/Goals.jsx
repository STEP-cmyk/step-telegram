import React, { useState } from 'react'
import Section from '../components/Section'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Progress from '../components/ui/Progress'
import Modal from '../components/ui/Modal'
import IconPicker from '../components/ui/IconPicker'
import TagInput from '../components/ui/TagInput'
import SwipeableItem from '../components/ui/SwipeableItem'
import { useApp } from '../store/app.jsx'
import { uid } from '../lib/utils'
import { useTranslation } from '../lib/i18n'
import { Plus, Target, Calendar, Tag, Star } from 'lucide-react'

export default function Goals() {
  const { data, setData, ready, error } = useApp()
  const { t } = useTranslation()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [form, setForm] = useState({
    title: '',
    deadline: '',
    unit: '',
    target: 10,
    current: 0,
    icon: 'Target',
    tags: [],
    priority: 'Medium',
    description: '',
    attachments: [],
    category: 'Personal'
  })

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
          <p className="text-red-600 dark:text-red-400">Error loading data: {error.message}</p>
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
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Safe data access with fallbacks
  const goals = data?.goals || []
  const completedItems = data?.completedItems || []

  // Group goals by priority and status
  const heavyGoals = goals.filter(g => g.priority === 'High' && !g.completed)
  const urgentGoals = goals.filter(g => {
    if (g.completed || g.priority === 'High') return false
    if (!g.deadline) return false
    const deadline = new Date(g.deadline)
    const now = new Date()
    const diffTime = deadline - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  })
  const overdueGoals = goals.filter(g => {
    if (g.completed) return false
    if (!g.deadline) return false
    const deadline = new Date(g.deadline)
    const now = new Date()
    return deadline < now
  })
  const completedGoals = goals.filter(g => g.completed)
  const otherGoals = goals.filter(g => {
    if (g.completed || g.priority === 'High') return false
    if (g.deadline) {
      const deadline = new Date(g.deadline)
      const now = new Date()
      const diffTime = deadline - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays <= 7) return false
    }
    return true
  })

  const addGoal = () => {
    try {
      const newGoal = {
        id: uid(),
        ...form,
        createdAt: new Date().toISOString(),
        completed: false,
        deleted: false
      }
      setData(d => ({ 
        ...d, 
        goals: [...(d.goals || []), newGoal] 
      }))
      setForm({
        title: '',
        deadline: '',
        unit: '',
        target: 10,
        current: 0,
        icon: 'Target',
        tags: [],
        priority: 'Medium',
        description: '',
        attachments: [],
        category: 'Personal'
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding goal:', error)
      // Show user-friendly error message
      alert('Failed to add goal. Please try again.')
    }
  }

  const updateGoal = (id, patch) => {
    try {
      setData(d => ({ 
        ...d, 
        goals: (d.goals || []).map(g => g.id === id ? { ...g, ...patch } : g) 
      }))
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const completeGoal = (id) => {
    try {
      const goal = goals.find(g => g.id === id)
      if (goal) {
        setData(d => ({
          ...d,
          goals: (d.goals || []).filter(g => g.id !== id),
          completedItems: [...(d.completedItems || []), { ...goal, completed: true, completedAt: new Date().toISOString() }]
        }))
      }
    } catch (error) {
      console.error('Error completing goal:', error)
    }
  }

  const deleteGoal = (id) => {
    try {
      const goal = goals.find(g => g.id === id)
      if (goal) {
        setData(d => ({
          ...d,
          goals: (d.goals || []).filter(g => g.id !== id),
          completedItems: [...(d.completedItems || []), { ...goal, deleted: true, deletedAt: new Date().toISOString() }]
        }))
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const restoreItem = (item) => {
    try {
      setData(d => ({
        ...d,
        completedItems: (d.completedItems || []).filter(i => i.id !== item.id),
        goals: [...(d.goals || []), { ...item, completed: false, deleted: false, completedAt: undefined, deletedAt: undefined }]
      }))
    } catch (error) {
      console.error('Error restoring item:', error)
    }
  }

  const openDetailModal = (goal) => {
    setSelectedGoal(goal)
    setShowDetailModal(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400'
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'Low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔥'
      case 'Medium': return '⚡'
      case 'Low': return '🌱'
      default: return '📌'
    }
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Add Goal Button */}
      <div className="text-center">
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 text-lg float"
        >
          <Plus size={20} className="mr-2" />
          {t('addGoal')}
        </Button>
      </div>

      {/* Heavy Goals */}
      {heavyGoals.length > 0 && (
        <Section title={t('heavyGoals')} tone="text-red-600 dark:text-red-400">
          <div className="space-y-3">
            {heavyGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => openDetailModal(goal)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className={`p-4 stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Target size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                        {getPriorityIcon(goal.priority)} {goal.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {goal.deadline}
                        </span>
                      )}
                    </div>
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-1">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {goal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{goal.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })}
                    >
                      +1 {goal.unit}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })}
                    >
                      -1
                    </Button>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        </Section>
      )}

      {/* Urgent Goals */}
      {urgentGoals.length > 0 && (
        <Section title={t('urgentGoals')} tone="text-orange-600 dark:text-orange-400">
          <div className="space-y-3">
            {urgentGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => openDetailModal(goal)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className={`p-4 stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Target size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                        ⚡ {goal.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {goal.deadline}
                        </span>
                      )}
                    </div>
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-1">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {goal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{goal.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })}
                    >
                      +1 {goal.unit}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })}
                    >
                      -1
                    </Button>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        </Section>
      )}

      {/* Overdue Goals */}
      {overdueGoals.length > 0 && (
        <Section title={t('overdueGoals')} tone="text-red-600 dark:text-red-400">
          <div className="space-y-3">
            {overdueGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => openDetailModal(goal)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className={`p-4 stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Target size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        {t('overdue')} {goal.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {goal.deadline}
                        </span>
                      )}
                    </div>
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-1">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {goal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{goal.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })}
                    >
                      +1 {goal.unit}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })}
                    >
                      -1
                    </Button>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        </Section>
      )}

      {/* Other Goals */}
      {otherGoals.length > 0 && (
        <Section title={t('otherGoals')} tone="text-blue-600 dark:text-blue-400">
          <div className="space-y-3">
            {otherGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => openDetailModal(goal)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className={`p-4 stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Target size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {getPriorityIcon(goal.priority)} {goal.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {goal.deadline}
                        </span>
                      )}
                    </div>
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-1">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {goal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{goal.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })}
                    >
                      +1 {goal.unit}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })}
                    >
                      -1
                    </Button>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        </Section>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Section title={t('completedGoals')} tone="text-green-600 dark:text-green-400">
          <div className="space-y-3">
            {completedGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => openDetailModal(goal)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className={`p-4 stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Target size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        ✅ {goal.priority}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {goal.deadline}
                        </span>
                      )}
                    </div>
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-1">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {goal.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {goal.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {goal.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{goal.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })}
                    >
                      +1 {goal.unit}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })}
                    >
                      -1
                    </Button>
                  </div>
                </div>
              </SwipeableItem>
            ))}
          </div>
        </Section>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Target size={48} className="mx-auto mb-4 opacity-50" />
          <p>{t('noGoalsYet')}</p>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('addGoal')}</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t('goalTitle')}</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder={t('goalTitle')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('deadline')}</label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('unit')}</label>
                <Input
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                  placeholder={t('unit')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('target')}</label>
                <Input
                  type="number"
                  value={form.target}
                  onChange={e => setForm({ ...form, target: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('priority')}</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
                >
                  <option value="Low">{t('low')}</option>
                  <option value="Medium">{t('medium')}</option>
                  <option value="High">{t('high')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('category')}</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                <option value="Personal">{t('personal')}</option>
                <option value="Work">{t('work')}</option>
                <option value="Health">{t('health')}</option>
                <option value="Education">{t('education')}</option>
                <option value="Finance">{t('finance')}</option>
                <option value="Hobbies">{t('hobbies')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('tags')}</label>
              <TagInput
                tags={form.tags}
                onChange={tags => setForm({ ...form, tags })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('description')}</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
                placeholder={t('description')}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button variant="primary" onClick={addGoal} className="flex-1">
                {t('createGoal')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedGoal && (
        <Modal onClose={() => setShowDetailModal(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('edit')}</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t('goalTitle')}</label>
              <Input
                value={selectedGoal.title}
                onChange={e => updateGoal(selectedGoal.id, { title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('deadline')}</label>
                <Input
                  type="date"
                  value={selectedGoal.deadline}
                  onChange={e => updateGoal(selectedGoal.id, { deadline: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('unit')}</label>
                <Input
                  value={selectedGoal.unit}
                  onChange={e => updateGoal(selectedGoal.id, { unit: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">{t('target')}</label>
                <Input
                  type="number"
                  value={selectedGoal.target}
                  onChange={e => updateGoal(selectedGoal.id, { target: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('currentProgress')}</label>
              <Input
                type="number"
                value={selectedGoal.current || 0}
                onChange={e => updateGoal(selectedGoal.id, { current: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('priority')}</label>
              <select
                value={selectedGoal.priority}
                onChange={e => updateGoal(selectedGoal.id, { priority: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                <option value="Low">{t('low')}</option>
                <option value="Medium">{t('medium')}</option>
                <option value="High">{t('high')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('category')}</label>
              <select
                value={selectedGoal.category}
                onChange={e => updateGoal(selectedGoal.id, { category: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                <option value="Personal">{t('personal')}</option>
                <option value="Work">{t('work')}</option>
                <option value="Health">{t('health')}</option>
                <option value="Education">{t('education')}</option>
                <option value="Finance">{t('finance')}</option>
                <option value="Hobbies">{t('hobbies')}</option>
                <option value="Other">{t('other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('tags')}</label>
              <TagInput
                tags={selectedGoal.tags || []}
                onChange={tags => updateGoal(selectedGoal.id, { tags })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('description')}</label>
              <textarea
                value={selectedGoal.description || ''}
                onChange={e => updateGoal(selectedGoal.id, { description: e.target.value })}
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
        </Modal>
      )}

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
