'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import gsap from 'gsap'
import type { Project } from '@/types/yc'

interface ProjectDetailClientProps {
  project: Project
}

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ project }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const allImages = [project.image, ...project.gallery]
  const beforeImage = project.beforeImage || project.image
  const afterImage = project.image

  useEffect(() => {
    if (!contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.detail-title', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.detail-meta', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.2,
        stagger: 0.1,
        ease: 'power2.out',
      })
      gsap.from('.detail-content', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out',
      })
    }, contentRef)

    return () => ctx.revert()
  }, [])

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleSliderMove(e.clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    handleSliderMove(e.touches[0].clientX)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div ref={contentRef} className="min-h-screen pt-24 pb-12 transition-colors duration-500">
      {/* Back Button */}
      <div className="container mx-auto px-6 mb-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-yc-yellow transition-colors font-rubik"
        >
          <ArrowLeft size={20} />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Gallery */}
          <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <Image
                src={allImages[currentImageIndex]}
                alt={project.title}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-yc-yellow text-white hover:text-black rounded-full transition-all"
              >
                <ZoomIn size={20} />
              </button>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-yc-yellow text-white hover:text-black rounded-full transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-yc-yellow text-white hover:text-black rounded-full transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? 'border-yc-yellow'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Before/After Slider */}
            {project.beforeImage && (
              <div className="mt-8">
                <h3 className="text-lg font-syne font-bold text-zinc-900 dark:text-white mb-4">
                  Before & After
                </h3>
                <div
                  ref={sliderRef}
                  className="relative aspect-[4/3] rounded-sm overflow-hidden cursor-ew-resize select-none"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                >
                  {/* After Image (Background) */}
                  <div className="absolute inset-0">
                    <Image src={afterImage} alt="After" fill className="object-cover" unoptimized />
                  </div>

                  {/* Before Image (Clipped) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <Image
                      src={beforeImage}
                      alt="Before"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Slider Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-yc-yellow shadow-lg"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-yc-yellow rounded-full flex items-center justify-center shadow-lg">
                      <ChevronLeft size={16} className="text-black -mr-1" />
                      <ChevronRight size={16} className="text-black -ml-1" />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-xs font-syne uppercase tracking-wider rounded">
                    Before
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yc-yellow text-black text-xs font-syne uppercase tracking-wider rounded">
                    After
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
            <div>
              <span className="detail-meta inline-block text-xs font-bold text-yc-yellow uppercase tracking-widest border border-yc-yellow/20 px-3 py-1 rounded-sm mb-4">
                {project.category}
              </span>
              <h1 className="detail-title text-4xl md:text-5xl lg:text-6xl font-syne font-bold text-zinc-900 dark:text-white mb-4 transition-colors duration-500">
                {project.title}
              </h1>
            </div>

            <div className="detail-meta grid grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik">
                  Year
                </span>
                <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                  {project.year}
                </p>
              </div>
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik">
                  Category
                </span>
                <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                  {project.category}
                </p>
              </div>
            </div>

            <div className="detail-content">
              <h3 className="text-lg font-syne font-bold text-zinc-900 dark:text-white mb-3">
                About This Build
              </h3>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-zinc-600 dark:text-zinc-400 font-rubik leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="detail-content pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 font-rubik mb-4">Interested in a similar build?</p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yc-yellow text-black font-syne font-bold uppercase tracking-wider rounded-sm hover:bg-yellow-400 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white hover:text-yc-yellow transition-colors"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-yc-yellow transition-colors"
          >
            <ChevronLeft size={40} />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-[4/3] mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[currentImageIndex]}
              alt={project.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-yc-yellow transition-colors"
          >
            <ChevronRight size={40} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-yc-yellow w-6' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailClient
