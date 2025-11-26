import React from 'react'

import type { Page } from '@/payload-types'

type Props = Extract<Page['layout'][number], { blockType: 'ycMarquee' }>

export const YCMarqueeBlock: React.FC<Props> = (props) => {
  const { items, accent, backgroundColor, tilted } = props

  if (!items || items.length === 0) return null

  const bgClass = backgroundColor === 'dark' ? 'bg-black text-white' : 'bg-yc-yellow text-black'

  return (
    <section
      className={`${bgClass} py-4 overflow-hidden relative z-10 border-y-2 border-black ${
        tilted ? 'rotate-1 scale-105' : ''
      }`}
    >
      <div className="marquee-container">
        {[0, 1].map((row) => (
          <div
            key={row}
            className="marquee-content font-display font-bold text-3xl md:text-5xl uppercase"
            aria-hidden={row === 1}
          >
            {items.map((item, index) => (
              <span key={index} className="flex items-center gap-4">
                <span>{item.text}</span>
                <span className="opacity-60">•</span>
              </span>
            ))}
            {accent && (
              <span className="flex items-center gap-4">
                <span>{accent}</span>
                <span className="opacity-60">•</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
