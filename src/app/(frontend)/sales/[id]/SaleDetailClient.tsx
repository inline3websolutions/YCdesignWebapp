'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, Check, Phone } from 'lucide-react'
import gsap from 'gsap'
import type { SaleItem } from '@/types/yc'
import RichText from '@/components/RichText'

interface SaleDetailClientProps {
  item: SaleItem
}

const SaleDetailClient: React.FC<SaleDetailClientProps> = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const allImages = [item.mainImage, ...item.gallery.filter((img) => img !== item.mainImage)]

  useEffect(() => {
    if (!contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.detail-title', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      })
      gsap.from('.detail-meta', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: 0.2,
        stagger: 0.1,
        ease: 'power2.out',
      })
      gsap.from('.detail-content', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out',
      })
    }, contentRef)

    return () => ctx.revert()
  }, [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const getStatusStyles = (status: SaleItem['status']) => {
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

  return (
    <div ref={contentRef} className="min-h-screen pt-24 pb-12 transition-colors duration-500">
      {/* Back Button */}
      <div className="container mx-auto px-6 mb-8">
        <Link
          href="/sales"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-yc-yellow transition-colors font-rubik"
        >
          <ArrowLeft size={20} />
          <span>Back to Sales</span>
        </Link>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Gallery */}
          <div className="space-y-6">
            {/* Main Image Display */}
            <div className="relative bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <Image
                src={allImages[currentImageIndex].url}
                alt={item.title}
                width={allImages[currentImageIndex].width}
                height={allImages[currentImageIndex].height}
                className="w-full h-auto object-contain" // Changed to object-contain and added w-full h-auto
                priority
                unoptimized
              />
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-yc-yellow text-white hover:text-black rounded-full transition-all"
              >
                <ZoomIn size={20} />
              </button>

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-yc-yellow text-white hover:text-black rounded-full transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-yc-yellow text-white hover:text-black rounded-full transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? 'border-yc-yellow'
                        : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-8">
            {/* Status & Price */}
            <div className="flex items-start justify-between">
              <span
                className={`detail-meta px-4 py-2 text-sm font-syne font-bold uppercase tracking-wider border rounded-sm ${getStatusStyles(item.status)}`}
              >
                {item.status}
              </span>
              <div className="detail-meta text-right">
                <span className="text-4xl font-syne font-bold text-yc-yellow">₹ {item.price}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="detail-title text-4xl md:text-5xl lg:text-6xl font-syne font-bold text-zinc-900 dark:text-white transition-colors duration-500">
              {item.title}
            </h1>

            {/* Specs Grid */}
            <div className="detail-meta grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-y border-zinc-200 dark:border-zinc-800">
              {item.type === 'bike' ? (
                <>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Manufacturer
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.manufacturer}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Year
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.year}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Engine
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.engine}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Mileage
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.mileage}
                    </p>
                  </div>
                  {item.numberOfOwners && (
                    <div>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                        Owners
                      </span>
                      <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                        {item.numberOfOwners}
                      </p>
                    </div>
                  )}
                  {item.registrationDate && (
                    <div>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                        Registration
                      </span>
                      <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                        {new Date(item.registrationDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Manufacturer
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.manufacturer}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Category
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.partCategory}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block">
                      Condition
                    </span>
                    <p className="text-xl font-syne font-bold text-zinc-900 dark:text-white mt-1">
                      {item.condition}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Compatibility for Spares */}
            {item.type === 'spare' && item.compatibility && (
              <div className="detail-content">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-rubik block mb-1">
                  Compatible with
                </span>
                <p className="text-lg font-syne text-zinc-900 dark:text-white">
                  {item.compatibility}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="detail-content">
              <h3 className="text-lg font-syne font-bold text-zinc-900 dark:text-white mb-3">
                {item.type === 'bike' ? 'About This Bike' : 'About This Part'}
              </h3>
              <RichText data={item.description} />
            </div>

            {/* Features (Bikes only usually, but Spares don't have it in types yet) */}
            {item.type === 'bike' && item.features.length > 0 && (
              <div className="detail-content">
                <h3 className="text-lg font-syne font-bold text-zinc-900 dark:text-white mb-4">
                  Features & Modifications
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {item.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-rubik"
                    >
                      <Check size={16} className="text-yc-yellow flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {item.status === 'Available' && (
              <div className="detail-content pt-6">
                <a
                  href={`https://wa.me/919820109654?text=${encodeURIComponent(
                    `Hi YC Design, I am interested in the ${item.title} listed on your website. I would like to know more about it.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-yc-yellow text-black font-syne font-bold uppercase tracking-wider rounded-sm hover:bg-yellow-400 transition-colors"
                >
                  <Phone size={20} />
                  Inquire About This {item.type === 'bike' ? 'Bike' : 'Item'}
                </a>
              </div>
            )}

            {item.status === 'Reserved' && (
              <div className="detail-content pt-6">
                <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-syne font-bold uppercase tracking-wider rounded-sm cursor-not-allowed">
                  Currently Reserved
                </div>
              </div>
            )}

            {item.status === 'Sold' && (
              <div className="detail-content pt-6 text-center">
                <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-syne font-bold uppercase tracking-wider rounded-sm cursor-not-allowed mb-4">
                  Sold
                </div>
                {item.type === 'bike' && (
                  <p className="text-zinc-500 font-rubik text-sm">
                    Like this build?{' '}
                    <Link href="/#contact" className="text-yc-yellow hover:underline">
                      Commission a similar one
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-white hover:text-yc-yellow transition-colors"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-yc-yellow transition-colors"
          >
            <ChevronLeft size={40} />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-[4/3] mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[currentImageIndex].url}
              alt={item.title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-yc-yellow transition-colors"
          >
            <ChevronRight size={40} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(idx)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-yc-yellow w-6' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SaleDetailClient
