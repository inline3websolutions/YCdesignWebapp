'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Calendar, User } from 'lucide-react'
import gsap from 'gsap'
import type { Post, Category, Media } from '@/payload-types'

interface BlogClientProps {
  posts: Post[]
  categories: Category[]
}

const BlogClient: React.FC<BlogClientProps> = ({ posts, categories }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredPosts =
    activeCategory === 'all'
      ? posts
      : posts.filter((post) =>
          post.categories?.some((cat) => {
            const category = cat as Category
            return category.id?.toString() === activeCategory
          }),
        )

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
      )
    }, containerRef)

    return () => ctx.revert()
  }, [activeCategory])

  const getImageUrl = (post: Post): string => {
    const heroImage = post.heroImage as Media | undefined
    return heroImage?.url || '/placeholder.jpg'
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getAuthorName = (post: Post): string => {
    if (post.populatedAuthors && post.populatedAuthors.length > 0) {
      return post.populatedAuthors[0].name || 'YC Design'
    }
    return 'YC Design'
  }

  const getCategoryNames = (post: Post): string[] => {
    if (!post.categories) return []
    return post.categories
      .map((cat) => {
        const category = cat as Category
        return category.title || ''
      })
      .filter(Boolean)
  }

  return (
    <div ref={containerRef} className="pt-24 pb-12 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-syne font-bold text-zinc-900 dark:text-white mb-6 transition-colors duration-500">
              FROM THE <span className="text-yc-yellow">WORKSHOP</span>
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-rubik max-w-lg text-lg transition-colors duration-500">
              Stories, insights, and updates from the world of custom motorcycles and restorations.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 border font-syne uppercase text-xs tracking-wider transition-all duration-300 rounded-sm ${
                activeCategory === 'all'
                  ? 'bg-yc-yellow border-yc-yellow text-black font-bold'
                  : 'border-zinc-300 dark:border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900/50'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id.toString())}
                className={`px-5 py-2 border font-syne uppercase text-xs tracking-wider transition-all duration-300 rounded-sm ${
                  activeCategory === category.id.toString()
                    ? 'bg-yc-yellow border-yc-yellow text-black font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-900/50'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-16">
            <Link href={`/posts/${filteredPosts[0].slug}`} className="group block">
              <article className="blog-item grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 opacity-0">
                <div className="relative aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:border-yc-yellow/50 transition-all duration-500">
                  <Image
                    src={getImageUrl(filteredPosts[0])}
                    alt={filteredPosts[0].title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-10 h-10 flex items-center justify-center bg-yc-yellow rounded-full shadow-lg text-black">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getCategoryNames(filteredPosts[0]).map((name, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold text-yc-yellow uppercase tracking-widest border border-yc-yellow/20 px-2 py-1 rounded-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-syne font-bold text-zinc-900 dark:text-white group-hover:text-yc-yellow transition-colors mb-4">
                    {filteredPosts[0].title}
                  </h2>

                  <p className="text-zinc-600 dark:text-zinc-400 font-rubik text-lg mb-6 line-clamp-3">
                    {filteredPosts[0].meta?.description || 'Read the full story...'}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-zinc-500 font-rubik">
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      {getAuthorName(filteredPosts[0])}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={16} />
                      {formatDate(filteredPosts[0].publishedAt)}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map((post) => (
              <article key={post.id} className="blog-item group opacity-0">
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] bg-zinc-200 dark:bg-zinc-800 rounded-sm overflow-hidden border border-zinc-200 dark:border-zinc-800 group-hover:border-yc-yellow/50 transition-all duration-500 mb-4">
                    <Image
                      src={getImageUrl(post)}
                      alt={post.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="w-8 h-8 flex items-center justify-center bg-yc-yellow rounded-full shadow-lg text-black">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {getCategoryNames(post).map((name, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold text-yc-yellow uppercase tracking-widest"
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-syne font-bold text-zinc-900 dark:text-white group-hover:text-yc-yellow transition-colors mb-2">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-rubik">
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 dark:text-zinc-400 font-rubik text-lg">
              No posts found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogClient
