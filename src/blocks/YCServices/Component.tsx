'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(ScrollTrigger)

type Props = Extract<Page['layout'][number], { blockType: 'ycServices' }>

export const YCServicesBlock: React.FC<Props> = (props) => {
  const { eyebrow, items } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each service item
      gsap.fromTo(
        '.service-item',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (!items || items.length === 0) return null

  return (
    <section
      ref={containerRef}
      className="py-24 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-yc-dark transition-colors duration-500"
    >
      <div className="container mx-auto px-6">
        {eyebrow && (
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-[2px] bg-yc-yellow"></div>
            <p className="text-yc-yellow font-rubik uppercase tracking-widest text-sm">{eyebrow}</p>
          </div>
        )}

        <div className="divide-y divide-zinc-200 dark:divide-white/10 transition-colors duration-500">
          {items.map((item, index) => {
            const { title, description, image } = item

            return (
              <article
                key={index}
                className={cn(
                  'service-item group relative py-8 md:py-10 cursor-default flex flex-col md:flex-row md:items-center md:justify-between gap-4 opacity-0',
                )}
              >
                <div className="flex items-center gap-6">
                  <span className="text-yc-yellow font-rubik text-sm font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-syne text-2xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white group-hover:text-yc-yellow group-hover:translate-x-2 transition-all duration-500">
                    {title}
                  </h3>
                </div>

                {description && (
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-right max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:ml-auto">
                    {description}
                  </p>
                )}

                {image && typeof image === 'object' && (
                  <div className="hidden lg:block pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="relative w-[380px] h-[260px] shadow-2xl rounded-lg overflow-hidden">
                      <Media resource={image} fill imgClassName="object-cover" />
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
