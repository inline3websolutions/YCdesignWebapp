# Payload CMS + Custom Frontend Integration Blueprint

A comprehensive guide for integrating a pre-built React/Next.js frontend with Payload CMS.

---

## Table of Contents

1. [Project Structure Overview](#project-structure-overview)
2. [Payload Collections Design](#payload-collections-design)
3. [Type System & Data Conversion](#type-system--data-conversion)
4. [Component Architecture](#component-architecture)
5. [Page Patterns](#page-patterns)
6. [API Routes](#api-routes)
7. [Styling Configuration](#styling-configuration)
8. [Animation Integration](#animation-integration)
9. [Search Implementation](#search-implementation)
10. [Form Handling](#form-handling)
11. [Deployment Checklist](#deployment-checklist)
12. [Prompt Template](#prompt-template-for-new-projects)

---

## Project Structure Overview

```
src/
├── app/
│   └── (frontend)/           # Frontend route group
│       ├── layout.tsx        # Root layout with providers
│       ├── globals.css       # Global styles
│       ├── page.tsx          # Homepage
│       ├── api/              # API routes
│       │   ├── contact/
│       │   └── search/
│       ├── [collection]/     # Dynamic collection pages
│       │   ├── page.tsx      # List/archive page
│       │   └── [slug]/       # Detail pages
│       └── blog/             # Blog section
├── collections/              # Payload collections
│   ├── Projects/
│   ├── Categories/
│   ├── Media.ts
│   ├── ContactSubmissions.ts
│   └── Users/
├── components/
│   └── frontend/             # Frontend-specific components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Loader.tsx
│       ├── GlobalSearch.tsx
│       ├── LayoutWrapper.tsx
│       ├── index.ts          # Barrel exports
│       └── sections/         # Page sections
│           ├── Hero.tsx
│           ├── About.tsx
│           ├── Portfolio.tsx
│           └── Contact.tsx
├── types/
│   └── frontend.ts           # Frontend type definitions
└── payload.config.ts         # Payload configuration
```

---

## Payload Collections Design

### Core Collection Template

```typescript
// src/collections/Projects/index.ts
import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor(),
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: false,
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'client',
              type: 'text',
            },
            {
              name: 'location',
              type: 'text',
            },
            {
              name: 'year',
              type: 'number',
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            // SEO fields from @payloadcms/plugin-seo
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  versions: {
    drafts: { autosave: { interval: 100 } },
  },
}
```

### Contact Submissions Collection

```typescript
// src/collections/ContactSubmissions.ts
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    create: () => true, // Public can submit
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Forms',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    {
      name: 'subject',
      type: 'select',
      options: [
        { label: 'General Inquiry', value: 'general' },
        { label: 'Project Request', value: 'project' },
        { label: 'Collaboration', value: 'collaboration' },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Responded', value: 'responded' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

## Type System & Data Conversion

### Frontend Types Definition

```typescript
// src/types/frontend.ts
import type { Media, Project as PayloadProject, Category } from '@/payload-types'

// Frontend-friendly interfaces
export interface Project {
  id: string
  title: string
  slug: string
  category: string
  categorySlug: string
  image: string
  gallery: string[]
  description: string
  client?: string
  location?: string
  year?: number
  featured: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  image?: string
  rating: number
}

// Payload to Frontend converters
export function projectToFrontend(doc: PayloadProject): Project {
  const heroImage = doc.heroImage as Media | undefined
  const gallery = doc.gallery as Media[] | undefined
  const category = doc.category as Category | undefined

  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug || '',
    category: category?.title || 'Uncategorized',
    categorySlug: category?.slug || '',
    image: heroImage?.url || '/placeholder.jpg',
    gallery: gallery?.map(img => img.url).filter((url): url is string => !!url) || [],
    description: extractPlainText(doc.content),
    client: doc.client || undefined,
    location: doc.location || undefined,
    year: doc.year || undefined,
    featured: doc.featured || false,
  }
}

// Rich text to plain text helper
export function extractPlainText(content: any): string {
  if (!content?.root?.children) return ''
  
  const extract = (node: any): string => {
    if (node.type === 'text') return node.text || ''
    if (node.children) return node.children.map(extract).join(' ')
    return ''
  }
  
  return content.root.children
    .map(extract)
    .join(' ')
    .trim()
    .substring(0, 300)
}

// Static data (for testimonials, stats, etc.)
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Client Name',
    role: 'CEO',
    company: 'Company Inc',
    text: 'Testimonial text here...',
    rating: 5,
  },
  // Add more...
]
```

---

## Component Architecture

### Layout Wrapper Pattern

```typescript
// src/components/frontend/LayoutWrapper.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Header, Footer, Loader } from '@/components/frontend'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    // Check session storage to avoid showing loader on every page
    const alreadyLoaded = sessionStorage.getItem('site-loaded')
    if (alreadyLoaded) {
      setIsLoading(false)
      setHasLoaded(true)
    }
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    setHasLoaded(true)
    sessionStorage.setItem('site-loaded', 'true')
  }

  if (!hasLoaded && isLoading) {
    return <Loader onComplete={handleLoadingComplete} />
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
```

### Header with Search Integration

```typescript
// src/components/frontend/Header.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import GlobalSearch from './GlobalSearch'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    // Keyboard shortcut: Cmd/Ctrl + K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const navLinks = [
    { name: 'Work', path: '/portfolio' },
    { name: 'About', path: '/#about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/#contact' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : ''}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Logo
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.path ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
```

### Barrel Exports

```typescript
// src/components/frontend/index.ts
export { default as Header } from './Header'
export { default as Footer } from './Footer'
export { default as Loader } from './Loader'
export { default as GlobalSearch } from './GlobalSearch'
export { default as LayoutWrapper } from './LayoutWrapper'
export { default as Lightbox } from './Lightbox'

// Sections
export * from './sections'
```

---

## Page Patterns

### Server Component (Data Fetching)

```typescript
// src/app/(frontend)/portfolio/page.tsx
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { projectToFrontend } from '@/types/frontend'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
  title: 'Portfolio | Studio Name',
  description: 'Browse our collection of projects.',
}

export const revalidate = 600 // Revalidate every 10 minutes

async function getProjects() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    depth: 2,
    limit: 50,
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
  })

  return result.docs.map(projectToFrontend)
}

async function getCategories() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({ collection: 'categories', limit: 50 })
  return result.docs
}

export default async function PortfolioPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ])

  return <PortfolioClient projects={projects} categories={categories} />
}
```

### Client Component (Interactivity)

```typescript
// src/app/(frontend)/portfolio/PortfolioClient.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import type { Project } from '@/types/frontend'
import type { Category } from '@/payload-types'

interface PortfolioClientProps {
  projects: Project[]
  categories: Category[]
}

export default function PortfolioClient({ projects, categories }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.categorySlug === activeFilter)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [activeFilter])

  return (
    <div ref={containerRef} className="pt-24 pb-12 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Our Work</h1>
          <p className="text-gray-600 max-w-lg">
            A curated collection of our finest projects.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.slug || '')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === cat.slug
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="project-card group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {project.category}
              </span>
              <h3 className="text-xl font-bold mt-1 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Detail Page with Dynamic Params

