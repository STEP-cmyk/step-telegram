import React, { useEffect, useRef } from 'react'
import { 
  Target, CheckSquare, Heart, NotebookText, Trophy, Zap, 
  Home, Building2, GraduationCap, Star, Gift, Camera, Music, BookOpen,
  Coffee, Dumbbell, DollarSign, Car, Plane, Gamepad2, X
} from 'lucide-react'

const ICONS = [
  { id: 'Target', icon: Target, category: 'Goals' },
  { id: 'CheckSquare', icon: CheckSquare, category: 'Habits' },
  { id: 'Heart', icon: Heart, category: 'Wishes' },
  { id: 'NotebookText', icon: NotebookText, category: 'Notes' },
  { id: 'Trophy', icon: Trophy, category: 'Competitions' },
  { id: 'Zap', icon: Zap, category: 'Motivation' },
  { id: 'Home', icon: Home, category: 'Personal' },
  { id: 'Building2', icon: Building2, category: 'Work' },
  { id: 'GraduationCap', icon: GraduationCap, category: 'Learning' },
  { id: 'Star', icon: Star, category: 'Favorites' },
  { id: 'Gift', icon: Gift, category: 'Gifts' },
  { id: 'Camera', icon: Camera, category: 'Hobbies' },
  { id: 'Music', icon: Music, category: 'Entertainment' },
  { id: 'BookOpen', icon: BookOpen, category: 'Reading' },
  { id: 'Coffee', icon: Coffee, category: 'Health' },
  { id: 'Dumbbell', icon: Dumbbell, category: 'Fitness' },
  { id: 'DollarSign', icon: DollarSign, category: 'Finance' },
  { id: 'Car', icon: Car, category: 'Transport' },
  { id: 'Plane', icon: Plane, category: 'Travel' },
  { id: 'Gamepad2', icon: Gamepad2, category: 'Gaming' }
]

export default function IconPicker({ selectedIcon, onSelect, onClose }) {
  const modalRef = useRef(null)
  const firstIconRef = useRef(null)

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Focus first icon on mount
  useEffect(() => {
    if (firstIconRef.current) {
      firstIconRef.current.focus()
    }
  }, [])

  const handleIconSelect = (iconId) => {

    onSelect(iconId)
    onClose()
  }

  const handleKeyDown = (e, iconId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleIconSelect(iconId)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      <div 
        ref={modalRef}
        className="icon-picker relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10"
      >
        <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-lg font-semibold">Choose Icon</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close icon picker"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-5 gap-3">
            {ICONS.map(({ id, icon: Icon, category }, index) => (
              <button
                key={id}
                ref={index === 0 ? firstIconRef : null}
                onClick={() => handleIconSelect(id)}
                onKeyDown={(e) => handleKeyDown(e, id)}
                className={`icon-option p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedIcon === id
                    ? 'selected border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                title={`${id} (${category})`}
                aria-label={`Select ${id} icon`}
                tabIndex={0}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Icon 
                  size={24} 
                  className={`${
                    selectedIcon === id 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
