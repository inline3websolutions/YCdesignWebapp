'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

gsap.registerPlugin(ScrollTrigger)

type Props = Extract<Page['layout'][number], { blockType: 'ycCustomFeature' }>

export const YCCustomFeatureBlock: React.FC<Props> = (props) => {
  const { sectionTitle, bigFeature, sideImage, ctaTile } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards
      gsap.fromTo(
        '.feature-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
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

  return (
    <section
      ref={containerRef}
      className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900 transition-colors duration-500"
    >
      <div className="container mx-auto">
        {sectionTitle && (
          <div className="mb-16 text-right relative">
            <h2 className="font-syne text-5xl md:text-7xl text-zinc-200 dark:text-white/5 uppercase font-black leading-none absolute right-0 -top-10 select-none transition-colors duration-500">
              {sectionTitle}
            </h2>
            <h3 className="font-syne text-3xl md:text-4xl text-zinc-900 dark:text-white relative z-10 transition-colors duration-500">
              MODIFIED <span className="text-yc-yellow italic">Beasts</span>
            </h3>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Big Feature */}
          <div className="feature-card md:col-span-8 relative group overflow-hidden rounded-lg opacity-0 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
            {bigFeature?.image && typeof bigFeature.image === 'object' && (
              <div className="relative w-full h-[420px] md:h-[640px]">
                <Media
                  resource={bigFeature.image}
                  fill
                  imgClassName="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            )}
            <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-black/80 backdrop-blur p-6 rounded-lg max-w-xs shadow-lg transition-colors duration-500">
              {bigFeature?.title && (
                <h3 className="text-2xl font-syne font-bold text-zinc-900 dark:text-white transition-colors duration-500">
                  {bigFeature.title}
                </h3>
              )}
              {bigFeature?.subtitle && (
                <p className="text-yc-yellow text-sm uppercase tracking-[0.2em] mt-2 font-rubik">
                  {bigFeature.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Side Column */}
          <div className="md:col-span-4 flex flex-col gap-8 mt-10 md:mt-0">
            {sideImage && sideImage.image && typeof sideImage.image === 'object' && (
              <div className="feature-card relative group overflow-hidden rounded-lg opacity-0 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                <div className="relative w-full h-[260px] md:h-[330px]">
                  <Media
                    resource={sideImage.image}
                    fill
                    imgClassName="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {sideImage.title && (
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-xl font-syne font-bold text-white">{sideImage.title}</h3>
                  </div>
                )}
              </div>
            )}

            {ctaTile && (ctaTile.title || (ctaTile.link && ctaTile.link.length)) && (
              <div className="feature-card relative overflow-hidden bg-yc-yellow p-8 flex flex-col justify-center h-full rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-all duration-500 opacity-0 group">
                {ctaTile.title && (
                  <h3 className="text-2xl md:text-3xl font-syne text-black group-hover:text-zinc-900 dark:group-hover:text-white font-bold leading-tight mb-4 transition-colors duration-500">
                    {ctaTile.title}
                  </h3>
                )}
                {ctaTile.link && ctaTile.link.length > 0 && (
                  <CMSLink
                    appearance="inline"
                    className="text-black group-hover:text-yc-yellow underline underline-offset-4 font-bold uppercase text-xs tracking-[0.2em] font-rubik transition-colors duration-500"
                    {...ctaTile.link[0].link}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
