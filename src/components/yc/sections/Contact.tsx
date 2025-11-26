'use client'

import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface FormData {
  name: string
  email: string
  phone: string
  subject: 'restoration' | 'custom' | 'purchase' | 'general'
  bikeInterest: string
  message: string
}

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    bikeInterest: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Something went wrong')
      }

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        bikeInterest: '',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-24 bg-yc-yellow relative overflow-hidden"
    >
      {/* Texture */}
      <div
        className="absolute inset-0 bg-yc-dark opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, #09090B 100%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div ref={contentRef} className="opacity-0">
          <div className="text-center mb-12">
            <h2 className="text-black font-syne font-bold text-5xl md:text-7xl mb-6 uppercase tracking-tight">
              Ready to Build
              <br />
              Your Legend?
            </h2>
            <p className="text-black/70 font-rubik text-xl max-w-2xl mx-auto font-medium">
              Whether it&apos;s a full restoration or a custom modification, let&apos;s discuss your
              vision.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-8 md:p-12 rounded-sm shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-syne font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm font-rubik text-zinc-900 dark:text-white focus:outline-none focus:border-yc-yellow transition-colors"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-syne font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm font-rubik text-zinc-900 dark:text-white focus:outline-none focus:border-yc-yellow transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-syne font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm font-rubik text-zinc-900 dark:text-white focus:outline-none focus:border-yc-yellow transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-syne font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm font-rubik text-zinc-900 dark:text-white focus:outline-none focus:border-yc-yellow transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="restoration">Restoration Project</option>
                  <option value="custom">Custom Build</option>
                  <option value="purchase">Bike Purchase Inquiry</option>
                </select>
              </div>
            </div>

            {/* Bike Interest - shown only for purchase inquiries */}
            {formData.subject === 'purchase' && (
              <div className="mb-6">
                <label
                  htmlFor="bikeInterest"
                  className="block text-sm font-syne font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider"
                >
                  Which bike are you interested in?
                </label>
                <input
                  type="text"
                  id="bikeInterest"
                  name="bikeInterest"
                  value={formData.bikeInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm font-rubik text-zinc-900 dark:text-white focus:outline-none focus:border-yc-yellow transition-colors"
                  placeholder="e.g., Honda CB750 Nighthawk"
                />
              </div>
            )}

            {/* Message */}
            <div className="mb-8">
              <label
                htmlFor="message"
                className="block text-sm font-syne font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider"
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm font-rubik text-zinc-900 dark:text-white focus:outline-none focus:border-yc-yellow transition-colors resize-none"
                placeholder="Tell us about your project or inquiry..."
              />
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-sm flex items-center gap-3">
                <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                <span className="text-green-800 dark:text-green-300 font-rubik">
                  Message sent successfully! We&apos;ll get back to you soon.
                </span>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-sm flex items-center gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                <span className="text-red-800 dark:text-red-300 font-rubik">
                  {errorMessage || 'Failed to send message. Please try again.'}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-yc-dark dark:bg-yc-yellow text-white dark:text-black font-syne font-bold text-lg uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Alternative contact */}
          <div className="text-center mt-8">
            <p className="text-black/60 font-rubik">
              Prefer to chat directly?{' '}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-black hover:underline"
              >
                Message us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
