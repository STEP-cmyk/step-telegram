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
import { Plus, Target, Calendar, Tag, Star } from 'lucide-react'

export default function Goals() {
  console.log('Goals component is rendering')
  
  const { data, setData, ready, error } = useApp()
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

  console.log('Goals component state - ready:', ready, 'error:', error, 'data:', data)

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

  // Debug logging
  console.log('Goals component rendering with data:', data)

  // Safe data access with fallbacks
  const goals = data?.goals || []
  const completedItems = data?.completedItems || []

  console.log('Goals array:', goals)
  console.log('Completed items:', completedItems)

  // Group goals by category
  const groupedGoals = goals.reduce((acc, goal) => {
    const category = goal.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(goal)
    return acc
  }, {})

  // Simple test render to verify the page is working
  console.log('Goals page is rendering successfully')

  const addGoal = () => {
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
  }

  const updateGoal = (id, patch) => {
    setData(d => ({ 
      ...d, 
      goals: (d.goals || []).map(g => g.id === id ? { ...g, ...patch } : g) 
    }))
  }

  const completeGoal = (id) => {
    const goal = goals.find(g => g.id === id)
    if (goal) {
      // Move to completed items
      setData(d => ({
        ...d,
        goals: (d.goals || []).filter(g => g.id !== id),
        completedItems: [...(d.completedItems || []), { ...goal, completed: true, completedAt: new Date().toISOString() }]
      }))
    }
  }

  const deleteGoal = (id) => {
    const goal = goals.find(g => g.id === id)
    if (goal) {
      // Move to completed items
      setData(d => ({
        ...d,
        goals: (d.goals || []).filter(g => g.id !== id),
        completedItems: [...(d.completedItems || []), { ...goal, deleted: true, deletedAt: new Date().toISOString() }]
      }))
    }
  }

  const restoreItem = (item) => {
    setData(d => ({
      ...d,
      completedItems: (d.completedItems || []).filter(i => i.id !== item.id),
      goals: [...(d.goals || []), { ...item, completed: false, deleted: false, completedAt: undefined, deletedAt: undefined }]
    }))
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
    <div className="space-y-6">
      {/* Test message to verify rendering */}
      <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
        <h1 className="text-lg font-semibold text-green-800 dark:text-green-200">Goals Page is Working!</h1>
        <p className="text-sm text-green-600 dark:text-green-300">Data loaded: {ready ? 'Yes' : 'No'}</p>
        <p className="text-sm text-green-600 dark:text-green-300">Goals count: {goals.length}</p>
      </div>
      {/* Add Goal Button */}
      <div className="text-center">
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 text-lg float"
        >
          <Plus size={20} className="mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Active Goals */}
      <Section title="My Goals" tone="text-purple-600 dark:text-purple-400">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No goals yet. Create your first goal to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedGoals).map(([category, categoryGoals]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                  {category} ({categoryGoals.length})
                </h3>
                <div className="space-y-3">
                  {categoryGoals.map((goal, index) => (
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
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Completed/Deleted Items */}
      {completedItems.length > 0 && (
        <Section title="Completed & Deleted" tone="text-purple-600 dark:text-purple-400">
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
                  <Button size="sm" onClick={() => restoreItem(item)}>
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Goal"
        size="lg"
      >
        <div className="space-y-4">
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                {form.icon === 'Target' ? (
                  <Target size={24} className="text-purple-600 dark:text-purple-400" />
                ) : (
                  <div className="text-purple-600 dark:text-purple-400 text-lg">?</div>
                )}
              </div>
              <Button onClick={() => setShowIconPicker(true)} variant="outline">
                {form.icon === 'Target' ? 'Change Icon' : 'Choose Icon'}
              </Button>
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Goal Title</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="What do you want to achieve?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <Input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                placeholder="When do you want to achieve this?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Unit</label>
              <Input
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                placeholder="What unit measures your progress? (e.g., kg, km, $)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target</label>
              <Input
                type="number"
                value={form.target}
                onChange={e => setForm({ ...form, target: Number(e.target.value) })}
                placeholder="What's your target number?"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Finance">Finance</option>
              <option value="Hobbies">Hobbies</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagInput
              tags={form.tags}
              onChange={tags => setForm({ ...form, tags })}
              placeholder="Add tags to organize your goals..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details about your goal..."
              rows={3}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={addGoal} className="flex-1" disabled={!form.title.trim()}>
              Create Goal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Goal Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedGoal?.title || 'Goal Details'}
        size="lg"
      >
        {selectedGoal && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={selectedGoal.title}
                  onChange={e => updateGoal(selectedGoal.id, { title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input
                  type="date"
                  value={selectedGoal.deadline}
                  onChange={e => updateGoal(selectedGoal.id, { deadline: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <Input
                  value={selectedGoal.unit}
                  onChange={e => updateGoal(selectedGoal.id, { unit: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target</label>
                <Input
                  type="number"
                  value={selectedGoal.target}
                  onChange={e => updateGoal(selectedGoal.id, { target: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Progress</label>
              <Input
                type="number"
                value={selectedGoal.current || 0}
                onChange={e => updateGoal(selectedGoal.id, { current: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={selectedGoal.priority}
                onChange={e => updateGoal(selectedGoal.id, { priority: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedGoal.category}
                onChange={e => updateGoal(selectedGoal.id, { category: e.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <TagInput
                tags={selectedGoal.tags || []}
                onChange={tags => updateGoal(selectedGoal.id, { tags })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={selectedGoal.description || ''}
                onChange={e => updateGoal(selectedGoal.id, { description: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowDetailModal(false)} className="flex-1">
                Close
              </Button>
              <Button variant="primary" onClick={() => setShowDetailModal(false)} className="flex-1">
                Save Changes
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
            console.log('Icon selected in Goals:', icon)
            setForm({ ...form, icon })
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  )
}
