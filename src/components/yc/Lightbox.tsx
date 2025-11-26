'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  isOpen: boolean
  onClose: () => void
  startIndex?: number
}

const Lightbox: React.FC<LightboxProps> = ({ images, isOpen, onClose, startIndex = 0 }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(startIndex)

  // Sync internal state when prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex)
    }
  }, [isOpen, startIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Immediate scroll to start index without animation for initial open
      if (scrollContainerRef.current) {
        const width = scrollContainerRef.current.offsetWidth
        scrollContainerRef.current.scrollTo({ left: width * startIndex, behavior: 'instant' })
      }
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, startIndex])

  // Scroll Helpers
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return
    const width = scrollContainerRef.current.offsetWidth
    scrollContainerRef.current.scrollTo({ left: width * index, behavior: 'smooth' })
  }, [])

  const scrollPrev = useCallback(() => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }, [currentIndex, scrollToIndex])

  const scrollNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }, [currentIndex, images.length, scrollToIndex])

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') scrollPrev()
      if (e.key === 'ArrowRight') scrollNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, scrollPrev, scrollNext])

  // Track scroll to update index counter
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const scrollLeft = scrollContainerRef.current.scrollLeft
    const width = scrollContainerRef.current.offsetWidth
    const index = Math.round(scrollLeft / width)
    setCurrentIndex(index)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-xl animate-in fade-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors p-2 bg-black/20 rounded-full cursor-pointer"
      >
        <X size={32} />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory h-full items-center scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full h-full flex items-center justify-center p-4 md:p-20 snap-center"
          >
            <div className="relative max-h-full max-w-full w-full h-full">
              <Image
                src={img}
                alt={`Gallery ${i}`}
                fill
                className="object-contain shadow-2xl select-none"
                draggable={false}
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls / Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 pointer-events-none">
        <span className="bg-zinc-900/80 px-4 py-2 rounded-full text-white font-syne text-xs uppercase tracking-widest backdrop-blur-sm border border-white/10 shadow-xl">
          {currentIndex + 1} <span className="text-zinc-500 mx-2">/</span> {images.length}
        </span>
      </div>

      {/* Navigation Buttons (Desktop) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          scrollPrev()
        }}
        disabled={currentIndex === 0}
        className={`hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 cursor-pointer z-50 bg-black/20 hover:bg-black/40 rounded-full disabled:opacity-0 disabled:cursor-default`}
      >
        <ChevronLeft size={48} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          scrollNext()
        }}
        disabled={currentIndex === images.length - 1}
        className={`hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 cursor-pointer z-50 bg-black/20 hover:bg-black/40 rounded-full disabled:opacity-0 disabled:cursor-default`}
      >
        <ChevronRight size={48} />
      </button>
    </div>
  )
}

export default Lightbox
