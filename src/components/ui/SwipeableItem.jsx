import React, { useRef, useState, useEffect } from 'react'
import { Edit, Trash2, CheckCircle, X, CheckSquare } from 'lucide-react'
import { useTranslation } from '../../lib/i18n'

export default function SwipeableItem({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onEdit, 
  onDelete,
  onComplete,
  completed = false,
  deleted = false,
  className = "",
  onClick
}) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [showActions, setShowActions] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const itemRef = useRef(null)

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
    setShowActions(false)
    setHasMoved(false)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startX
    setCurrentX(deltaX)
    
    // Track that user has moved - prevents accidental detail opens
    if (Math.abs(deltaX) > 10) {
      setHasMoved(true)
    }
    
    // Show actions when swiping far enough
    if (Math.abs(deltaX) > 60) {
      setShowActions(true)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaX = currentX
    const threshold = 100

    if (deltaX > threshold) {
      // Swipe right - mark as completed
      onComplete?.()
      onSwipeRight?.()
    } else if (deltaX < -threshold) {
      // Swipe left - delete with confirmation
      onDelete?.()
      onSwipeLeft?.()
    } else if (!hasMoved && onClick) {
      // Tap without swipe - open details
      onClick()
    }

    setIsDragging(false)
    setCurrentX(0)
    setShowActions(false)
    setHasMoved(false)
  }

  const handleMouseDown = (e) => {
    setStartX(e.clientX)
    setIsDragging(true)
    setShowActions(false)
    setHasMoved(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    setCurrentX(deltaX)
    
    if (Math.abs(deltaX) > 10) {
      setHasMoved(true)
    }
    
    if (Math.abs(deltaX) > 60) {
      setShowActions(true)
    }
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    item.addEventListener('touchstart', handleTouchStart, { passive: false })
    item.addEventListener('touchmove', handleTouchMove, { passive: false })
    item.addEventListener('touchend', handleTouchEnd, { passive: false })
    item.addEventListener('mousedown', handleMouseDown)
    item.addEventListener('mousemove', handleMouseMove)
    item.addEventListener('mouseup', handleMouseUp)
    item.addEventListener('mouseleave', handleMouseUp)

    return () => {
      item.removeEventListener('touchstart', handleTouchStart)
      item.removeEventListener('touchmove', handleTouchMove)
      item.removeEventListener('touchend', handleTouchEnd)
      item.removeEventListener('mousedown', handleMouseDown)
      item.removeEventListener('mousemove', handleMouseMove)
      item.removeEventListener('mouseup', handleMouseUp)
      item.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [isDragging, startX, currentX, hasMoved, onClick])

  const transform = isDragging ? `translateX(${currentX}px)` : 'translateX(0px)'
  const opacity = isDragging ? 0.9 : 1
  
  // Determine background color based on swipe direction
  const getSwipeBackground = () => {
    if (!isDragging || Math.abs(currentX) < 60) return 'transparent'
    if (currentX > 0) return 'rgba(34, 197, 94, 0.2)' // Green for complete
    return 'rgba(239, 68, 68, 0.2)' // Red for delete
  }

  return (
    <div 
      ref={itemRef}
      className={`swipeable-item relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 ${className}`}
      style={{ backgroundColor: getSwipeBackground() }}
    >
      {/* Swipe Actions - Hidden by default */}
      <div className={`absolute inset-0 flex items-center justify-between px-6 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center text-green-600 dark:text-green-400">
          <CheckSquare size={20} />
          <span className="ml-2 text-sm font-medium">{t('completed')}</span>
        </div>
        <div className="flex items-center text-red-600 dark:text-red-400">
          <span className="mr-2 text-sm font-medium">{t('delete')}</span>
          <Trash2 size={20} />
        </div>
      </div>
      
      {/* Main Content */}
      <div 
        className="relative bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm transition-all duration-200 ease-out rounded-xl"
        style={{ transform, opacity }}
      >
        {children}
      </div>
    </div>
  )
}
