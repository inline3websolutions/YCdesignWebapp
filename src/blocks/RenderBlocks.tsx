import React, { Fragment, Suspense, lazy, ComponentType } from 'react'

import type { Page } from '@/payload-types'

// Minimal loading placeholder for blocks
const BlockLoader = () => <div className="w-full h-32 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />

// Lazy load ALL blocks - they'll only be loaded when actually used on a page
// This prevents loading all 15 blocks + GSAP instances at startup
const blockComponents: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
  archive: lazy(() =>
    import('@/blocks/ArchiveBlock/Component').then((m) => ({ default: m.ArchiveBlock })),
  ),
  content: lazy(() =>
    import('@/blocks/Content/Component').then((m) => ({ default: m.ContentBlock })),
  ),
  cta: lazy(() =>
    import('@/blocks/CallToAction/Component').then((m) => ({ default: m.CallToActionBlock })),
  ),
  formBlock: lazy(() => import('@/blocks/Form/Component').then((m) => ({ default: m.FormBlock }))),
  mediaBlock: lazy(() =>
    import('@/blocks/MediaBlock/Component').then((m) => ({ default: m.MediaBlock })),
  ),
  ycMarquee: lazy(() =>
    import('@/blocks/YCMarquee/Component').then((m) => ({ default: m.YCMarqueeBlock })),
  ),
  ycAbout: lazy(() =>
    import('@/blocks/YCAbout/Component').then((m) => ({ default: m.YCAboutBlock })),
  ),
  ycServices: lazy(() =>
    import('@/blocks/YCServices/Component').then((m) => ({ default: m.YCServicesBlock })),
  ),
  ycRestoredGallery: lazy(() =>
    import('@/blocks/YCRestoredGallery/Component').then((m) => ({
      default: m.YCRestoredGalleryBlock,
    })),
  ),
  ycCustomFeature: lazy(() =>
    import('@/blocks/YCCustomFeature/Component').then((m) => ({ default: m.YCCustomFeatureBlock })),
  ),
  ycHero: lazy(() => import('@/blocks/YCHero/Component').then((m) => ({ default: m.YCHeroBlock }))),
  ycHeroSlider: lazy(() =>
    import('@/blocks/YCHeroSlider/Component').then((m) => ({ default: m.YCHeroSliderBlock })),
  ),
  ycPortfolioGrid: lazy(() =>
    import('@/blocks/YCPortfolioGrid/Component').then((m) => ({ default: m.YCPortfolioGridBlock })),
  ),
  ycTestimonials: lazy(() =>
    import('@/blocks/YCTestimonials/Component').then((m) => ({ default: m.YCTestimonialsBlock })),
  ),
  ycContact: lazy(() =>
    import('@/blocks/YCContact/Component').then((m) => ({ default: m.YCContactBlock })),
  ),
  ycInstagramGrid: lazy(() =>
    import('@/blocks/YCInstagramGrid/Component').then((m) => ({ default: m.YCInstagramGridBlock })),
  ),
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
                <Suspense key={index} fallback={<BlockLoader />}>
                  <Block {...block} disableInnerContainer />
                </Suspense>
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
