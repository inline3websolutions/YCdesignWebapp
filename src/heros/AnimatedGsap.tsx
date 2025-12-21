'use client'
import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { GearIcon } from '@/components/ui/Illustrations'

gsap.registerPlugin(ScrollTrigger)

type AnimatedProps = Page['hero'] & { className?: string }

export const AnimatedGsapHero: React.FC<AnimatedProps> = (props) => {
  const { richText, tagline, established, media, scrollIndicator, className } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const imgWrapperRef = useRef<HTMLDivElement>(null)
  const gearRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const imgEl = imgWrapperRef.current?.querySelector('img')
      if (imgEl) {
        gsap.to(imgEl, {
          y: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
      if (gearRef.current) {
        gsap.to(gearRef.current, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'linear',
        })
      }
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative h-screen flex flex-col justify-center items-center px-4 pt-20 z-10 overflow-hidden',
        className,
      )}
    >
      <div className="text-center z-10 mix-blend-difference relative">
        {(established || tagline) && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <GearIcon ref={gearRef} className="w-5 h-5 text-yc-yellow" />
            <p className="uppercase tracking-[0.5em] text-xs md:text-sm text-yc-yellow">
              {established}
            </p>
          </div>
        )}
        {richText && (
          <RichText
            data={richText}
            enableGutter={false}
            className="font-display text-[15vw] leading-[0.8] font-bold uppercase"
          />
        )}
        <div className="flex justify-between items-end w-full max-w-4xl mx-auto mt-8 border-t border-white/20 pt-4">
          {tagline && <p className="text-gray-400 text-sm max-w-xs text-left">{tagline}</p>}
          {scrollIndicator && (
            <p className="text-white text-sm font-bold animate-bounce">SCROLL ↓</p>
          )}
        </div>
      </div>
      <div ref={imgWrapperRef} className="absolute inset-0 z-[-1] overflow-hidden">
        {media && typeof media === 'object' && (
          <Media
            resource={media}
            fill
            priority
            imgClassName="w-full h-full object-cover opacity-40 scale-110 origin-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
    </section>
  )
}
