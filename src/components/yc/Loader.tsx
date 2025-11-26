'use client'

import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import Logo from './Logo'

interface LoaderProps {
  onComplete: () => void
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [isIgnited, setIsIgnited] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize GSAP state
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Needle Reset
      gsap.set('.gauge-needle', {
        xPercent: -50,
        yPercent: -100,
        rotation: -135,
        transformOrigin: '50% 100%',
      })

      // Initial Key Tag Swing (Idle Physics)
      gsap.to('#key-tag-container', {
        rotation: 3,
        duration: 2.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        transformOrigin: '50% 0%',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const startEngine = () => {
    if (isIgnited) return
    setIsIgnited(true)

    const tl = gsap.timeline({
      onComplete: onComplete,
    })

    // 0. Visual Feedback: Press
    tl.to('#ignition-btn', {
      scale: 0.95,
      boxShadow: '0 0 15px rgba(255, 193, 7, 0.4)',
      duration: 0.1,
      ease: 'power2.out',
    })

      // 1. Turn Key & Swing Tag
      .to('#ignition-key', {
        rotation: 90,
        duration: 0.4,
        ease: 'back.inOut(1.7)',
      })
      .to(
        '#key-tag-container',
        {
          rotation: -90,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
          overwrite: true,
        },
        '<',
      )

      // 2. Engine Start Rumble
      .to(
        '.cockpit-shaker',
        {
          x: -2,
          y: 2,
          duration: 0.05,
          repeat: 16,
          yoyo: true,
          ease: 'power1.inOut',
        },
        '-=0.3',
      )

      // 3. Dual Gauge Sweep (Startup Check)
      .to(
        '.gauge-needle',
        {
          rotation: 135, // Sweep to max
          duration: 0.6,
          ease: 'power2.inOut',
        },
        '-=0.6',
      )

      // 4. Lights On
      .to(
        '.dashboard-light',
        {
          opacity: 1,
          boxShadow: '0 0 10px currentColor',
          duration: 0.2,
          stagger: 0.1,
        },
        '-=0.3',
      )

      // 5. Neutral Light On
      .to(
        '#neutral-light',
        {
          backgroundColor: '#22c55e',
          boxShadow: '0 0 20px #22c55e',
          borderColor: '#4ade80',
          duration: 0.2,
        },
        '<',
      )

      // 6. Needles Return to Idle
      // RPM goes to idle (~1000rpm), Speedo goes to 0
      .to('#needle-rpm', {
        rotation: -115,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
      })
      .to(
        '#needle-speed',
        {
          rotation: -135,
          duration: 0.8,
          ease: 'elastic.out(1, 0.6)',
        },
        '<',
      )

      // 7. Idle Flutter (RPM Only)
      .to(
        '#needle-rpm',
        {
          rotation: -112,
          duration: 0.15,
          repeat: 4,
          yoyo: true,
          ease: 'sine.inOut',
        },
        '-=0.4',
      )

      // 8. Transition Flash
      .to('.headlight-overlay', {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.in',
      })
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#09090B] flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-800/20 to-transparent pointer-events-none"></div>
      <div className="headlight-overlay fixed inset-0 bg-white opacity-0 z-[120] pointer-events-none mix-blend-screen"></div>

      <div className="cockpit-shaker relative flex flex-col items-center scale-[0.65] md:scale-90 lg:scale-100 transition-transform duration-500">
        {/* --- LOGO --- */}
        <div className="mb-6 flex flex-col items-center">
          <div className="w-32 h-auto text-yc-yellow filter drop-shadow-[0_0_15px_rgba(255,193,7,0.3)] opacity-90">
            <Logo />
          </div>
        </div>

        {/* --- DUAL GAUGE CLUSTER --- */}
        <div className="relative flex items-center justify-center gap-4 md:gap-8 p-6 bg-[#18181B] rounded-[3rem] border border-zinc-800 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
          {/* LEFT DIAL: SPEEDOMETER */}
          <div className="relative w-64 h-64 rounded-full shadow-2xl ring-4 ring-[#27272A] bg-gradient-to-br from-[#3F3F46] to-[#09090B] p-1.5">
            <div className="absolute inset-1.5 rounded-full bg-[#09090B] border-2 border-[#18181B] shadow-[inset_0_0_30px_rgba(0,0,0,1)] overflow-hidden">
              {/* Ticks 0-220 */}
              <div className="absolute inset-0 m-4">
                {Array.from({ length: 12 }).map((_, i) => {
                  const rotation = i * 24.5 - 135
                  return (
                    <React.Fragment key={i}>
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      >
                        <div className={`w-full bg-zinc-300 ${i % 2 === 0 ? 'h-5' : 'h-3'}`}></div>
                        {i % 2 === 0 && (
                          <span
                            className="absolute top-8 left-1/2 -translate-x-1/2 font-syne font-bold text-lg text-zinc-300"
                            style={{ transform: `translate(-50%, 0) rotate(${-rotation}deg)` }}
                          >
                            {i * 20}
                          </span>
                        )}
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
              {/* Odometer */}
              <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 bg-[#18181B] border border-zinc-700 px-2 py-0.5 rounded-sm flex gap-[1px]">
                {[0, 2, 4, 8, 9].map((n, i) => (
                  <span
                    key={i}
                    className={`font-mono text-sm ${i === 4 ? 'text-white bg-red-900 px-[2px]' : 'text-zinc-400'}`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="absolute top-[60%] left-1/2 -translate-x-1/2 text-center">
                <div className="font-rubik text-zinc-500 text-[8px] tracking-[0.2em] uppercase">
                  km/h
                </div>
              </div>
              {/* Needle */}
              <div
                id="needle-speed"
                className="gauge-needle absolute top-1/2 left-1/2 w-1 bg-red-600 h-[42%] origin-bottom z-20 rounded-t-full shadow-[0_0_5px_rgba(220,38,38,0.6)]"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-zinc-800 rounded-full border-2 border-zinc-600"></div>
              </div>
              <div className="absolute inset-0 rounded-full z-30 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-30"></div>
            </div>
          </div>

          {/* RIGHT DIAL: TACHOMETER */}
          <div className="relative w-64 h-64 rounded-full shadow-2xl ring-4 ring-[#27272A] bg-gradient-to-br from-[#3F3F46] to-[#09090B] p-1.5">
            <div className="absolute inset-1.5 rounded-full bg-[#09090B] border-2 border-[#18181B] shadow-[inset_0_0_30px_rgba(0,0,0,1)] overflow-hidden">
              {/* Ticks 0-12 */}
              <div className="absolute inset-0 m-4">
                {Array.from({ length: 13 }).map((_, i) => {
                  const rotation = i * 22.5 - 135
                  const isRedline = i >= 10
                  return (
                    <React.Fragment key={i}>
                      <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full"
                        style={{ transform: `rotate(${rotation}deg)` }}
                      >
                        <div
                          className={`w-full ${isRedline ? 'bg-red-600' : 'bg-zinc-300'} ${i % 2 === 0 ? 'h-5' : 'h-3'}`}
                        ></div>
                        {i % 2 === 0 && (
                          <span
                            className={`absolute top-8 left-1/2 -translate-x-1/2 font-syne font-bold text-lg ${isRedline ? 'text-red-500' : 'text-zinc-300'}`}
                            style={{ transform: `translate(-50%, 0) rotate(${-rotation}deg)` }}
                          >
                            {i}
                          </span>
                        )}
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
              {/* Branding */}
              <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center z-10">
                <div className="font-syne font-bold text-zinc-600 text-[8px] tracking-[0.2em] uppercase mb-1">
                  YC DESIGN
                </div>
                <div className="font-rubik text-yc-yellow/60 text-[8px] tracking-[0.2em] uppercase">
                  x 1000
                </div>
              </div>
              {/* Warning Lights */}
              <div className="absolute top-[35%] left-0 right-0 flex justify-center gap-6 z-10">
                <div className="dashboard-light w-4 h-4 rounded-full bg-black border border-zinc-800 opacity-30 text-green-500 shadow-inner"></div>
                <div
                  id="neutral-light"
                  className="w-6 h-6 rounded-full bg-[#0a1f11] border border-zinc-800 flex items-center justify-center transition-all duration-300 shadow-inner"
                >
                  <span className="text-[10px] font-bold text-green-900 font-rubik">N</span>
                </div>
                <div className="dashboard-light w-4 h-4 rounded-full bg-black border border-zinc-800 opacity-30 text-red-500 shadow-inner"></div>
              </div>
              {/* Needle */}
              <div
                id="needle-rpm"
                className="gauge-needle absolute top-1/2 left-1/2 w-1 bg-red-600 h-[42%] origin-bottom z-20 rounded-t-full shadow-[0_0_5px_rgba(220,38,38,0.6)]"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-zinc-800 rounded-full border-2 border-zinc-600"></div>
              </div>
              <div className="absolute inset-0 rounded-full z-30 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-30"></div>
            </div>
          </div>
        </div>

        {/* --- IGNITION SWITCH (Tucked higher) --- */}
        <div className="relative group -mt-10 z-20">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#18181B] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-zinc-800 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border border-white/5"></div>

            <div
              id="ignition-btn"
              className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-black border border-zinc-700 shadow-[inset_0_2px_5px_black] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 z-20"
              onClick={startEngine}
            >
              {/* KEY ASSEMBLY */}
              <div
                id="ignition-key"
                className="relative w-full h-full flex items-center justify-center"
              >
                <div className="absolute w-5 h-9 bg-zinc-300 rounded-t-sm -mt-2 shadow-sm border-t border-white/20 flex flex-col items-center justify-end pb-1.5">
                  <div className="w-3 h-[1px] bg-zinc-400 mb-[2px]"></div>
                  <div className="w-3 h-[1px] bg-zinc-400 mb-[2px]"></div>
                </div>
                <div className="absolute mt-3 w-1.5 h-1.5 bg-[#18181B] rounded-full z-20 shadow-[inset_0_1px_1px_black]"></div>

                {/* TAG */}
                <div
                  id="key-tag-container"
                  className="absolute top-[60%] left-1/2 -translate-x-1/2 origin-top flex flex-col items-center"
                  style={{ perspective: '600px' }}
                >
                  <div className="w-5 h-5 border-2 border-zinc-400 rounded-full -mt-1 z-10 effect-ring shadow-sm"></div>
                  <div className="relative -mt-2 w-14 h-24 bg-[#1a1a1a] rounded-lg border border-zinc-800 shadow-[0_10px_20px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center overflow-hidden transform-gpu origin-top group-hover:brightness-110 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "url('https://www.transparenttextures.com/patterns/black-leather.png')",
                      }}
                    ></div>
                    <div className="absolute inset-1.5 border border-dashed border-yc-yellow/40 rounded-md"></div>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-800 rounded-full border-2 border-zinc-500 z-20"></div>
                    <div className="relative z-10 w-8 text-yc-yellow drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 overflow-hidden">
                      <Logo />
                      {/* Realistic Gold Shine Highlight */}
                      <div className="absolute -inset-4 bg-gradient-to-tr from-transparent via-white/50 to-transparent skew-x-12 opacity-60 mix-blend-overlay pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isIgnited && (
            <div className="absolute top-1/2 -translate-y-1/2 -right-40 w-40 text-left pointer-events-none">
              <p className="text-yc-yellow font-syne font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">
                Start Engine
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Loader