```typescript
// src/app/(frontend)/portfolio/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { projectToFrontend } from '@/types/frontend'
import ProjectDetailClient from './ProjectDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (result.docs.length === 0) {
    return { title: 'Project Not Found' }
  }

  const project = result.docs[0]
  return {
    title: `${project.title} | Studio Name`,
    description: project.meta?.description || '',
  }
}

async function getProject(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  if (result.docs.length === 0) return null
  return projectToFrontend(result.docs[0])
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) notFound()

  return <ProjectDetailClient project={project} />
}
```

---

## API Routes

### Contact Form Submission

```typescript
// src/app/(frontend)/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Required fields missing' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || undefined,
        subject: subject || 'general',
        message,
        status: 'new',
      },
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

### Global Search

```typescript
// src/app/(frontend)/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media } from '@/payload-types'

export interface SearchResult {
  id: string
  type: 'project' | 'post'
  title: string
  description: string
  image: string
  url: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const payload = await getPayload({ config: configPromise })
    const results: SearchResult[] = []

    // Search Projects
    const projects = await payload.find({
      collection: 'projects',
      where: {
        or: [
          { title: { contains: query } },
          { client: { contains: query } },
        ],
        _status: { equals: 'published' },
      },
      limit: 5,
      depth: 1,
    })

    projects.docs.forEach(doc => {
      const heroImage = doc.heroImage as Media | undefined
      results.push({
        id: String(doc.id),
        type: 'project',
        title: doc.title,
        description: doc.client || 'Project',
        image: heroImage?.url || '/placeholder.jpg',
        url: `/portfolio/${doc.slug}`,
      })
    })

    // Search Posts
    const posts = await payload.find({
      collection: 'posts',
      where: {
        title: { contains: query },
        _status: { equals: 'published' },
      },
      limit: 5,
      depth: 1,
    })

