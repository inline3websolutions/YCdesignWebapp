import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { YCMarqueeBlock } from '@/blocks/YCMarquee/Component'
import { YCAboutBlock } from '@/blocks/YCAbout/Component'
import { YCServicesBlock } from '@/blocks/YCServices/Component'
import { YCRestoredGalleryBlock } from '@/blocks/YCRestoredGallery/Component'
import { YCCustomFeatureBlock } from '@/blocks/YCCustomFeature/Component'
import { YCHeroBlock } from '@/blocks/YCHero/Component'
import { YCPortfolioGridBlock } from '@/blocks/YCPortfolioGrid/Component'
import { YCTestimonialsBlock } from '@/blocks/YCTestimonials/Component'
import { YCContactBlock } from '@/blocks/YCContact/Component'
import { YCInstagramGridBlock } from '@/blocks/YCInstagramGrid/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  ycMarquee: YCMarqueeBlock,
  ycAbout: YCAboutBlock,
  ycServices: YCServicesBlock,
  ycRestoredGallery: YCRestoredGalleryBlock,
  ycCustomFeature: YCCustomFeatureBlock,
  ycHero: YCHeroBlock,
  ycPortfolioGrid: YCPortfolioGridBlock,
  ycTestimonials: YCTestimonialsBlock,
  ycContact: YCContactBlock,
  ycInstagramGrid: YCInstagramGridBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} key={index} disableInnerContainer />
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
