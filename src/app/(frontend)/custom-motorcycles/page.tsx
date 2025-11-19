import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import PageClient from './page.client'
import Link from 'next/link'
import { Media } from '@/components/Media'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const motorcycles = await payload.find({
    collection: 'custom-motorcycles' as any,
    depth: 1,
    limit: 12,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Custom Motorcycles</h1>
        </div>
      </div>

      <div className="container">
        {motorcycles.docs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {motorcycles.docs.map((motorcycle) => (
              <Link
                href={`/custom-motorcycles/${motorcycle.slug}`}
                key={motorcycle.id}
                className="group block border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {motorcycle.gallery?.[0]?.image && (
                    <Media
                      resource={motorcycle.gallery[0].image}
                      fill
                      imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {!motorcycle.gallery?.[0]?.image && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold group-hover:underline">
                    {motorcycle.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div>No custom motorcycles found.</div>
        )}
      </div>
    </div>
  )
}
