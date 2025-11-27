import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import type { Manufacturer } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

// Helper function to get manufacturer name from relationship
function getManufacturerName(
  manufacturer: string | number | Manufacturer | null | undefined,
): string {
  if (!manufacturer) return ''
  if (typeof manufacturer === 'object' && 'name' in manufacturer) {
    return manufacturer.name || ''
  }
  return ''
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const motorcycles = await payload.find({
    collection: 'restored-moto',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = motorcycles.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function MotoPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/restored-moto/' + decodedSlug
  const moto = await queryMotoBySlug({ slug: decodedSlug })

  if (!moto) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Hero Section */}
      <div className="container mb-12">
        {moto.heroImage && typeof moto.heroImage === 'object' && (
          <div className="aspect-video md:aspect-[21/9] rounded-lg overflow-hidden mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={moto.heroImage.url || ''}
              alt={moto.heroImage.alt || moto.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{moto.name}</h1>
          <div className="flex gap-4 text-lg text-gray-600 dark:text-gray-400 mb-8">
            <span className="font-semibold">{getManufacturerName(moto.manufacturer)}</span>
            <span>•</span>
            <span>{moto.year}</span>
          </div>

          {moto.categories && moto.categories.length > 0 && (
            <div className="flex gap-2 mb-8">
              {moto.categories.map((category) => (
                <span
                  key={typeof category === 'object' ? category.id : category}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                >
                  {typeof category === 'object' ? category.title : category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <RichText className="prose dark:prose-invert max-w-none" data={moto.content} />
        </div>
      </div>

      {/* Gallery Section */}
      {moto.images && moto.images.length > 0 && (
        <div className="container mt-16">
          <h2 className="text-3xl font-bold mb-8 max-w-4xl mx-auto">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {moto.images.map((image, index) => {
              if (typeof image === 'object') {
                return (
                  <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url || ''}
                      alt={image.alt || `${moto.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      )}

      {/* Related Motorcycles */}
      {moto.relatedMotorcycles && moto.relatedMotorcycles.length > 0 && (
        <div className="container mt-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Related Motorcycles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {moto.relatedMotorcycles.map((related) => {
                if (typeof related === 'object') {
                  return (
                    <a
                      key={related.id}
                      href={`/restored-moto/${related.slug}`}
                      className="group block border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {related.heroImage && typeof related.heroImage === 'object' && (
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={related.heroImage.url || ''}
                            alt={related.heroImage.alt || related.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                          {related.name}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>{getManufacturerName(related.manufacturer)}</p>
                          <p>{related.year}</p>
                        </div>
                      </div>
                    </a>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const moto = await queryMotoBySlug({ slug: decodedSlug })

  return generateMeta({ doc: moto })
}

const queryMotoBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'restored-moto',
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
