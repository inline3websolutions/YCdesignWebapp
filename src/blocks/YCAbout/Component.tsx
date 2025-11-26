'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

gsap.registerPlugin(ScrollTrigger)

type Props = Extract<Page['layout'][number], { blockType: 'ycAbout' }>

export const YCAboutBlock: React.FC<Props> = (props) => {
  const { eyebrow, heading, highlight, body, primaryLink, image, label } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealContainer = containerRef.current?.querySelector('.reveal-container')
      if (revealContainer) {
        ScrollTrigger.create({
          trigger: revealContainer,
          start: 'top 80%',
          onEnter: () => revealContainer.classList.add('reveal-active'),
        })
      }
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-32 px-6 md:px-12 max-w-8xl mx-auto z-10 relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          {eyebrow && (
            <p className="text-yc-yellow uppercase tracking-[0.3em] text-xs mb-4">{eyebrow}</p>
          )}
          <h2 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8">
            {heading}
            {highlight && (
              <>
                <br />
                <span className="text-yc-yellow">{highlight}</span>
              </>
            )}
            .
          </h2>
          {body && (
            <div className="text-gray-400 text-lg md:text-xl leading-relaxed font-light mb-8">
              <RichText data={body} enableGutter={false} />
            </div>
          )}
          {primaryLink && primaryLink.length > 0 && (
            <CMSLink
              className="inline-block border border-white/30 px-8 py-4 rounded-full hover:bg-yc-yellow hover:text-black hover:border-yc-yellow transition-all duration-300 uppercase text-sm tracking-widest"
              {...primaryLink[0].link}
            >
              {primaryLink[0].link.label}
            </CMSLink>
          )}
        </div>

        {image && typeof image === 'object' && (
          <div className="relative reveal-container">
            <Media
              resource={image}
              imgClassName="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700 reveal-img"
            />
            {label && (
              <div className="absolute -bottom-6 -right-6 text-yc-yellow text-9xl font-display opacity-20 select-none">
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
