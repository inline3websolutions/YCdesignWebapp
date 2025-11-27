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
  const { eyebrow, heading, highlight, body, primaryLink, image, cornerLabel, stats } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image Reveal
      gsap.fromTo(
        imageRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      // Text Reveal
      gsap.fromTo(
        textRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      // Counter Animation
      const counters = containerRef.current?.querySelectorAll('.stat-counter')
      counters?.forEach((counter) => {
        const value = counter.getAttribute('data-value')
        if (value) {
          gsap.from(counter, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: counter,
              start: 'top 90%',
            },
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-24 bg-white dark:bg-yc-metal relative overflow-hidden transition-colors duration-500"
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-brushed-metal opacity-5"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="aspect-[4/5] md:aspect-square relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-2 transition-colors duration-500">
              {image && typeof image === 'object' && (
                <Media
                  key={image.id}
                  resource={image}
                  fill
                  imgClassName="object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                />
              )}
              {image && typeof image === 'string' && (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  Image not loaded (ID: {image})
                </div>
              )}
              {cornerLabel && (
                <div className="absolute bottom-6 right-6 bg-yc-yellow text-black px-4 py-2 font-syne font-bold text-xl">
                  {cornerLabel}
                </div>
              )}
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-yc-yellow/50"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-yc-yellow/50"></div>
          </div>

          {/* Text Side */}
          <div ref={textRef} className="opacity-0">
            {eyebrow && (
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] bg-yc-yellow"></div>
                <span className="text-yc-yellow font-rubik uppercase tracking-widest text-sm">
                  {eyebrow}
                </span>
              </div>
            )}

            <h2 className="text-4xl md:text-5xl font-syne font-bold text-zinc-900 dark:text-white mb-8 transition-colors duration-500">
              {heading}
              {highlight && (
                <>
                  <br />
                  <span className="text-zinc-500">{highlight}</span>
                </>
              )}
            </h2>

            {body && (
              <div className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 font-rubik leading-relaxed transition-colors duration-500 prose prose-zinc dark:prose-invert">
                <RichText data={body} enableGutter={false} />
              </div>
            )}

            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-8 mb-10">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <h4 className="text-3xl font-syne font-bold text-zinc-900 dark:text-white mb-1 transition-colors duration-500">
                      <span className="stat-counter" data-value={stat.value}>
                        {stat.value}
                      </span>
                      {stat.suffix}
                    </h4>
                    <p className="text-zinc-500 text-sm uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {primaryLink && primaryLink.length > 0 && (
              <CMSLink
                className="text-zinc-900 dark:text-white border-b border-yc-yellow pb-1 hover:text-yc-yellow transition-colors font-syne uppercase tracking-wider"
                {...primaryLink[0].link}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
