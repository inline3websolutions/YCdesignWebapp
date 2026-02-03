'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any = null

    const initAnimations = async () => {
      const gsap = (await import('gsap')).gsap
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Image Reveal
        gsap.fromTo(
          imageRef.current,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        // Text Reveal
        gsap.fromTo(
          textRef.current,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        // Counter Animation
        const counters = document.querySelectorAll('.stat-counter')
        counters.forEach((counter) => {
          gsap.from(counter, {
            textContent: 0,
            duration: 2,
            ease: 'power1.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: counter,
              start: 'top 90%',
            },
          })
        })
      }, containerRef)
    }

    initAnimations()

    return () => ctx?.revert()
  }, [])

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-24 bg-white dark:bg-yc-metal relative overflow-hidden transition-colors duration-500"
    >
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-brushed-metal opacity-5"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={imageRef} className="relative opacity-0">
            <div className="aspect-[4/5] md:aspect-square relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-2 transition-colors duration-500">
              <Image
                src="https://images.unsplash.com/photo-1626847037657-fd3622613ce3?q=80&w=2000&auto=format&fit=crop"
                alt="Yogi Chhabria - Workshop"
                fill
                className="object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                unoptimized
              />
              <div className="absolute bottom-6 right-6 bg-yc-yellow text-black px-4 py-2 font-syne font-bold text-xl">
                YC
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-yc-yellow/50"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-yc-yellow/50"></div>
          </div>

          <div ref={textRef} className="opacity-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-yc-yellow"></div>
              <span className="text-yc-yellow font-rubik uppercase tracking-widest text-sm">
                The Workshop
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-syne font-bold text-zinc-900 dark:text-white mb-8 transition-colors duration-500">
              ENGINEERING <br />
              <span className="text-zinc-500">SOUL & SPEED.</span>
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-6 font-rubik leading-relaxed transition-colors duration-500">
              At YC Design, we don&apos;t just fix bikes; we resurrect legends. Led by Yogi
              Chhabria, our Lower Parel workshop is a sanctuary for vintage iron and modern
              engineering.
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 font-rubik leading-relaxed transition-colors duration-500">
              With a deep-rooted passion for racing culture and industrial design, every build that
              leaves our floor is a testament to precision, power, and aesthetic purity. Whether
              it&apos;s a full-frame restoration or a radical custom modification, we build icons
              that stand the test of time.
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="text-3xl font-syne font-bold text-zinc-900 dark:text-white mb-1 transition-colors duration-500">
                  <span className="stat-counter">150</span>+
                </h4>
                <p className="text-zinc-500 text-sm uppercase tracking-wider">Projects Delivered</p>
              </div>
              <div>
                <h4 className="text-3xl font-syne font-bold text-zinc-900 dark:text-white mb-1 transition-colors duration-500">
                  <span className="stat-counter">100</span>%
                </h4>
                <p className="text-zinc-500 text-sm uppercase tracking-wider">Handcrafted</p>
              </div>
            </div>

            <a
              href="#contact"
              className="text-zinc-900 dark:text-white border-b border-yc-yellow pb-1 hover:text-yc-yellow transition-colors font-syne uppercase tracking-wider"
            >
              Visit the Workshop
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
