import React from 'react'

import type { Page } from '@/payload-types'

import { cn } from '@/utilities/ui'

type Props = Extract<Page['layout'][number], { blockType: 'ycRestoredGallery' }>

export const YCRestoredGalleryBlock: React.FC<Props> = (props) => {
  const { eyebrow, title, highlight, cards } = props

  if (!cards || cards.length === 0) return null

  return (
    <section className="py-24 bg-black">
      <div className="px-6 md:px-12 mb-12 flex items-end justify-between max-w-6xl mx-auto">
        <div>
          {eyebrow && (
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">{eyebrow}</p>
          )}
          <h2 className="font-display text-3xl md:text-4xl text-white">
            {title} {highlight && <span className="text-yc-yellow italic">{highlight}</span>}
          </h2>
        </div>
        <div className="h-px bg-white/20 w-1/3 hidden md:block" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 px-6 md:px-12 overflow-x-auto pb-8 snap-x">
        {cards.map((card, index) => {
          const { image, title: cardTitle, tag } = card

          return (
            <article key={index} className={cn('min-w-[85vw] md:min-w-[40vw] snap-center group')}>
              <div className="overflow-hidden relative h-[60vh] rounded-lg">
                {image && typeof image === 'object' && image.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={image.alt || ''}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src={image.url}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-yc-yellow border border-yc-yellow rounded-full px-6 py-2 uppercase text-xs tracking-[0.2em] bg-black/50 backdrop-blur-md">
                    View Project
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center border-t border-white/20 pt-4">
                <h3 className="text-2xl font-display text-white">{cardTitle}</h3>
                {tag && <span className="text-xs text-gray-400 uppercase">{tag}</span>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
