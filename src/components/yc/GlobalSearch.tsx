'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import type { SearchResult } from '@/app/(frontend)/api/search/route'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // This would need to be called from parent
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Debounced search
  const searchDebounceRef = useRef<NodeJS.Timeout>()

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    searchDebounceRef.current = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [query, performSearch])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'restoration':
        return 'Restoration'
      case 'modification':
        return 'Custom Build'
      case 'sale':
        return 'For Sale'
      case 'post':
        return 'Blog'
      default:
        return type
    }
  }

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'restoration':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'modification':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'sale':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'post':
        return 'bg-yc-yellow/20 text-yc-yellow border-yc-yellow/30'
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search size={20} className="text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, bikes, posts..."
            className="flex-1 bg-transparent text-lg font-rubik text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
          />
          {isLoading && <Loader2 size={20} className="text-zinc-400 animate-spin" />}
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 && (
            <div className="p-8 text-center text-zinc-500 font-rubik">
              <p>Type at least 2 characters to search</p>
              <p className="text-sm mt-2 text-zinc-400">
                Press{' '}
                <kbd className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">⌘K</kbd> to
                open search anytime
              </p>
            </div>
          )}

          {query.length >= 2 && results.length === 0 && !isLoading && (
            <div className="p-8 text-center text-zinc-500 font-rubik">
              <p>No results found for &quot;{query}&quot;</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-zinc-100 dark:bg-zinc-800'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-16 h-12 bg-zinc-200 dark:bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${getTypeColor(result.type)}`}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <h4 className="font-syne font-bold text-zinc-900 dark:text-white truncate">
                        {result.title}
                      </h4>
                      <p className="text-sm text-zinc-500 truncate">{result.description}</p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight
                      size={16}
                      className={`text-zinc-400 transition-opacity ${
                        index === selectedIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 font-rubik">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">↵</kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">esc</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearch
