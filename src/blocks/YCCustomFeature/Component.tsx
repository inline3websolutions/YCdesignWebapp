import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type Props = Extract<Page['layout'][number], { blockType: 'ycCustomFeature' }>

export const YCCustomFeatureBlock: React.FC<Props> = (props) => {
  const { sectionTitle, bigFeature, sideImage, ctaTile } = props

  return (
    <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      {sectionTitle && (
        <div className="mb-16 text-right relative">
          <h2 className="font-display text-5xl md:text-7xl text-white opacity-10 uppercase font-black leading-none absolute right-0 -top-10 select-none">
            {sectionTitle}
          </h2>
          <h3 className="font-display text-3xl md:text-4xl text-white relative z-10">
            MODIFIED <span className="text-yc-yellow italic">Beasts</span>
          </h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Big Feature */}
        <div className="md:col-span-8 relative group overflow-hidden rounded-lg">
          {bigFeature?.image && typeof bigFeature.image === 'object' && bigFeature.image.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={bigFeature.image.alt || ''}
              className="w-full h-[420px] md:h-[640px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              src={bigFeature.image.url}
            />
          )}
          <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur p-6 rounded-lg max-w-xs">
            {bigFeature?.title && (
              <h3 className="text-2xl font-display text-white">{bigFeature.title}</h3>
            )}
            {bigFeature?.subtitle && (
              <p className="text-yc-yellow text-sm uppercase tracking-[0.2em] mt-2">
                {bigFeature.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Side Column */}
        <div className="md:col-span-4 flex flex-col gap-8 mt-10 md:mt-0">
          {sideImage &&
            sideImage.image &&
            typeof sideImage.image === 'object' &&
            sideImage.image.url && (
              <div className="relative group overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={sideImage.image.alt || ''}
                  className="w-full h-[260px] md:h-[330px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  src={sideImage.image.url}
                />
                {sideImage.title && (
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-xl font-display text-white">{sideImage.title}</h3>
                  </div>
                )}
              </div>
            )}

          {ctaTile && (ctaTile.title || (ctaTile.link && ctaTile.link.links?.length)) && (
            <div className="relative overflow-hidden bg-yc-yellow p-8 flex flex-col justify-center h-full rounded-lg hover:bg-white transition-colors duration-500">
              {ctaTile.title && (
                <h3 className="text-2xl md:text-3xl font-display text-black font-bold leading-tight mb-4">
                  {ctaTile.title}
                </h3>
              )}
              {ctaTile.link && ctaTile.link.links && ctaTile.link.links.length > 0 && (
                <CMSLink
                  appearance="inline"
                  className="text-black underline underline-offset-4 font-bold uppercase text-xs tracking-[0.2em]"
                  {...ctaTile.link.links[0].link}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
