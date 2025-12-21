'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Loader as YCLoader, YCHeader, YCFooter } from '@/components/yc'
import type { Header, Footer } from '@/payload-types'
import { Search } from 'lucide-react'
import GlobalSearch from './GlobalSearch'

interface YCLayoutWrapperProps {
  children: React.ReactNode
  headerData?: Header
  footerData?: Footer
  enableLoader?: boolean | null
}

const YCLayoutWrapper: React.FC<YCLayoutWrapperProps> = ({
  children,
  headerData,
  footerData,
  enableLoader = true,
}) => {
  // Start with null to properly handle SSR/hydration
  const [showLoader, setShowLoader] = useState<boolean | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if we've already loaded in this session
    const alreadyLoaded = sessionStorage.getItem('yc-loaded')

    if (enableLoader === false) {
      setShowLoader(false)
    } else if (alreadyLoaded) {
      setShowLoader(false)
    } else {
      setShowLoader(true)
    }

    // Keyboard shortcut for search (Cmd+K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enableLoader])

  const handleLoadingComplete = useCallback(() => {
    setShowLoader(false)
    sessionStorage.setItem('yc-loaded', 'true')
  }, [])

  // Wait for client-side mount to determine loader state
  if (enableLoader !== false && (!isMounted || showLoader === null)) {
    // Return a minimal loading state to prevent flash
    return (
      <div className="fixed inset-0 z-[100] bg-[#09090B] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-yc-yellow/30 border-t-yc-yellow rounded-full animate-spin" />
      </div>
    )
  }

  // Show the full loader animation
  if (showLoader && enableLoader !== false) {
    return <YCLoader onComplete={handleLoadingComplete} />
  }

  return (
    <>
      <YCHeader data={headerData} />
      <main className="min-h-screen">{children}</main>
      <YCFooter data={footerData} />

      {/* Floating Search Button - Bottom Right */}
      <button
        onClick={() => setSearchOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-zinc-900 dark:bg-white border border-zinc-700 dark:border-zinc-300 shadow-lg hover:shadow-xl hover:scale-110 text-white dark:text-zinc-900 hover:bg-yc-yellow hover:text-black dark:hover:bg-yc-yellow dark:hover:text-black transition-all duration-300 group"
        aria-label="Search (Ctrl+K)"
      >
        <Search size={20} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="sr-only">Search</span>
      </button>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

export default YCLayoutWrapper
