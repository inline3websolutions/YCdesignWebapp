'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { Search } from 'lucide-react'
import { Logo } from '@/components/yc'
import GlobalSearch from './GlobalSearch'
import type { Header } from '@/payload-types'

interface YCHeaderProps {
  data?: Header
}

const YCHeader: React.FC<YCHeaderProps> = ({ data }) => {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Scroll listener for style change
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Keyboard shortcut for search (Cmd+K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // Initial enter animation
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      )
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Handle Hash Scrolling
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [pathname])

  // Default nav links if no data from Payload
  const defaultNavLinks = [
    { label: 'Studio', mobileLabel: 'Studio', url: '/#about' },
    { label: 'Work', mobileLabel: 'Work', url: '/portfolio' },
    { label: 'On Sale', mobileLabel: 'Sale', url: '/sales' },
    { label: 'Blog', mobileLabel: 'Blog', url: '/blog' },
  ]

  // Use Payload data or fallback to defaults
  const navLinks =
    data?.navItems?.map((item) => ({
      label: item.label,
      mobileLabel: item.mobileLabel || item.label,
      url:
        item.linkType === 'reference' && item.reference
          ? typeof item.reference.value === 'object'
            ? `/${item.reference.value.slug}`
            : `/${item.reference.value}`
          : item.url || '#',
    })) || defaultNavLinks

  const ctaButton = data?.ctaButton || {
    label: 'Start Project',
    mobileLabel: 'Start',
    url: '/#contact',
  }

  const isActive = (path: string) => {
    if (path === '/portfolio' && pathname?.includes('portfolio')) return true
    if (path === '/portfolio' && pathname?.includes('project')) return true
    if (path === '/sales' && pathname?.includes('sales')) return true
    if (path === '/blog' && pathname?.includes('blog')) return true
    if (path === '/blog' && pathname?.includes('posts')) return true
    if (path === '/' && pathname === '/') return true
    if (path.includes('#') && pathname === '/') return true
    return false
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#')) {
      const targetId = path.split('#')[1]
      if (pathname === '/') {
        e.preventDefault()
        const elem = document.getElementById(targetId)
        elem?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? 'top-4' : 'top-6'
      }`}
    >
      <div
        className={`
                relative w-[95%] max-w-5xl 
                bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-xl 
                border border-zinc-200 dark:border-white/10 
                rounded-full
                flex justify-between items-center 
                pl-4 pr-2 py-2 md:pl-6
                shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                transition-all duration-500 ease-out
                ${scrolled ? 'bg-white/95 dark:bg-[#09090B]/95 border-zinc-300 dark:border-white/15 shadow-zinc-200/50 dark:shadow-black/60' : ''}
            `}
      >
        {/* Tech Decoration - Corner Accents */}
        <div className="hidden md:block absolute -top-[1px] left-10 w-8 h-[1px] bg-zinc-900/10 dark:bg-white/20" />
        <div className="hidden md:block absolute -bottom-[1px] right-10 w-8 h-[1px] bg-zinc-900/10 dark:bg-white/20" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group z-20 shrink-0">
          <Logo className="h-6 md:h-9 w-auto text-zinc-900 dark:text-white group-hover:text-yc-yellow transition-colors duration-300" />
        </Link>

        {/* Unified Navigation - Clean Island (Mobile & Desktop) */}
        <div className="flex items-center justify-center gap-0 md:gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const active = isActive(link.url)
            return (
              <Link
                key={link.label}
                href={link.url}
                onClick={(e) => handleNavClick(e, link.url)}
                className={`
                                relative px-3 md:px-6 py-2 transition-colors duration-300 group
                                ${active ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}
                            `}
              >
                <span className="relative z-10 font-rubik uppercase tracking-widest font-bold text-[10px] md:text-xs">
                  <span className="md:hidden">{link.mobileLabel}</span>
                  <span className="hidden md:inline">{link.label}</span>
                </span>

                {/* Modern Dot Indicator for Active State */}
                <span
                  className={`
                                absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yc-yellow 
                                transition-all duration-300 
                                ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-50 group-hover:translate-y-0'}
                            `}
                />
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 z-20">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/50 hover:border-yc-yellow/50 text-zinc-500 hover:text-zinc-900 dark:hover:text-yc-yellow transition-colors duration-300"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          <Link
            href={ctaButton.url || '/#contact'}
            onClick={(e) => handleNavClick(e, ctaButton.url || '/#contact')}
            className="relative group overflow-hidden px-4 md:px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/50 hover:border-yc-yellow/50 transition-colors duration-300"
          >
            <span className="relative text-[10px] font-syne font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-yc-yellow transition-colors duration-300">
              <span className="md:hidden">{ctaButton.mobileLabel || 'Start'}</span>
              <span className="hidden md:inline">{ctaButton.label || 'Start Project'}</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  )
}

export default YCHeader
