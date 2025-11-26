'use client'

import React from 'react'
import Link from 'next/link'
import { Instagram, Mail, MapPin, Phone, Sun, Moon, Facebook, Youtube } from 'lucide-react'
import { Logo } from '@/components/yc'
import { useTheme } from '@/providers/Theme'
import type { Footer } from '@/payload-types'

interface YCFooterProps {
  data?: Footer
}

const YCFooter: React.FC<YCFooterProps> = ({ data }) => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Default values
  const description =
    data?.description ||
    'Preserving Legends. Building Icons. We specialize in bringing vintage mechanical souls back to life with modern precision and retro-futuristic aesthetics.'

  const socialLinks = data?.socialLinks || {}

  const defaultExploreLinks = [
    { label: 'Home', url: '/' },
    { label: 'Restored Bikes', url: '/portfolio?filter=Restoration' },
    { label: 'Modified Bikes', url: '/portfolio?filter=Modification' },
    { label: 'Inventory', url: '/sales' },
    { label: 'About Us', url: '/#about' },
    { label: 'Contact', url: '/#contact' },
  ]

  const exploreLinks = data?.exploreLinks?.length ? data.exploreLinks : defaultExploreLinks

  const contactInfo = data?.contactInfo || {
    addressLine1: 'Lower Parel, Mumbai,',
    addressLine2: 'Maharashtra, India',
    phone: '+91 98765 43210',
  }

  const legalLinks = data?.legalLinks || {
    privacyPolicy: '/privacy',
    termsOfService: '/terms',
  }

  const copyrightText = data?.copyrightText || 'YC Design. All rights reserved.'

  return (
    <footer className="bg-zinc-100 dark:bg-yc-dark border-t border-zinc-200 dark:border-zinc-800 pt-20 pb-10 relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-brushed-metal opacity-5 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Logo className="h-12 w-auto text-zinc-900 dark:text-white transition-colors duration-500" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 font-rubik max-w-md leading-relaxed mb-8 transition-colors duration-500">
              {description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all"
                >
                  <Instagram size={18} />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all"
                >
                  <Mail size={18} />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all"
                >
                  <Facebook size={18} />
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all"
                >
                  <Youtube size={18} />
                </a>
              )}
              {/* Show default icons if no social links are set */}
              {!socialLinks.instagram &&
                !socialLinks.email &&
                !socialLinks.facebook &&
                !socialLinks.youtube && (
                  <>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all"
                    >
                      <Instagram size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-yc-yellow hover:text-yc-yellow transition-all"
                    >
                      <Mail size={18} />
                    </a>
                  </>
                )}
            </div>
          </div>

          <div>
            <h3 className="text-zinc-900 dark:text-white font-syne font-bold uppercase mb-6 transition-colors duration-500">
              Explore
            </h3>
            <ul className="space-y-4">
              {exploreLinks.map((item, index) => (
                <li key={item.url || index}>
                  <Link
                    href={item.url || '#'}
                    className="text-zinc-500 hover:text-yc-yellow transition-colors font-rubik text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-zinc-900 dark:text-white font-syne font-bold uppercase mb-6 transition-colors duration-500">
              Visit Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-zinc-500 font-rubik text-sm">
                <MapPin size={18} className="text-yc-yellow shrink-0 mt-1" />
                <span>
                  {contactInfo.addressLine1}
                  <br />
                  {contactInfo.addressLine2}
                </span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-500 font-rubik text-sm">
                <Phone size={18} className="text-yc-yellow shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 dark:text-zinc-600 font-rubik transition-colors duration-500">
          <p>
            &copy; {new Date().getFullYear()} {copyrightText}
          </p>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span className="uppercase font-bold tracking-wider text-[10px]">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>

            <div className="flex space-x-6">
              <Link href={legalLinks.privacyPolicy || '/privacy'} className="hover:text-zinc-400">
                Privacy Policy
              </Link>
              <Link href={legalLinks.termsOfService || '/terms'} className="hover:text-zinc-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default YCFooter
