'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Hero, About, PortfolioGrid, Testimonials, Contact } from '@/components/yc/sections'
import type { Project, Testimonial } from '@/types/yc'

interface HomeClientProps {
  projects: Project[]
  testimonials: Testimonial[]
}

const HomeClient: React.FC<HomeClientProps> = ({ projects, testimonials }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.to(containerRef.current, { opacity: 1, duration: 0.5 })
    }
  }, [])

  return (
    <div ref={containerRef} className="opacity-0">
      <Hero />
      <About />
      <PortfolioGrid
        title="RETRO SOUL REBORN"
        subtitle="Recent Restorations"
        projects={projects}
        filter="Restoration"
        viewAllLink="/portfolio?filter=Restoration"
      />
      <PortfolioGrid
        title="CUSTOM PERFORMANCE"
        subtitle="Recent Modifications"
        projects={projects}
        filter="Modification"
        viewAllLink="/portfolio?filter=Modification"
      />
      <Testimonials testimonials={testimonials} />
      <Contact />
    </div>
  )
}

export default HomeClient
