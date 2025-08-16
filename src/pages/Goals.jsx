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
  const [toast, setToast] = useState(null)
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
  const goals = (data?.goals || []).map(goal => ({
    tags: [],
    unit: '',
    current: 0,
    target: 10,
    priority: 'Medium',
    description: '',
    attachments: [],
    category: 'Personal',
    completed: false,
    deleted: false,
    ...goal
  }))
  const completedItems = (data?.completedItems || []).map(item => ({
    tags: [],
    unit: '',
    current: 0,
    target: 10,
    priority: 'Medium',
    description: '',
    attachments: [],
    category: 'Personal',
    ...item
  }))

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
      alert(t('addGoalFailed'))
    }
  }

  const updateGoal = (id, patch) => {
    try {
      setData(d => {
        const updatedGoals = (d.goals || []).map(g => g.id === id ? {
          tags: [],
          unit: '',
          current: 0,
          target: 10,
          priority: 'Medium',
          description: '',
          attachments: [],
          category: 'Personal',
          completed: false,
          deleted: false,
          ...g,
          ...patch
        } : g)
        
        // Check if the updated goal has been completed
        const updatedGoal = updatedGoals.find(g => g.id === id)
        if (updatedGoal && updatedGoal.current >= updatedGoal.target && !updatedGoal.completed) {
          // Auto-complete the goal
          const normalizedGoal = {
            ...updatedGoal,
            completed: true,
            completedAt: new Date().toISOString()
          }
          
          // Show completion toast
          setToast({
            type: 'success',
            message: t('goalCompleted'),
            goal: normalizedGoal,
            onUndo: () => {
              // Restore the goal to active state
              setData(d => ({
                ...d,
                goals: [...updatedGoals.filter(g => g.id !== id), { ...normalizedGoal, completed: false, completedAt: undefined }],
                completedItems: (d.completedItems || []).filter(item => item.id !== id)
              }))
              setToast(null)
            }
          })
          
          // Auto-hide toast after 5 seconds
          setTimeout(() => setToast(null), 5000)
          
          // Move to completed items
          return {
            ...d,
            goals: updatedGoals.filter(g => g.id !== id),
            completedItems: [...(d.completedItems || []), normalizedGoal]
          }
        }
        
        return {
          ...d,
          goals: updatedGoals
        }
      })
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const completeGoal = (id) => {
    try {
      const goal = goals.find(g => g.id === id)
      if (goal) {
        // Ensure the completed goal has all required properties
        const normalizedGoal = {
          tags: [],
          unit: '',
          current: 0,
          target: 10,
          priority: 'Medium',
          description: '',
          attachments: [],
          category: 'Personal',
          ...goal,
          completed: true,
          completedAt: new Date().toISOString()
        }
        
        setData(d => ({
          ...d,
          goals: (d.goals || []).filter(g => g.id !== id),
          completedItems: [...(d.completedItems || []), normalizedGoal]
        }))
        
        // Show completion toast
        setToast({
          type: 'success',
          message: `${t('goalCompleted')}: ${goal.title}`,
          goal: normalizedGoal,
          onUndo: () => restoreItem(normalizedGoal)
        })
        
        // Auto-hide toast after 5 seconds
        setTimeout(() => setToast(null), 5000)
      }
    } catch (error) {
      console.error('Error completing goal:', error)
    }
  }

  const deleteGoal = (id) => {
    try {
      const goal = goals.find(g => g.id === id)
      if (goal) {
        // Ensure the deleted goal has all required properties
        const normalizedGoal = {
          tags: [],
          unit: '',
          current: 0,
          target: 10,
          priority: 'Medium',
          description: '',
          attachments: [],
          category: 'Personal',
          ...goal,
          deleted: true,
          deletedAt: new Date().toISOString()
        }
        
        setData(d => ({
          ...d,
          goals: (d.goals || []).filter(g => g.id !== id),
          completedItems: [...(d.completedItems || []), normalizedGoal]
        }))
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const restoreItem = (item) => {
    try {
      // Ensure the restored item has all required properties
      const normalizedItem = {
        tags: [],
        unit: '',
        current: 0,
        target: 10,
        priority: 'Medium',
        description: '',
        attachments: [],
        category: 'Personal',
        completed: false,
        deleted: false,
        ...item,
        completedAt: undefined,
        deletedAt: undefined
      }
      
      setData(d => ({
        ...d,
        completedItems: (d.completedItems || []).filter(i => i.id !== item.id),
        goals: [...(d.goals || []), normalizedItem]
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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('goals')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('goalsDescription')}
        </p>
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 text-lg"
        >
          <Plus size={20} className="mr-2" />
          {t('addGoal')}
        </Button>
      </div>

      {/* Heavy Goals */}
      {heavyGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target size={20} className="text-red-600 dark:text-red-400" />
            {t('heavyGoals')} ({heavyGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heavyGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => deleteGoal(goal.id)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => openDetailModal(goal)}
                >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Target size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        {getPriorityIcon(goal.priority)}
                      </span>
                    </div>
                    
                    {goal.deadline && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <Calendar size={14} />
                        {goal.deadline}
                      </div>
                    )}
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-2">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {(goal.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(goal.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(goal.tags || []).length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{(goal.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })
                    }}
                  >
                    +1 {goal.unit}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })
                    }}
                  >
                    -1
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      completeGoal(goal.id)
                    }}
                    className="px-3"
                  >
                    ✅
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })
                    }}
                  >
                    +1 {goal.unit}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })
                    }}
                  >
                    -1
                  </Button>
                </div>
              </div>
                </SwipeableItem>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Goals */}
      {urgentGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target size={20} className="text-orange-600 dark:text-orange-400" />
            {t('urgentGoals')} ({urgentGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => deleteGoal(goal.id)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => openDetailModal(goal)}
                >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Target size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                        ⚡
                      </span>
                    </div>
                    
                    {goal.deadline && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <Calendar size={14} />
                        {goal.deadline}
                      </div>
                    )}
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-2">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {(goal.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(goal.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(goal.tags || []).length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{(goal.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })
                    }}
                  >
                    +1 {goal.unit}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })
                    }}
                  >
                    -1
                  </Button>
                </div>
              </div>
                </SwipeableItem>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Goals */}
      {overdueGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target size={20} className="text-red-600 dark:text-red-400" />
            {t('overdueGoals')} ({overdueGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => deleteGoal(goal.id)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => openDetailModal(goal)}
                >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Target size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        {t('overdue')}
                      </span>
                    </div>
                    
                    {goal.deadline && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <Calendar size={14} />
                        {goal.deadline}
                      </div>
                    )}
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-2">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {(goal.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(goal.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(goal.tags || []).length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{(goal.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })
                    }}
                  >
                    +1 {goal.unit}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })
                    }}
                  >
                    -1
                  </Button>
                </div>
              </div>
                </SwipeableItem>
            ))}
          </div>
        </div>
      )}

      {/* Other Goals */}
      {otherGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target size={20} className="text-blue-600 dark:text-blue-400" />
            {t('otherGoals')} ({otherGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => deleteGoal(goal.id)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => openDetailModal(goal)}
                >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Target size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {getPriorityIcon(goal.priority)}
                      </span>
                    </div>
                    
                    {goal.deadline && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <Calendar size={14} />
                        {goal.deadline}
                      </div>
                    )}
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-2">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {(goal.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(goal.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(goal.tags || []).length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{(goal.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })
                    }}
                  >
                    +1 {goal.unit}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })
                    }}
                  >
                    -1
                  </Button>
                </div>
              </div>
                </SwipeableItem>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target size={20} className="text-green-600 dark:text-green-400" />
            {t('completedGoals')} ({completedGoals.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedGoals.map((goal, index) => (
              <SwipeableItem
                key={goal.id}
                onSwipeRight={() => completeGoal(goal.id)}
                onSwipeLeft={() => deleteGoal(goal.id)}
                onEdit={() => openDetailModal(goal)}
                onDelete={() => deleteGoal(goal.id)}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => openDetailModal(goal)}
                >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Target size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{goal.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        ✅
                      </span>
                    </div>
                    
                    {goal.deadline && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1">
                        <Calendar size={14} />
                        {goal.deadline}
                      </div>
                    )}
                    
                    <Progress current={goal.current || 0} target={goal.target || 0} />
                    <div className="text-xs text-gray-500 mt-2">
                      {goal.current || 0} / {goal.target} {goal.unit}
                    </div>
                    
                    {(goal.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(goal.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {(goal.tags || []).length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            +{(goal.tags || []).length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.min((goal.current || 0) + 1, goal.target || Infinity) })
                    }}
                  >
                    +1 {goal.unit}
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      updateGoal(goal.id, { current: Math.max((goal.current || 0) - 1, 0) })
                    }}
                  >
                    -1
                  </Button>
                </div>
              </div>
                </SwipeableItem>
            ))}
          </div>
        </div>
      )}

      {/* Completed & Deleted Items */}
      {completedItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Target size={20} className="text-gray-600 dark:text-gray-400" />
            {t('completedGoals')} & {t('deletedGoals')} ({completedItems.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedItems.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800/50 hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Target size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate line-through opacity-60">
                        {item.title}
                      </h3>
                      {item.completed && (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                          ✅ {t('completed')}
                        </span>
                      )}
                      {item.deleted && (
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                          🗑️ {t('deleted')}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      {item.completedAt && `${t('completed')}: ${new Date(item.completedAt).toLocaleDateString()}`}
                      {item.deletedAt && `${t('deleted')}: ${new Date(item.deletedAt).toLocaleDateString()}`}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm"
                    className="flex-1"
                    onClick={() => restoreItem(item)}
                  >
                    {t('restore')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('addGoal')}</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">{t('goalTitle')}</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder={t('goalTitlePlaceholder')}
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
                placeholder={t('unitPlaceholder')}
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
                placeholder={t('tagsPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('description')}</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
                placeholder={t('descriptionPlaceholder')}
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
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}>
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
                placeholder={t('tagsPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('description')}</label>
              <textarea
                value={selectedGoal.description || ''}
                onChange={e => updateGoal(selectedGoal.id, { description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
                placeholder={t('descriptionPlaceholder')}
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {toast.message}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.onUndo()
                      setToast(null)
                    }}
                  >
                    {t('undo')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setToast(null)}
                  >
                    {t('dismiss')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