    posts.docs.forEach(doc => {
      const heroImage = doc.heroImage as Media | undefined
      results.push({
        id: String(doc.id),
        type: 'post',
        title: doc.title,
        description: doc.meta?.description || 'Blog post',
        image: heroImage?.url || '/placeholder.jpg',
        url: `/blog/${doc.slug}`,
      })
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
```

---

## Styling Configuration

### Tailwind Config

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#YOUR_PRIMARY_COLOR',
        secondary: '#YOUR_SECONDARY_COLOR',
        accent: '#YOUR_ACCENT_COLOR',
        dark: '#09090B',
        muted: '#71717A',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url('/noise.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
```

### Global CSS

```css
/* src/app/(frontend)/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-heading: 'Syne', system-ui, sans-serif;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply antialiased;
  }
  
  ::selection {
    @apply bg-primary text-white;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-700 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-600;
}
```

---

## Animation Integration

### GSAP Setup

```bash
pnpm add gsap
```

### Animation Patterns

```typescript
// Scroll-triggered counter animation
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.from('.stat-number', {
      textContent: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%',
      },
    })
  })
  return () => ctx.revert()
}, [])

// Staggered reveal
gsap.fromTo(
  '.card',
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cards-container',
      start: 'top 80%',
    },
  }
)

// Text reveal with clip-path
gsap.fromTo(
  '.reveal-text',
  { clipPath: 'inset(0 100% 0 0)' },
  { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power4.out' }
)
```

---

## Search Implementation

### Global Search Component

```typescript
// src/components/frontend/GlobalSearch.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X, Loader2 } from 'lucide-react'
import type { SearchResult } from '@/app/(frontend)/api/search/route'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(-1)
    }
  }, [isOpen])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => performSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, performSearch])

  const handleSelect = (result: SearchResult) => {
    router.push(result.url)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, posts..."
            className="flex-1 bg-transparent text-lg focus:outline-none"
          />
          {isLoading && <Loader2 size={20} className="animate-spin text-gray-400" />}
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative w-14 h-10 rounded overflow-hidden flex-shrink-0">
                      <Image src={result.image} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {result.type}
                      </span>
                      <h4 className="font-medium truncate">{result.title}</h4>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Type to search...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Form Handling

### Contact Form Component

```typescript
// src/components/frontend/sections/Contact.tsx
'use client'

import React, { useState } from 'react'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Something went wrong')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send')
    }
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="text-4xl font-bold text-center mb-4">Get in Touch</h2>
        <p className="text-gray-600 text-center mb-12">
          Ready to start your project? Let's discuss your vision.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="general">General Inquiry</option>
              <option value="project">Project Request</option>
              <option value="collaboration">Collaboration</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle size={20} />
              <span>Message sent successfully!</span>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={20} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </div>
    </section>
  )
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Run `pnpm run generate:types` to update Payload types
- [ ] Run `pnpm run build` to check for errors
- [ ] Test all forms and API routes locally
- [ ] Verify image optimization settings
- [ ] Check environment variables

### Environment Variables

```env
# Database
DATABASE_URI=mongodb+srv://...
BUILD_DATABASE=mongodb+srv://...

# Payload
PAYLOAD_SECRET=your-secret-key

# S3 Storage (optional)
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_REGION=your-region
S3_ENDPOINT=your-endpoint

# App
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

### Post-Deployment

- [ ] Verify admin panel access
- [ ] Test image uploads
- [ ] Submit sitemap to search engines
- [ ] Set up monitoring/analytics

---

## Prompt Template for New Projects

```
I have a pre-built React/Next.js frontend that I need to integrate with Payload CMS.

## Project Overview
- Project name: [NAME]
- Project type: [portfolio/e-commerce/blog/etc.]
- Demo frontend location: [attach files or folder path]

## Frontend Structure
Pages: [List pages]
Components: [List key components]
Animations: [GSAP/Framer Motion/CSS/none]

## Collections Needed
1. [Collection] - fields: [list]
2. [Collection] - fields: [list]

## Integration Requirements
1. Create Payload collections matching frontend data
2. Create TypeScript types with Payload-to-frontend converters
3. Create server components for data fetching
4. Create client components with existing animations
5. Integrate/create Header, Footer, Layout wrapper
6. Add dark/light mode support
7. Add global search across collections
8. Add contact form with Payload storage

## Styling
- Framework: Tailwind CSS
- Primary color: [hex]
- Fonts: [font names]

## Special Features
- [List any special features]

Please:
1. Analyze my demo frontend files
2. Create an implementation plan
3. Ask for confirmation before proceeding
4. Create all files with exact styling from demo
5. Generate types after creating collections
```

---

## Quick Reference

### Key Commands

```bash
# Development
pnpm dev

# Generate Payload types
pnpm run generate:types

# Build
pnpm build

# Start production
pnpm start
```

### File Creation Order

1. Collections → `src/collections/`
2. Update `payload.config.ts`
3. Run `generate:types`
4. Create `src/types/frontend.ts`
5. Create components → `src/components/frontend/`
6. Create pages → `src/app/(frontend)/`
7. Create API routes → `src/app/(frontend)/api/`
8. Update layout → `src/app/(frontend)/layout.tsx`
9. Update styles → `tailwind.config.mjs`, `globals.css`

### Common Patterns

```typescript
// Fetch with caching
export const revalidate = 600

// Get Payload instance
const payload = await getPayload({ config: configPromise })

// Query published docs
const result = await payload.find({
  collection: 'collection-name',
  where: { _status: { equals: 'published' } },
  depth: 2,
  limit: 50,
})

// Convert and return
return result.docs.map(docToFrontendType)
```
