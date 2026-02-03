'use client'

import React, { useRef, useEffect } from 'react'
import { MapPin, ArrowDown } from 'lucide-react'
import { Logo } from '@/components/yc'

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftLightRef = useRef<HTMLDivElement>(null)
  const rightLightRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any = null

    const initAnimations = async () => {
      const gsap = (await import('gsap')).gsap

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.5 })

        // 1. Initial State
        gsap.set([leftLightRef.current, rightLightRef.current], { opacity: 0.1 })
        gsap.set(logoRef.current, { opacity: 0, scale: 0.9 })
        gsap.set(textRef.current, { opacity: 0, y: 20 })

        // 2. Realistic Neon Flicker Sequence
        const flicker = (target: gsap.TweenTarget) => {
          const ftl = gsap.timeline()
          ftl
            .to(target, { opacity: 1, duration: 0.05 })
            .to(target, { opacity: 0.1, duration: 0.05 })
            .to(target, { opacity: 0.8, duration: 0.1 })
            .to(target, { opacity: 0.1, duration: 0.1 })
            .to(target, { opacity: 1, duration: 0.05 })
            .to(target, { opacity: 0.3, duration: 0.3 })
            .to(target, { opacity: 1, duration: 1.5 }) // Final ON state
          return ftl
        }

        // Play flickering for both lights slightly offset
        tl.add('lightsOn')
          .add(flicker(leftLightRef.current), 'lightsOn')
          .add(flicker(rightLightRef.current), 'lightsOn+=0.1')

        // 3. Logo Reveal (Illuminated by the lights)
        tl.to(
          logoRef.current,
          {
            opacity: 0.8,
            scale: 1,
            duration: 2,
            ease: 'power2.out',
            filter: 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.3))',
          },
          'lightsOn+=0.5',
        )

        // 4. Ambient Room Light Up
        tl.to('.ambient-glow', { opacity: 0.4, duration: 2 }, 'lightsOn+=0.5')

        // 5. Minimal Text Reveal
        tl.to(textRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=1')
      }, containerRef)
    }

    initAnimations()

    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-zinc-100 dark:bg-[#09090B] overflow-hidden flex flex-col justify-center items-center transition-colors duration-500"
    >
      {/* --- BACKGROUND TEXTURES --- */}

      {/* Concrete Wall Texture */}
      <div className="absolute inset-0 z-0 bg-zinc-200 dark:bg-[#09090B] transition-colors duration-500">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/concrete-wall.png')",
            backgroundSize: '300px',
          }}
        ></div>
        {/* Vignette - Smoother Gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-200/60 dark:via-[#09090B]/60 to-zinc-300 dark:to-[#09090B]"></div>
      </div>

      {/* Garage Door (Centered) */}
      <div className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none">
        <div className="w-[80vw] max-w-4xl h-[60vh] bg-zinc-100 dark:bg-[#18181B] relative border-x border-t border-zinc-300 dark:border-zinc-800 shadow-2xl transition-colors duration-500">
          {/* Rolling Shutter Lines */}
          <div className="absolute inset-0 flex flex-col">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-b border-zinc-200 dark:border-[#09090B]/80 bg-gradient-to-b from-white/20 dark:from-white/5 to-transparent"
              ></div>
            ))}
          </div>
          {/* Shutter Bottom Bar */}
          <div className="absolute bottom-0 w-full h-4 bg-zinc-300 dark:bg-[#27272A] border-t border-white/20 dark:border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"></div>
        </div>
      </div>

      {/* --- LIGHTING FX --- */}

      {/* Vertical Neon Lights - White/Cold Tone */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[90vw] max-w-5xl h-[70vh] flex justify-between items-center px-4 md:px-12">
          {/* Left Light */}
          <div
            ref={leftLightRef}
            className="w-2 md:w-3 h-full bg-zinc-400 dark:bg-zinc-50/80 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.2)] opacity-10 relative"
          >
            <div className="absolute inset-0 bg-white blur-[2px]"></div>
          </div>
          {/* Right Light */}
          <div
            ref={rightLightRef}
            className="w-2 md:w-3 h-full bg-zinc-400 dark:bg-zinc-50/80 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.2)] opacity-10 relative"
          >
            <div className="absolute inset-0 bg-white blur-[2px]"></div>
          </div>
        </div>
      </div>

      {/* Floor Reflection / Ambient Glow */}
      <div className="ambient-glow absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-300/30 dark:from-[#18181B]/30 to-transparent opacity-0 pointer-events-none z-5 mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute inset-0 bg-zinc-100/30 dark:bg-[#09090B]/30 z-[2]"></div>

      {/* --- CONTENT --- */}

      <div className="relative z-20 text-center flex flex-col items-center justify-center h-full pt-20">
        {/* Logo on Shutter */}
        <div ref={logoRef} className="mb-12 opacity-0 mix-blend-hard-light dark:mix-blend-overlay">
          <div className="w-32 h-32 md:w-48 md:h-48 border-[6px] border-zinc-900/10 dark:border-white/10 rounded-xl flex items-center justify-center bg-white/40 dark:bg-[#18181B]/40 backdrop-blur-sm p-6">
            <Logo className="w-full h-full text-zinc-800 dark:text-white/40" />
          </div>
        </div>

        {/* Main Typography */}
        <div ref={textRef} className="opacity-0 space-y-8">
          <h1 className="text-4xl md:text-6xl font-syne font-bold text-zinc-900 dark:text-white tracking-wide uppercase drop-shadow-sm dark:drop-shadow-2xl transition-colors duration-500">
            Preserving Legends<span className="text-yc-yellow">.</span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-zinc-500 dark:text-zinc-400 font-rubik text-xs md:text-sm tracking-[0.2em] uppercase transition-colors duration-500">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-yc-yellow" />
              <span>Lower Parel, Mumbai</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full"></div>
            <div>Custom Restoration Workshop</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-400 dark:text-white/20 animate-bounce transition-colors duration-500">
          <ArrowDown size={24} />
        </div>
      </div>
    </section>
  )
}

export default Hero
