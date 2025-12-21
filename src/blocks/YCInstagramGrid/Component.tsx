'use client'

import React, { useEffect, useRef } from 'react'
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'

gsap.registerPlugin(ScrollTrigger)

type Props = Extract<Page['layout'][number], { blockType: 'ycInstagramGrid' }>

export const YCInstagramGridBlock: React.FC<Props> = (props) => {
  const { instagramPosts } = props
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        '.ig-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        },
      )

      // Grid Items Animation
      gsap.fromTo(
        '.ig-item',
        { opacity: 0, scale: 0.8, y: 40, rotationY: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.ig-grid',
            start: 'top 75%',
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors duration-500"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-mesh-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yc-yellow/20 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="ig-header flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yc-yellow to-yellow-600 flex items-center justify-center text-black">
                <Instagram size={24} />
              </div>
              <h2 className="text-yc-yellow font-rubik tracking-[0.3em] uppercase text-sm font-bold">
                Process Log
              </h2>
            </div>
            <h3 className="text-4xl md:text-6xl font-syne font-bold text-zinc-900 dark:text-white uppercase leading-none">
              Digital <span className="text-zinc-500">Garage.</span>
            </h3>
            <p className="text-zinc-500 font-rubik mt-4 tracking-widest text-xs uppercase">
              Follow us @yogichhabria_ycdesign for daily workshop updates
            </p>
          </div>

          <a
            href="https://www.instagram.com/yogichhabria_ycdesign/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full hover:border-yc-yellow transition-all duration-500"
          >
            <span className="text-zinc-900 dark:text-white font-syne font-bold uppercase tracking-widest text-xs group-hover:text-yc-yellow transition-colors">
              View Profile
            </span>
            <ExternalLink
              size={16}
              className="text-zinc-500 group-hover:text-yc-yellow transition-colors"
            />
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="ig-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 perspective-1000">
          {instagramPosts?.map((post) => (
            <a
              key={post.id}
              href={post.postUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-item group relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 hover:border-yc-yellow/50 transition-all duration-700 cursor-pointer block"
            >
              {typeof post.image === 'object' && post.image !== null ? (
                <Media
                  resource={post.image}
                  fill
                  imgClassName="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                  No Image
                </div>
              )}

              {/* Overlay with stats */}
              <div className="absolute inset-0 bg-yc-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="flex gap-6 text-white">
                  <div className="flex items-center gap-2">
                    <Heart size={20} className="fill-yc-yellow text-yc-yellow" />
                    <span className="font-syne font-bold text-sm">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} className="text-white" />
                    <span className="font-syne font-bold text-sm">{post.comments}</span>
                  </div>
                </div>
                <div className="mt-4 px-3 py-1 bg-yc-yellow text-black font-syne font-bold text-[10px] uppercase tracking-tighter">
                  View Post
                </div>
              </div>

              {/* Decorative Corner Label */}
              <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 border-t border-r border-zinc-400 dark:border-zinc-700 group-hover:border-yc-yellow transition-colors"></div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Texture Accent */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent"></div>
      </div>
    </section>
  )
}
