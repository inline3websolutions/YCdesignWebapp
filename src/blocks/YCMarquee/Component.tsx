import React from 'react'

import type { Page } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = Extract<Page['layout'][number], { blockType: 'ycMarquee' }>

export const YCMarqueeBlock: React.FC<Props> = (props) => {
  const { items, accent, backgroundColor, tilted } = props

  if (!items || items.length === 0) return null

  const bgClass =
    backgroundColor === 'dark' ? 'bg-zinc-900 dark:bg-black text-white' : 'bg-yc-yellow text-black'

  const borderClass =
    backgroundColor === 'dark' ? 'border-zinc-800 dark:border-zinc-700' : 'border-black'

  return (
    <section
      className={cn(
        bgClass,
        'py-4 overflow-hidden relative z-10 border-y-2 transition-colors duration-500',
        borderClass,
        tilted && 'rotate-1 scale-105',
      )}
    >
      <div className="marquee-container">
        {[0, 1].map((row) => (
          <div
            key={row}
            className="marquee-content font-syne font-bold text-3xl md:text-5xl uppercase tracking-tight"
            aria-hidden={row === 1}
          >
            {items.map((item, index) => (
              <span key={index} className="flex items-center gap-6">
                <span>{item.text}</span>
                <span className="opacity-40">✦</span>
              </span>
            ))}
            {accent && (
              <span className="flex items-center gap-6">
                <span className="italic">{accent}</span>
                <span className="opacity-40">✦</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
