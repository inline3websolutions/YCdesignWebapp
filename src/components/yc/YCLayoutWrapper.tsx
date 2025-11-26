'use client'

import React, { useState, useEffect } from 'react'
import { Loader as YCLoader, YCHeader, YCFooter } from '@/components/yc'

interface YCLayoutWrapperProps {
  children: React.ReactNode
}

const YCLayoutWrapper: React.FC<YCLayoutWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Check if we've already loaded in this session
    const alreadyLoaded = sessionStorage.getItem('yc-loaded')
    if (alreadyLoaded) {
      setIsLoading(false)
      setHasLoaded(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setHasLoaded(true)
    sessionStorage.setItem('yc-loaded', 'true')
  }

  // Skip loader if already loaded this session
  if (!hasLoaded && isLoading) {
    return <YCLoader onComplete={handleLoadingComplete} />
  }

  return (
    <>
      <YCHeader />
      <main className="min-h-screen">{children}</main>
      <YCFooter />
    </>
  )
}

export default YCLayoutWrapper
