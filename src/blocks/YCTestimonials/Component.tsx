'use client'

import React, { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import gsap from 'gsap'
import type { Page } from '@/payload-types'

type Props = Extract<Page['layout'][number], { blockType: 'ycTestimonials' }>

export const YCTestimonialsBlock: React.FC<Props> = (props) => {
  const { eyebrow, title, testimonials } = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  if (!testimonials || testimonials.length === 0) return null

  const animateChange = (callback: () => void) => {
    if (!contentRef.current) {
      callback()
      return
    }

    const tl = gsap.timeline()
    tl.to(contentRef.current, { opacity: 0, x: -20, duration: 0.3, ease: 'power2.in' })
      .call(callback)
      .fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
      )
  }

  const next = () => {
    animateChange(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    })
  }

  const prev = () => {
    animateChange(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    })
  }

  return (
    <section className="py-24 bg-zinc-100 dark:bg-zinc-900 relative transition-colors duration-500">
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          {eyebrow && (
            <h2 className="text-yc-yellow font-rubik tracking-widest uppercase text-sm mb-2">
              {eyebrow}
            </h2>
          )}
          <h3 className="text-4xl font-syne font-bold text-zinc-900 dark:text-white transition-colors duration-500">
            {title}
          </h3>
        </div>

        <div className="max-w-4xl mx-auto bg-white/50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-8 md:p-12 relative backdrop-blur-sm transition-colors duration-500 shadow-sm dark:shadow-none">
          <Quote
            size={48}
            className="text-zinc-200 dark:text-zinc-800 absolute top-8 left-8 transform -scale-x-100 transition-colors duration-500"
          />

          <div className="relative min-h-[250px] flex items-center justify-center">
            <div ref={contentRef} className="text-center">
              <p className="text-xl md:text-2xl font-rubik italic text-zinc-700 dark:text-zinc-300 mb-8 leading-relaxed transition-colors duration-500">
                &ldquo;{testimonials[currentIndex]?.text}&rdquo;
              </p>

              <div>
                <h4 className="text-yc-yellow font-syne font-bold text-lg uppercase">
                  {testimonials[currentIndex]?.name}
                </h4>
                {testimonials[currentIndex]?.role && (
                  <p className="text-zinc-500 text-sm font-rubik mt-1">
                    {testimonials[currentIndex]?.role}
                  </p>
                )}
              </div>
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="p-3 border border-zinc-300 dark:border-zinc-700 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-yc-yellow hover:border-yc-yellow transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="p-3 border border-zinc-300 dark:border-zinc-700 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-yc-yellow hover:border-yc-yellow transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
