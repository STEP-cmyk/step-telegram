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
import { uid, currency } from '../lib/utils'
import { Plus, Heart, Calendar, Link, Tag, Star, Target } from 'lucide-react'

export default function Wishes() {
  const { data, setData, ready } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedWish, setSelectedWish] = useState(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [form, setForm] = useState({
    title: '',
    targetAmount: 0,
    savedAmount: 0,
    deadline: '',
    link: '',
    icon: 'Heart',
    category: 'Personal',
    tags: [],
    priority: 'Medium',
    description: ''
  })

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
  console.log('Wishes component rendering with data:', data)

  // Safe data access with fallbacks
  const wishes = data?.wishes || []
  const completedItems = data?.completedItems || []

  console.log('Wishes array:', wishes)
  console.log('Completed items:', completedItems)

  // Group wishes by category
  const groupedWishes = wishes.reduce((acc, wish) => {
    const category = wish.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(wish)
    return acc
  }, {})

  const addWish = () => {
    const newWish = {
      id: uid(),
      ...form,
      createdAt: new Date().toISOString(),
      completed: false,
      deleted: false
    }
    setData(d => ({ 
      ...d, 
      wishes: [...(d.wishes || []), newWish] 
    }))
    setForm({
      title: '',
      targetAmount: 0,
      savedAmount: 0,
      deadline: '',
      link: '',
      icon: 'Heart',
      category: 'Personal',
      tags: [],
      priority: 'Medium',
      description: ''
    })
    setShowAddModal(false)
  }

  const updateWish = (id, patch) => {
    setData(d => ({ 
      ...d, 
      wishes: (d.wishes || []).map(w => w.id === id ? { ...w, ...patch } : w) 
    }))
  }

  const completeWish = (id) => {
    const wish = wishes.find(w => w.id === id)
    if (wish) {
      setData(d => ({
        ...d,
        wishes: (d.wishes || []).filter(w => w.id !== id),
        completedItems: [...(d.completedItems || []), { ...wish, completed: true, completedAt: new Date().toISOString() }]
      }))
    }
  }

  const deleteWish = (id) => {
    const wish = wishes.find(w => w.id === id)
    if (wish) {
      setData(d => ({
        ...d,
        wishes: (d.wishes || []).filter(w => w.id !== id),
        completedItems: [...(d.completedItems || []), { ...wish, deleted: true, deletedAt: new Date().toISOString() }]
      }))
    }
  }

  const restoreItem = (item) => {
    setData(d => ({
      ...d,
      completedItems: (d.completedItems || []).filter(i => i.id !== item.id),
      wishes: [...(d.wishes || []), { ...item, completed: false, deleted: false, completedAt: undefined, deletedAt: undefined }]
    }))
  }

  const openDetailModal = (wish) => {
    setSelectedWish(wish)
    setShowDetailModal(true)
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
      {/* Add Wish Button */}
      <div className="text-center">
        <Button 
          variant="primary" 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 text-lg float"
        >
          <Plus size={20} className="mr-2" />
          Add Wish
        </Button>
      </div>

      {/* Active Wishes */}
      <Section title="My Wishes" tone="text-blue-600 dark:text-blue-400">
        {wishes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <p>No wishes yet. Add your first wish to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Group wishes by category */}
            {(() => {
              const groupedWishes = wishes.reduce((groups, wish) => {
                const category = wish.category || 'Uncategorized'
                if (!groups[category]) {
                  groups[category] = []
                }
                groups[category].push(wish)
                return groups
              }, {})

              return Object.entries(groupedWishes).map(([category, categoryWishes]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                    {category} ({categoryWishes.length})
                  </h3>
                  <div className="space-y-3">
                    {categoryWishes.map((wish, index) => (
                      <SwipeableItem
                        key={wish.id}
                        onSwipeRight={() => completeWish(wish.id)}
                        onSwipeLeft={() => openDetailModal(wish)}
                        onEdit={() => openDetailModal(wish)}
                        onDelete={() => deleteWish(wish.id)}
                        className={`p-4 stagger-item`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                              <Heart size={20} className="text-pink-600 dark:text-pink-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate">{wish.title}</h3>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                                {getPriorityIcon(wish.priority)} {wish.priority}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Target size={14} />
                                  Target: {currency(wish.targetAmount)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Tag size={14} />
                                  Saved: {currency(wish.savedAmount)}
                                </span>
                                {wish.deadline && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {wish.deadline}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <Progress current={wish.savedAmount || 0} target={wish.targetAmount || 0} />
                            <div className="text-xs text-gray-500 mt-1">
                              {currency(wish.savedAmount || 0)} / {currency(wish.targetAmount)} saved
                            </div>
                            
                            {wish.tags && wish.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {wish.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-xs px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                                {wish.tags.length > 3 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                    +{wish.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => updateWish(wish.id, { savedAmount: Math.min((wish.savedAmount || 0) + 1000, wish.targetAmount || Infinity) })}
                            >
                              +1 000
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => updateWish(wish.id, { savedAmount: Math.max((wish.savedAmount || 0) - 1000, 0) })}
                            >
                              -1 000
                            </Button>
                          </div>
                        </div>
                        
                        {wish.link && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <a 
                              href={wish.link} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <Link size={14} />
                              {wish.link}
                            </a>
                          </div>
                        )}
                      </SwipeableItem>
                    ))}
                  </div>
                </div>
              ))
            })()}
          </div>
        )}
      </Section>

      {/* Completed/Deleted Items */}
      {completedItems.length > 0 && (
        <Section title="Completed & Deleted" tone="text-blue-600 dark:text-blue-400">
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

      {/* Add Wish Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Wish"
        size="lg"
      >
        <div className="space-y-4">
          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                {form.icon === 'Heart' ? (
                  <Heart size={24} className="text-pink-600 dark:text-pink-400" />
                ) : (
                  <div className="text-pink-600 dark:text-pink-400 text-lg">?</div>
                )}
              </div>
              <Button onClick={() => setShowIconPicker(true)} variant="outline">
                {form.icon === 'Heart' ? 'Change Icon' : 'Choose Icon'}
              </Button>
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Wish Title</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="What do you wish for?"
              />
            </div>
            
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
                <option value="Finance">Finance</option>
                <option value="Learning">Learning</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Target Amount</label>
              <Input
                type="number"
                value={form.targetAmount}
                onChange={e => setForm({ ...form, targetAmount: Number(e.target.value) })}
                placeholder="How much does it cost?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Already Saved</label>
              <Input
                type="number"
                value={form.savedAmount}
                onChange={e => setForm({ ...form, savedAmount: Number(e.target.value) })}
                placeholder="How much have you saved?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <Input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
                placeholder="When do you want it by?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Link (Optional)</label>
              <Input
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
                placeholder="Product link or reference"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagInput
              tags={form.tags}
              onChange={tags => setForm({ ...form, tags })}
              placeholder="Add tags to organize your wishes..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details about your wish..."
              rows={3}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={addWish} className="flex-1" disabled={!form.title.trim()}>
              Add Wish
            </Button>
          </div>
        </div>
      </Modal>

      {/* Wish Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedWish?.title || 'Wish Details'}
        size="lg"
      >
        {selectedWish && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={selectedWish.title}
                  onChange={e => updateWish(selectedWish.id, { title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={selectedWish.priority}
                  onChange={e => updateWish(selectedWish.id, { priority: e.target.value })}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount</label>
                <Input
                  type="number"
                  value={selectedWish.targetAmount}
                  onChange={e => updateWish(selectedWish.id, { targetAmount: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Already Saved</label>
                <Input
                  type="number"
                  value={selectedWish.savedAmount}
                  onChange={e => updateWish(selectedWish.id, { savedAmount: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <Input
                  type="date"
                  value={selectedWish.deadline}
                  onChange={e => updateWish(selectedWish.id, { deadline: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <Input
                  value={selectedWish.link}
                  onChange={e => updateWish(selectedWish.id, { link: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <TagInput
                tags={selectedWish.tags || []}
                onChange={tags => updateWish(selectedWish.id, { tags })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={selectedWish.description || ''}
                onChange={e => updateWish(selectedWish.id, { description: e.target.value })}
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
            console.log('Icon selected in Wishes:', icon)
            setForm({ ...form, icon })
            setShowIconPicker(false)
          }}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  )
}
