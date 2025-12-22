'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/types/yc'

gsap.registerPlugin(ScrollTrigger)

interface PortfolioGridProps {
  title: string
  subtitle: string
  projects: Project[]
  filter: 'Restoration' | 'Modification'
  viewAllLink: string
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  title,
  subtitle,
  projects,
  filter,
  viewAllLink,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Slice to 3 items for the homepage teaser
  const filteredProjects = projects.filter((p) => p.category === filter).slice(0, 3)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        '.grid-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        },
      )

      // Desktop Grid Stagger
      ScrollTrigger.batch('.desktop-card', {
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
          })
        },
        start: 'top 85%',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getProjectLink = (project: Project) => {
    return project.slug ? `/project/${project.slug}` : `/project/${project.id}`
  }

  return (
    <section
      ref={containerRef}
      id={filter.toLowerCase()}
      className="py-24 md:py-32 bg-zinc-50 dark:bg-[#09090B] border-t border-zinc-200 dark:border-white/5 relative overflow-hidden transition-colors duration-500"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yc-yellow/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="grid-header flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-yc-yellow"></div>
              <h2 className="text-yc-yellow font-rubik tracking-widest uppercase text-xs font-bold">
                {subtitle}
              </h2>
            </div>
            <h3 className="text-4xl md:text-6xl font-syne font-bold text-zinc-900 dark:text-white uppercase leading-none transition-colors duration-500">
              {title.split(' ')[0]}{' '}
              <span className="text-zinc-400 dark:text-zinc-600">
                {title.split(' ').slice(1).join(' ')}
              </span>
            </h3>
          </div>
          <Link
            href={viewAllLink}
            className="hidden md:flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-syne uppercase tracking-wider text-sm group"
          >
            Explore Archive
            <span className="bg-zinc-200 dark:bg-zinc-800 p-2 rounded-full group-hover:bg-yc-yellow group-hover:text-black transition-all">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* --- MOBILE: Horizontal Snap Carousel (Visible up to MD) --- */}
        <div
          ref={scrollContainerRef}
          className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 -mx-6 px-6 pb-12 scrollbar-hide"
        >
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={getProjectLink(project)}
              className="flex-shrink-0 w-[85vw] sm:w-[400px] snap-center group relative aspect-[3/4] rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
            >
              <Image
                src={project.image.url}
                alt={project.title}
                fill
                className="object-cover opacity-90 transition-opacity duration-500"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-[2px] bg-yc-yellow text-black text-[10px] font-bold uppercase tracking-wider rounded-sm">
                    {project.year}
                  </span>
                  <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-500 rounded-full"></span>
                  <span className="text-zinc-300 dark:text-zinc-400 text-[10px] font-rubik uppercase tracking-wider">
                    {project.engine}
                  </span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-syne font-bold text-white leading-tight">
                  {project.title}
                </h4>
              </div>
            </Link>
          ))}

          {/* Mobile 'View All' Card */}
          <Link
            href={viewAllLink}
            className="flex-shrink-0 w-[40vw] sm:w-[200px] snap-center flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors aspect-[3/4]"
          >
            <div className="w-14 h-14 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-yc-yellow mb-4">
              <ArrowRight size={24} />
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 font-syne uppercase text-sm tracking-wider">
              View All
            </span>
          </Link>
        </div>

        {/* --- DESKTOP: Interactive Grid (Visible MD and up) --- */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={getProjectLink(project)}
              className="desktop-card group relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 opacity-0 translate-y-12 hover:border-yc-yellow/30 transition-colors duration-500 shadow-sm dark:shadow-none"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={project.image.url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                  unoptimized
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#09090B] via-[#09090B]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-30 flex flex-col justify-end h-full">
                {/* Floating Icon */}
                <div className="absolute top-6 right-6 translate-x-12 -translate-y-12 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="w-10 h-10 bg-yc-yellow flex items-center justify-center text-black font-bold rounded-full shadow-lg">
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <span className="text-yc-yellow font-rubik text-[10px] font-bold uppercase tracking-widest border border-yc-yellow/30 px-2 py-[2px] rounded-sm backdrop-blur-md">
                      {project.category}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-400 font-rubik text-[10px] uppercase tracking-widest">
                      {project.clientLocation}
                    </span>
                  </div>

                  <h4 className="text-3xl lg:text-4xl font-syne font-bold text-white leading-[0.95] mb-2 group-hover:text-yc-yellow transition-colors duration-300">
                    {project.title}
                  </h4>

                  {/* Expandable Details */}
                  <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                    <div className="pt-4 mt-2 border-t border-white/20 flex justify-between text-zinc-300 font-rubik text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span>{project.year}</span>
                      <span>{project.engine}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Footer */}
        <div className="md:hidden mt-6 text-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-500 text-xs uppercase tracking-widest font-rubik"
          >
            View All {filter} Projects <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PortfolioGrid
