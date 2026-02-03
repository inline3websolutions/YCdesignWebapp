import React, { Suspense, lazy, ComponentType } from 'react'

import type { Page } from '@/payload-types'

// Lazy load hero components - only the one actually used will be loaded
const HighImpactHero = lazy(() =>
  import('@/heros/HighImpact').then((m) => ({ default: m.HighImpactHero })),
)
const LowImpactHero = lazy(() =>
  import('@/heros/LowImpact').then((m) => ({ default: m.LowImpactHero })),
)
const MediumImpactHero = lazy(() =>
  import('@/heros/MediumImpact').then((m) => ({ default: m.MediumImpactHero })),
)
const AnimatedGsapHero = lazy(() =>
  import('@/heros/AnimatedGsap').then((m) => ({ default: m.AnimatedGsapHero })),
)

const heroes: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  animatedGsap: AnimatedGsapHero,
}

// Minimal hero loading placeholder
const HeroLoader = () => (
  <div className="w-full h-[50vh] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
)

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return (
    <Suspense fallback={<HeroLoader />}>
      <HeroToRender {...props} />
    </Suspense>
  )
}
