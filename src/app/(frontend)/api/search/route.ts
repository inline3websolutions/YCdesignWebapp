import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Media } from '@/payload-types'

export interface SearchResult {
  id: string
  type: 'restoration' | 'modification' | 'sale' | 'post'
  title: string
  description: string
  image: string
  url: string
  year?: number
  manufacturer?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], message: 'Query too short' }, { status: 200 })
    }

    const payload = await getPayload({ config: configPromise })
    const results: SearchResult[] = []

    // Search Restored Motorcycles
    const restoredResults = await payload.find({
      collection: 'restored-moto',
      where: {
        or: [{ name: { contains: query } }, { manufacturer: { contains: query } }],
        _status: { equals: 'published' },
      },
      limit: 5,
      depth: 1,
    })

    restoredResults.docs.forEach((doc) => {
      const heroImage = doc.heroImage as Media | undefined
      results.push({
        id: String(doc.id),
        type: 'restoration',
        title: doc.name,
        description: `${doc.manufacturer} ${doc.year}`,
        image: heroImage?.url || '/placeholder.jpg',
        url: `/project/${doc.slug}`,
        year: doc.year,
        manufacturer: doc.manufacturer,
      })
    })

    // Search Custom Motorcycles
    const customResults = await payload.find({
      collection: 'custom-motorcycles',
      where: {
        or: [{ name: { contains: query } }, { manufacturer: { contains: query } }],
        _status: { equals: 'published' },
      },
      limit: 5,
      depth: 1,
    })

    customResults.docs.forEach((doc) => {
      const heroImage = doc.heroImage as Media | undefined
      results.push({
        id: String(doc.id),
        type: 'modification',
        title: doc.name,
        description: `${doc.manufacturer} ${doc.year}`,
        image: heroImage?.url || '/placeholder.jpg',
        url: `/project/${doc.slug}`,
        year: doc.year,
        manufacturer: doc.manufacturer,
      })
    })

    // Search Posts
    const postResults = await payload.find({
      collection: 'posts',
      where: {
        title: { contains: query },
        _status: { equals: 'published' },
      },
      limit: 5,
      depth: 1,
    })

    postResults.docs.forEach((doc) => {
      const heroImage = doc.heroImage as Media | undefined
      results.push({
        id: String(doc.id),
        type: 'post',
        title: doc.title,
        description: doc.meta?.description || 'Blog post',
        image: heroImage?.url || '/placeholder.jpg',
        url: `/posts/${doc.slug}`,
      })
    })

    return NextResponse.json({ results, total: results.length }, { status: 200 })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], message: 'Search failed' }, { status: 500 })
  }
}
