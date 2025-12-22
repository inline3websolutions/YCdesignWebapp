'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import type { Page } from '@/payload-types'
import { Media } from '@/payload-types'
import Link from 'next/link'

type Props = Extract<Page['layout'][number], { blockType: 'ycHeroSlider' }>

export const YCHeroSliderBlock: React.FC<Props> = (props) => {
  const { slides } = props
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressRef = useRef<HTMLDivElement>(null)

  const activeSlides = slides || []

  const animateSlide = useCallback(
    (nextIndex: number, direction: 'next' | 'prev') => {
      if (isAnimating) return
      setIsAnimating(true)

      const currentSlide = slideRefs.current[current]
      const nextSlide = slideRefs.current[nextIndex]

      if (!currentSlide || !nextSlide) return

      const tl = gsap.timeline({
        onComplete: () => {
          setCurrent(nextIndex)
          setIsAnimating(false)
        },
      })

      gsap.set(nextSlide, { opacity: 0, zIndex: 10 })
      gsap.set(currentSlide, { zIndex: 5 })

      tl.to(currentSlide.querySelectorAll('.anim-text'), {
        y: direction === 'next' ? -20 : 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.in',
      })

      tl.to(
        currentSlide,
        {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        '-=0.2',
      )

      tl.fromTo(
        nextSlide,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.inOut' },
        '-=0.4',
      )

      tl.fromTo(
        nextSlide.querySelectorAll('.anim-text'),
        { y: direction === 'next' ? 20 : -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
        '-=0.3',
      )

      tl.fromTo(
        nextSlide.querySelector('.bg-img'),
        { scale: 1.1 },
        { scale: 1, duration: 8, ease: 'linear' },
        '-=0.8',
      )

      gsap.set(progressRef.current, { scaleX: 0 })
      gsap.to(progressRef.current, { scaleX: 1, duration: 6, ease: 'none' })
    },
    [current, isAnimating],
  )

  const next = () => {
    if (activeSlides.length === 0) return
    const nextIndex = (current + 1) % activeSlides.length
    animateSlide(nextIndex, 'next')
  }

  const prev = () => {
    if (activeSlides.length === 0) return
    const nextIndex = (current - 1 + activeSlides.length) % activeSlides.length
    animateSlide(nextIndex, 'prev')
  }

  useEffect(() => {
    if (activeSlides.length === 0) return

    // Initial animation for first load
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
    gsap.to(progressRef.current, { scaleX: 1, duration: 6, ease: 'none' })

    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [current, activeSlides.length]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!activeSlides.length) return null

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-yc-dark overflow-hidden transition-colors duration-500 -mt-20"
    >
      {/* Slides */}
      {activeSlides.map((slide, idx) => {
        let imageUrl = ''
        let mobileImageUrl = ''

        if (slide.image && typeof slide.image === 'object') {
          imageUrl = (slide.image as Media).url || ''
        }

        if (slide.mobileImage && typeof slide.mobileImage === 'object') {
          mobileImageUrl = (slide.mobileImage as Media).url || ''
        } else if (imageUrl) {
          // Fallback to desktop image if mobile image is not provided
          mobileImageUrl = imageUrl
        }

        return (
          <div
            key={slide.id || idx}
            ref={(el) => {
              if (el) slideRefs.current[idx] = el
            }}
            className={`absolute inset-0 w-full h-full ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image - High Visibility */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Desktop Image */}
              {imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imageUrl}
                  alt={slide.title || ''}
                  className="bg-img hidden md:block w-full h-full object-cover transition-transform duration-[8000ms] ease-linear brightness-[0.85]"
                  style={{ transform: idx === current ? 'scale(1.05)' : 'scale(1.1)' }}
                />
              )}
              {/* Mobile Image */}
              {mobileImageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={mobileImageUrl}
                  alt={slide.title || ''}
                  className="bg-img block md:hidden w-full h-full object-cover transition-transform duration-[8000ms] ease-linear brightness-[0.85]"
                  style={{ transform: idx === current ? 'scale(1.05)' : 'scale(1.1)' }}
                />
              )}
              {/* Soft Gradients for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-yc-dark/70 via-yc-dark/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-yc-dark/50 via-transparent to-transparent"></div>
            </div>

            {/* Content Overlay - Fully Responsive Padding */}
            <div className="relative h-full container mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-center">
              <div className="max-w-xl md:max-w-2xl lg:max-w-3xl pt-16 md:pt-20">
                <div className="anim-text flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 bg-yc-yellow text-black font-syne font-bold text-[8px] md:text-[9px] tracking-[0.15em] uppercase">
                    {slide.tag}
                  </span>
                  <div className="w-6 h-px bg-white/30"></div>
                  <span className="text-white/60 font-rubik text-[8px] md:text-[9px] tracking-[0.2em] uppercase">
                    {String(idx + 1).padStart(2, '0')} /{' '}
                    {String(activeSlides.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Responsive Headline - Scaled for Small Devices */}
                <h1 className="anim-text text-3xl sm:text-5xl md:text-6xl lg:text-[75px] font-syne font-extrabold text-white leading-[1.1] sm:leading-[0.95] uppercase tracking-tighter mb-4 sm:mb-6">
                  {slide.title}
                  <br />
                  <span
                    className="text-transparent border-text stroke-white"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.85)' }}
                  >
                    {slide.highlight}
                  </span>
                </h1>

                <div className="anim-text flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
                  <div className="flex items-center gap-1.5 text-yc-yellow font-rubik font-bold uppercase tracking-widest text-[10px] sm:text-[11px]">
                    <ArrowRight size={12} className="shrink-0" />
                    {slide.subtitle}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/50 font-rubik text-[8px] sm:text-[9px] uppercase tracking-widest">
                    <MapPin size={10} className="shrink-0" />
                    {slide.coords}
                  </div>
                </div>

                {/* Responsive Description - Scaled to avoid overflow */}
                <p className="anim-text text-zinc-300 font-rubik text-[11px] sm:text-xs md:text-sm lg:text-base max-w-sm sm:max-w-md md:max-w-lg leading-relaxed mb-8 sm:mb-10 opacity-90">
                  {slide.description}
                </p>

                <div className="anim-text flex items-center gap-6">
                  <Link
                    href="/#portfolio"
                    className="px-5 py-3 sm:px-7 sm:py-3.5 bg-white text-black font-syne font-bold uppercase tracking-widest text-[9px] sm:text-[10px] hover:bg-yc-yellow transition-colors duration-300 flex items-center gap-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Navigation UI - Responsive Placement */}
      <div className="absolute bottom-8 left-6 right-6 sm:left-12 sm:right-12 z-40 flex flex-row justify-between items-center gap-4">
        {/* Progress Bar - Hidden on very small screens for better spacing */}
        <div className="hidden sm:block w-32 md:w-40 h-[1px] bg-white/10 relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-yc-yellow origin-left scale-x-0"
          ></div>
        </div>

        {/* Controls - Scaled for Touch */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <button
            onClick={prev}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Side HUD Decor - Hidden on tablet/mobile */}
      <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-8 z-40 pointer-events-none">
        <div className="h-16 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
        <div className="rotate-90 text-white/20 font-syne font-bold text-[8px] uppercase tracking-[0.6em] whitespace-nowrap">
          YC DESIGN — ARCHIVE 2025
        </div>
        <div className="h-16 w-px bg-gradient-to-t from-transparent via-white/15 to-transparent"></div>
      </div>
    </section>
  )
}
