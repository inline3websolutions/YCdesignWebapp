'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { Page, RestoredMoto, Media as MediaType, Manufacturer } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(ScrollTrigger)

type Props = Extract<Page['layout'][number], { blockType: 'ycRestoredGallery' }>

// Helper function to get manufacturer name from relationship
function getManufacturerName(
  manufacturer: string | number | Manufacturer | null | undefined,
): string {
  if (!manufacturer) return ''
  if (typeof manufacturer === 'object' && 'name' in manufacturer) {
    return manufacturer.name || ''
  }
  return ''
}

export const YCRestoredGalleryBlock: React.FC<Props> = (props) => {
  const { eyebrow, title, highlight, motorcycles } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-card',
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
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

  if (!motorcycles || motorcycles.length === 0) return null

  return (
    <section
      ref={containerRef}
      className="py-24 bg-zinc-100 dark:bg-black transition-colors duration-500"
    >
      <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
        <div>
          {eyebrow && (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[2px] bg-yc-yellow"></div>
              <p className="text-yc-yellow font-rubik uppercase tracking-widest text-sm">
                {eyebrow}
              </p>
            </div>
          )}
          <h2 className="font-syne text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white transition-colors duration-500">
            {title} {highlight && <span className="text-yc-yellow italic">{highlight}</span>}
          </h2>
        </div>
        <div className="h-px bg-zinc-300 dark:bg-white/20 w-1/3 hidden md:block transition-colors duration-500" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
        {motorcycles.map((moto, index) => {
          // Handle both populated and non-populated relationships
          if (typeof moto === 'string') return null

          const motorcycle = moto as RestoredMoto
          const heroImage = motorcycle.heroImage as MediaType | undefined
          const manufacturerName = getManufacturerName(motorcycle.manufacturer)
          const tag =
            manufacturerName && motorcycle.year
              ? `${manufacturerName} • ${motorcycle.year}`
              : manufacturerName || (motorcycle.year ? String(motorcycle.year) : undefined)

          return (
            <Link
              key={motorcycle.id || index}
              href={`/project/${motorcycle.slug}`}
              className={cn(
                'gallery-card min-w-[85vw] md:min-w-[40vw] snap-center group block opacity-0',
              )}
            >
              <article>
                <div className="overflow-hidden relative h-[60vh] rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                  {heroImage && (
                    <Media
                      resource={heroImage}
                      fill
                      imgClassName="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-yc-yellow border border-yc-yellow rounded-full px-6 py-2 uppercase text-xs tracking-[0.2em] bg-black/50 backdrop-blur-md font-rubik">
                      View Project
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-zinc-200 dark:border-white/20 pt-4 transition-colors duration-500">
                  <h3 className="text-2xl font-syne font-bold text-zinc-900 dark:text-white transition-colors duration-500">
                    {motorcycle.name}
                  </h3>
                  {tag && (
                    <span className="text-xs text-zinc-500 dark:text-gray-400 uppercase font-rubik transition-colors duration-500">
                      {tag}
                    </span>
                  )}
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
