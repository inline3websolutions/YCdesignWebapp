import type { Metadata } from 'next/types'

import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import React from 'react'
import PageClient from './page.client'

// Static page - will be revalidated on-demand when content changes via Payload hooks
export const dynamic = 'force-static'

async function getMotorcycles() {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'custom-motorcycles',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      name: true,
      manufacturer: true,
      year: true,
      slug: true,
      heroImage: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
  })
}

// Cache with tags that will be invalidated by Payload hooks
const getCachedMotorcycles = unstable_cache(getMotorcycles, ['custom-motorcycles-listing'], {
  tags: ['custom-motorcycles', 'pages-custom-motorcycles'],
})

export default async function Page() {
  const { isEnabled: isDraftMode } = await draftMode()

  // Use direct fetch in draft mode (for live preview), cached otherwise
  const motorcycles = isDraftMode ? await getMotorcycles() : await getCachedMotorcycles()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Custom Motorcycles</h1>
          <p className="text-lg">Explore our collection of custom-built motorcycles</p>
        </div>
      </div>

      <div className="container mb-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {motorcycles.docs.length} of {motorcycles.totalDocs} motorcycles
        </p>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {motorcycles.docs && motorcycles.docs.length > 0 ? (
            motorcycles.docs.map((moto) => (
              <a
                key={moto.id}
                href={`/custom-motorcycles/${moto.slug}`}
                className="group block border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {moto.heroImage && typeof moto.heroImage === 'object' && (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={moto.heroImage.url || ''}
                      alt={moto.heroImage.alt || moto.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {moto.name}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">
                      {typeof moto.manufacturer === 'object'
                        ? moto.manufacturer?.name
                        : moto.manufacturer}
                    </p>
                    <p>Year: {moto.year}</p>
                  </div>
                  {moto.categories && moto.categories.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {moto.categories.slice(0, 2).map((category) => (
                        <span
                          key={typeof category === 'object' ? category.id : category}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                        >
                          {typeof category === 'object' ? category.title : category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No motorcycles found. Create one in the admin panel!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mt-12">
        {motorcycles.totalPages > 1 && motorcycles.page && (
          <Pagination page={motorcycles.page} totalPages={motorcycles.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Custom Motorcycles | YC Design',
    description: 'Explore our collection of custom-built motorcycles',
  }
}
