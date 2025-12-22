'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Search } from 'lucide-react'
import gsap from 'gsap'
import type { SaleBike } from '@/types/yc'

interface SalesClientProps {
  bikes: SaleBike[]
}

const SalesClient: React.FC<SalesClientProps> = ({ bikes }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Sold' | 'Reserved'>('All')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredBikes = bikes.filter((bike) => {
    const matchesSearch = bike.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || bike.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sale-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [statusFilter, searchTerm])

  const getStatusStyles = (status: SaleBike['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Sold':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Reserved':
        return 'bg-yc-yellow/20 text-yc-yellow border-yc-yellow/30'
      default:
        return ''
    }
  }

  const getBikeLink = (bike: SaleBike) => {
    return bike.slug ? `/sales/${bike.slug}` : `/sales/${bike.id}`
  }

  return (
    <div ref={containerRef} className="pt-24 pb-12 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-syne font-bold text-zinc-900 dark:text-white mb-6 transition-colors duration-500">
              BIKES FOR <span className="text-yc-yellow">SALE</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-rubik max-w-lg text-lg transition-colors duration-500">
              One-of-a-kind builds ready for new owners. Each machine tells a story of craftsmanship
              and passion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Search bikes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full sm:w-64 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm font-rubik text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-yc-yellow transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['All', 'Available', 'Reserved', 'Sold'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 border font-syne uppercase text-xs tracking-wider transition-all duration-300 rounded-sm ${
                    statusFilter === status
                      ? 'bg-yc-yellow border-yc-yellow text-black font-bold'
                      : 'border-zinc-300 dark:border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900/50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBikes.map((bike) => (
            <article key={bike.id} className="sale-item group opacity-0">
              <Link href={getBikeLink(bike)} className="block">
                <div className="relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 aspect-[4/3] mb-5 border border-zinc-200 dark:border-zinc-800 group-hover:border-yc-yellow/50 transition-all duration-500 rounded-sm">
                  <Image
                    src={bike.mainImage.url}
                    alt={bike.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />

                  {/* Status Badge */}
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 text-xs font-syne font-bold uppercase tracking-wider border rounded-sm ${getStatusStyles(bike.status)}`}
                  >
                    {bike.status}
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-8 h-8 flex items-center justify-center bg-yc-yellow rounded-full shadow-lg text-black">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-2xl font-syne font-bold text-white">₹ {bike.price}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-syne font-bold text-zinc-900 dark:text-white group-hover:text-yc-yellow transition-colors">
                    {bike.title}
                  </h3>
                  <div className="flex gap-4 text-xs text-zinc-500 font-rubik uppercase tracking-wider">
                    <span>{bike.year}</span>
                    <span>•</span>
                    <span>{bike.engine}</span>
                    <span>•</span>
                    <span>{bike.mileage}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-500 text-sm font-rubik mt-1 line-clamp-2">
                    {bike.descriptionSummary.substring(0, 120)}...
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filteredBikes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 font-rubik text-lg">
              No bikes found matching your criteria.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center py-12 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-3xl font-syne font-bold text-zinc-900 dark:text-white mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-rubik mb-6 max-w-lg mx-auto">
            We can build your dream bike from scratch. Tell us your vision and we&apos;ll make it
            happen.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yc-yellow text-black font-syne font-bold uppercase tracking-wider rounded-sm hover:bg-yellow-400 transition-colors"
          >
            Commission a Build
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SalesClient
