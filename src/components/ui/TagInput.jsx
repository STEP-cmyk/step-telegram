import React from 'react'
import { X, Plus } from 'lucide-react'

const SUGGESTED_TAGS = ['Personal', 'Work', 'Home', 'Idea', 'Health', 'Finance', 'Fitness', 'Learning', 'Business', 'Family']

export default function TagInput({ tags = [], onChange, placeholder = "Add tags..." }) {
  const [inputValue, setInputValue] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)

  const addTag = (tag) => {
    const cleanTag = tag.trim()
    if (cleanTag && !tags.includes(cleanTag)) {
      onChange([...tags, cleanTag])
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    tag => !tags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-800 min-h-[44px]">
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-lg"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
        />
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
          {filteredSuggestions.map(tag => (
            <button
              key={tag}
              onClick={() => addTag(tag)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 text-sm flex items-center gap-2"
            >
              <Plus size={14} />
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
