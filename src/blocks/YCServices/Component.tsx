import React from 'react'

import type { Page } from '@/payload-types'

import { cn } from '@/utilities/ui'

type Props = Extract<Page['layout'][number], { blockType: 'ycServices' }>

export const YCServicesBlock: React.FC<Props> = (props) => {
  const { eyebrow, items } = props

  if (!items || items.length === 0) return null

  return (
    <section className="py-20 border-t border-white/10 bg-yc-dark">
      <div className="px-6 md:px-12 max-w-6xl mx-auto">
        {eyebrow && (
          <p className="text-yc-yellow uppercase tracking-[0.3em] mb-10 text-xs md:text-sm">
            {eyebrow}
          </p>
        )}

        <div className="divide-y divide-white/10">
          {items.map((item, index) => {
            const { title, description, image } = item

            return (
              <article
                key={index}
                className={cn(
                  'group relative py-10 cursor-default flex flex-col md:flex-row md:items-center md:justify-between gap-4',
                )}
              >
                <h3 className="font-display text-3xl md:text-5xl text-outline group-hover:translate-x-2 transition-transform duration-500">
                  {title}
                </h3>
                {description && (
                  <p className="text-gray-400 text-sm md:text-right max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {description}
                  </p>
                )}

                {image && typeof image === 'object' && image.url && (
                  // Static hover preview; a future enhancement can make this follow the cursor
                  <div className="hidden md:block pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={image.alt || ''}
                      className="w-[380px] h-[260px] object-cover shadow-2xl rounded-lg"
                      src={image.url}
                    />
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
