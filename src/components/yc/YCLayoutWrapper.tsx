'use client'

import React, { useState, useEffect } from 'react'
import { Loader as YCLoader, YCHeader, YCFooter } from '@/components/yc'
import type { Header, Footer } from '@/payload-types'

interface YCLayoutWrapperProps {
  children: React.ReactNode
  headerData?: Header
  footerData?: Footer
}

const YCLayoutWrapper: React.FC<YCLayoutWrapperProps> = ({ children, headerData, footerData }) => {
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
      <YCHeader data={headerData} />
      <main className="min-h-screen">{children}</main>
      <YCFooter data={footerData} />
    </>
  )
}

export default YCLayoutWrapper
