'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ChevronDown, X } from 'lucide-react'
import gsap from 'gsap'
import type { Project } from '@/types/yc'

interface PortfolioClientProps {
  projects: Project[]
}

const PortfolioClient: React.FC<PortfolioClientProps> = ({ projects }) => {
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter') as 'Restoration' | 'Modification' | null
  const [activeFilter, setActiveFilter] = useState<'All' | 'Restoration' | 'Modification'>('All')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('all')
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Extract unique years and manufacturers
  const { years, manufacturers } = useMemo(() => {
    const yearsSet = new Set<string>()
    const manufacturersSet = new Set<string>()

    projects.forEach((p) => {
      if (p.year && p.year !== 'undefined' && p.year !== 'null') {
        yearsSet.add(p.year)
      }
      if (p.engine && p.engine.trim() !== '') {
        manufacturersSet.add(p.engine)
      }
    })

    return {
      years: Array.from(yearsSet).sort((a, b) => Number(b) - Number(a)),
      manufacturers: Array.from(manufacturersSet).sort(),
    }
  }, [projects])

  useEffect(() => {
    if (filterParam) {
      setActiveFilter(filterParam)
    }
  }, [filterParam])

  useEffect(() => {
    if (!containerRef.current) return

    // Animate items whenever filter changes
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.portfolio-item',
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [activeFilter, yearFilter, manufacturerFilter])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Don't close if clicking inside a dropdown container
      if (target.closest('.dropdown-container')) return
      setShowYearDropdown(false)
      setShowManufacturerDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeFilter === 'All' || p.category === activeFilter
      const matchesYear = yearFilter === 'all' || (p.year && p.year === yearFilter)
      const matchesManufacturer =
        manufacturerFilter === 'all' || (p.engine && p.engine === manufacturerFilter)
      return matchesCategory && matchesYear && matchesManufacturer
    })
  }, [projects, activeFilter, yearFilter, manufacturerFilter])

  const getProjectLink = (project: Project) => {
    return project.slug ? `/project/${project.slug}` : `/project/${project.id}`
  }

  const clearFilters = () => {
    setActiveFilter('All')
    setYearFilter('all')
    setManufacturerFilter('all')
  }

  const hasActiveFilters =
    activeFilter !== 'All' || yearFilter !== 'all' || manufacturerFilter !== 'all'

  return (
    <div ref={containerRef} className="pt-24 pb-12 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="flex flex-col justify-between items-start lg:justify-between mb-12 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-syne font-bold text-zinc-900 dark:text-white mb-6 transition-colors duration-500">
              WORKSHOP <span className="text-yc-yellow">ARCHIVES</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-rubik max-w-lg text-lg transition-colors duration-500">
              A curated collection of our finest builds. From faithful restorations to radical
              custom fabrications.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            {(['All', 'Restoration', 'Modification'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 border font-syne uppercase text-xs tracking-wider transition-all duration-300 rounded-sm ${
                  activeFilter === f
                    ? 'bg-yc-yellow border-yc-yellow text-black font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          {/* Year Filter Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowYearDropdown(!showYearDropdown)
                setShowManufacturerDropdown(false)
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-sm font-rubik text-sm transition-all duration-300 ${
                yearFilter !== 'all'
                  ? 'border-yc-yellow bg-yc-yellow/10 text-yc-yellow'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 hover:border-zinc-500'
              }`}
            >
              <span>Year: {yearFilter === 'all' ? 'All' : yearFilter}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showYearDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showYearDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-sm shadow-lg z-50 max-h-60 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setYearFilter('all')
                    setShowYearDropdown(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm font-rubik hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                    yearFilter === 'all'
                      ? 'text-yc-yellow font-bold'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  All Years
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setYearFilter(year)
                      setShowYearDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-rubik hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                      yearFilter === year
                        ? 'text-yc-yellow font-bold'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manufacturer Filter Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowManufacturerDropdown(!showManufacturerDropdown)
                setShowYearDropdown(false)
              }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-sm font-rubik text-sm transition-all duration-300 ${
                manufacturerFilter !== 'all'
                  ? 'border-yc-yellow bg-yc-yellow/10 text-yc-yellow'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 hover:border-zinc-500'
              }`}
            >
              <span>Make: {manufacturerFilter === 'all' ? 'All' : manufacturerFilter}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showManufacturerDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {showManufacturerDropdown && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-sm shadow-lg z-50 max-h-60 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setManufacturerFilter('all')
                    setShowManufacturerDropdown(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm font-rubik hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                    manufacturerFilter === 'all'
                      ? 'text-yc-yellow font-bold'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  All Makes
                </button>
                {manufacturers.map((manufacturer) => (
                  <button
                    key={manufacturer}
                    onClick={() => {
                      setManufacturerFilter(manufacturer)
                      setShowManufacturerDropdown(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-rubik hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                      manufacturerFilter === manufacturer
                        ? 'text-yc-yellow font-bold'
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {manufacturer}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm font-rubik text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={14} />
              Clear filters
            </button>
          )}

          {/* Results Count */}
          <span className="text-sm font-rubik text-zinc-500 ml-auto">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {/* Responsive Grid: 1 Col Mobile -> 2 Col Tablet -> 3 Col Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
          {filteredProjects.map((project) => (
            <article key={project.id} className="portfolio-item group opacity-0">
              <Link href={getProjectLink(project)} className="block">
                <div className="relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 aspect-[4/3] mb-5 border border-zinc-200 dark:border-zinc-800 group-hover:border-yc-yellow/50 transition-all duration-500 rounded-sm">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all z-10" />
                  <Image
                    src={project.image.url}
                    alt={project.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[0.3] group-hover:grayscale-0"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-8 h-8 flex items-center justify-center bg-yc-yellow rounded-full shadow-lg text-black">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-yc-yellow uppercase tracking-widest border border-yc-yellow/20 px-2 py-1 rounded-sm">
                      {project.category}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-600 font-rubik text-xs uppercase tracking-widest">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-syne font-bold text-zinc-900 dark:text-white group-hover:text-yc-yellow transition-colors mt-2">
                    {project.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-500 text-sm font-rubik mt-1 line-clamp-2">
                    {project.descriptionSummary.substring(0, 100)}...
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 font-rubik text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioClient
