'use client'
import React, { useEffect, useRef } from 'react'
import { ArrowRight, Wrench, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { About, Media } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const AboutClient: React.FC<{ data: About }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Cinematic Hero Entrance
      const tl = gsap.timeline()

      tl.fromTo(
        '.hero-bg',
        { scale: 1.2, filter: 'brightness(0)' },
        { scale: 1, filter: 'brightness(0.7)', duration: 2, ease: 'expo.out' },
      )
        .fromTo('.hero-hud', { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.1 }, '-=1.5')
        .fromTo(
          '.hero-title-part',
          { y: 100, opacity: 0, skewY: 7 },
          { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.2, ease: 'power4.out' },
          '-=1',
        )
        .fromTo(
          '.hero-sub',
          { opacity: 0, letterSpacing: '1em' },
          { opacity: 1, letterSpacing: '0.4em', duration: 1.5, ease: 'power3.out' },
          '-=0.5',
        )

      // 2. Parallax Scroll Effect
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-content', {
        yPercent: -20,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // 3. Section Reveals
      gsap.utils.toArray('.reveal-section').forEach((section: any) => {
        gsap.fromTo(
          section.querySelectorAll('.anim-up'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      // 4. Mechanical line animation
      gsap.fromTo(
        '.mechanical-line',
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.story-container',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const getImageUrl = (media: string | Media | null | undefined) => {
    if (!media) return ''
    if (typeof media === 'string') return media
    return media.url || ''
  }

  const { hero, story, philosophy, livingTheLife } = data

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return <Zap size={24} />
      case 'wrench':
        return <Wrench size={24} />
      case 'shield':
        return <Shield size={24} />
      default:
        return <Wrench size={24} />
    }
  }

  return (
    <div ref={containerRef} className="bg-zinc-50 dark:bg-[#09090B] overflow-hidden">
      {/* --- CINEMATIC HERO SECTION --- */}
      <section
        ref={heroRef}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden border-b border-white/5 bg-yc-dark"
      >
        {/* Parallax Background */}
        <div className="hero-bg absolute inset-0 z-0">
          <Image
            src={getImageUrl(hero.background)}
            fill
            className="object-cover"
            alt="Workshop Background"
            priority
            sizes="100vw"
          />
          {/* Texture Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-yc-dark/80 via-transparent to-yc-dark z-10"></div>
          <div className="absolute inset-0 bg-brushed-metal opacity-[0.03] mix-blend-overlay z-10"></div>
          <div className="absolute inset-0 bg-mesh-pattern opacity-[0.05] z-10"></div>
        </div>

        {/* Mechanical HUD HUD elements */}
        <div className="hero-hud absolute top-24 left-10 hidden xl:block z-20">
          <div className="w-px h-24 bg-gradient-to-b from-yc-yellow/40 to-transparent mt-4"></div>
        </div>

        <div className="hero-hud absolute bottom-12 right-10 hidden xl:flex items-center gap-6 z-20">
          <div className="text-right">
            <div className="text-white/20 font-syne font-bold text-[9px] uppercase tracking-[0.5em] mb-2">
              Lower Parel Workshop
            </div>
            <div className="flex gap-2 justify-end">
              <div className="w-2 h-2 rounded-full border border-yc-yellow/40"></div>
              <div className="w-2 h-2 rounded-full bg-yc-yellow/40"></div>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center animate-spin-slow">
            <div className="w-1 h-1 bg-yc-yellow rounded-full"></div>
            <div className="absolute inset-2 border-t border-yc-yellow/30 rounded-full"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-20 container mx-auto px-6 flex flex-col items-center text-center">
          <div className="hero-title-part overflow-hidden mb-2">
            <span className="inline-block px-4 py-1.5 bg-yc-yellow text-black font-syne font-bold text-[10px] tracking-[0.3em] uppercase">
              {hero.establishedDate}
            </span>
          </div>

          <div ref={titleRef} className="mb-10">
            <h1 className="hero-title-part text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-syne font-extrabold text-white leading-[0.85] tracking-tighter uppercase mb-2">
              {hero.titlePart1}{' '}
              <span
                className="text-transparent border-text stroke-white"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}
              >
                {hero.titlePart2}
              </span>
            </h1>
            <h1 className="hero-title-part text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-syne font-extrabold text-white leading-[0.85] tracking-tighter uppercase">
              {hero.titlePart3}.
            </h1>
          </div>

          <p className="hero-sub text-yc-yellow font-rubik text-[9px] sm:text-[11px] uppercase tracking-[0.4em] opacity-80 max-w-sm sm:max-w-none">
            {hero.subtitle}
          </p>

          <div className="hero-hud absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"></div>
            <span className="text-white/30 font-rubik text-[8px] uppercase tracking-[0.4em] animate-pulse">
              Scroll to explore
            </span>
          </div>
        </div>
      </section>

      {/* --- THE STORY: THE MAN BEHIND THE METAL --- */}
      <section className="reveal-section story-container relative py-24 md:py-32 container mx-auto px-6">
        {/* Progress Line */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-zinc-200 dark:bg-white/10 -translate-x-1/2">
          <div className="mechanical-line absolute top-0 left-0 w-full bg-yc-yellow h-0"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
          <div className="anim-up relative aspect-[4/5] overflow-hidden rounded-sm border border-zinc-200 dark:border-white/10 shadow-2xl">
            <Image
              src={getImageUrl(story.image1)}
              fill
              className="object-cover contrast-110"
              alt="Yogi Chhabria"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-yc-yellow/10 mix-blend-multiply"></div>
            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-yc-yellow text-black flex items-center justify-center">
              <Wrench size={32} />
            </div>
          </div>

          <div className="anim-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-yc-yellow"></span>
              <span className="text-yc-yellow font-rubik font-bold text-[10px] tracking-widest uppercase">
                The Heart of the Operation
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-syne font-bold text-zinc-900 dark:text-white mb-8 leading-tight">
              {story.title1}
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-rubik text-sm md:text-base leading-relaxed">
              <RichText data={story.content1} />
            </div>
          </div>
        </div>

        {/* The Birth of YC Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center flex-row-reverse">
          <div className="anim-up order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-yc-yellow"></span>
              <span className="text-yc-yellow font-rubik font-bold text-[10px] tracking-widest uppercase">
                The Genesis
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-syne font-bold text-zinc-900 dark:text-white mb-8 leading-tight">
              {story.title2}
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-rubik text-sm md:text-base leading-relaxed">
              <RichText data={story.content2} />
            </div>
          </div>

          <div className="anim-up order-1 lg:order-2 relative aspect-video overflow-hidden rounded-sm border border-zinc-200 dark:border-white/10 shadow-xl">
            <Image
              src={getImageUrl(story.image2)}
              fill
              className="object-cover contrast-110"
              alt="Workshop Environment"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 right-4 text-white/20 font-mono text-[8px] uppercase tracking-widest">
              {story.image2Caption}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="reveal-section py-24 bg-zinc-100 dark:bg-yc-muted/20 border-y border-zinc-200 dark:border-white/5 relative">
        <div className="absolute inset-0 bg-mesh-pattern opacity-[0.05] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="anim-up text-yc-yellow font-rubik font-bold text-[10px] tracking-[0.4em] uppercase mb-4">
              Philosophy
            </h3>
            <h2 className="anim-up text-4xl md:text-6xl font-syne font-bold text-zinc-900 dark:text-white mb-6">
              {philosophy.heading}
            </h2>
            <p className="anim-up text-zinc-500 dark:text-zinc-400 font-rubik text-sm leading-relaxed">
              {philosophy.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophy.cards?.map((item: any, idx: number) => (
              <div
                key={idx}
                className="anim-up group p-10 bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-white/5 hover:border-yc-yellow/30 transition-all duration-500"
              >
                <div className="text-yc-yellow mb-8 group-hover:scale-110 transition-transform duration-500">
                  {getIcon(item.icon)}
                </div>
                <h4 className="text-zinc-900 dark:text-white font-syne font-bold text-xl mb-4 uppercase tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-zinc-500 dark:text-zinc-400 font-rubik text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Living the Life */}
      <section className="reveal-section py-24 md:py-32 container mx-auto px-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="anim-up grid grid-cols-2 gap-4 relative">
            {livingTheLife.images?.map((img: any, idx: number) => (
              <div
                key={idx}
                className={`relative w-full aspect-[3/4] rounded-sm overflow-hidden ${idx === 1 ? 'translate-y-12' : ''}`}
              >
                <Image
                  src={getImageUrl(img.image)}
                  fill
                  className="object-cover brightness-75"
                  alt="Dirt Racing"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-yc-yellow/20 rounded-full animate-pulse"></div>
          </div>

          <div className="anim-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-syne font-bold text-zinc-900 dark:text-white mb-8 leading-tight">
              {livingTheLife.title}
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-rubik text-sm md:text-base leading-relaxed">
              <RichText data={livingTheLife.content} />
            </div>

            <div className="mt-12">
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-6 px-8 py-5 bg-yc-yellow text-black font-syne font-bold text-[10px] md:text-[11px] tracking-[0.2em] uppercase hover:bg-zinc-900 hover:text-white transition-all duration-500 shadow-xl"
              >
                Ready to build your dream?
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-bg {
          will-change: transform;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
