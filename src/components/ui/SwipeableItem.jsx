import React, { useRef, useState, useEffect } from 'react'
import { Edit, Trash2, CheckCircle, X, CheckSquare } from 'lucide-react'

export default function SwipeableItem({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  onEdit, 
  onDelete,
  completed = false,
  deleted = false,
  className = ""
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [showActions, setShowActions] = useState(false)
  const itemRef = useRef(null)

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
    setShowActions(false)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startX
    setCurrentX(deltaX)
    
    // Show actions when swiping far enough
    if (Math.abs(deltaX) > 50) {
      setShowActions(true)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const deltaX = currentX
    const threshold = 80

    if (deltaX > threshold) {
      // Swipe right - mark as completed
      onSwipeRight?.()
    } else if (deltaX < -threshold) {
      // Swipe left - show edit/delete options
      onSwipeLeft?.()
    }

    setIsDragging(false)
    setCurrentX(0)
    setShowActions(false)
  }

  const handleMouseDown = (e) => {
    setStartX(e.clientX)
    setIsDragging(true)
    setShowActions(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    setCurrentX(deltaX)
    
    if (Math.abs(deltaX) > 50) {
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
      item.removeEventListener('touchmove', handleMouseMove)
      item.removeEventListener('touchend', handleTouchEnd)
      item.removeEventListener('mousedown', handleMouseDown)
      item.removeEventListener('mousemove', handleMouseMove)
      item.removeEventListener('mouseup', handleMouseUp)
      item.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [isDragging, startX, currentX])

  const transform = isDragging ? `translateX(${currentX}px)` : 'translateX(0px)'
  const opacity = isDragging ? 0.8 : 1

  return (
    <div 
      ref={itemRef}
      className={`swipeable-item relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Swipe Actions */}
      <div className="absolute inset-y-0 left-0 flex items-center bg-green-500 text-white px-4 rounded-l-xl">
        <CheckSquare size={20} />
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center bg-red-500 text-white px-4 rounded-r-xl">
        <Trash2 size={20} />
      </div>
      
      {/* Main Content */}
      <div 
        className="relative bg-white dark:bg-zinc-800 transition-transform duration-300 ease-out"
        style={{ transform, opacity }}
      >
        {children}
      </div>
    </div>
  )
}
