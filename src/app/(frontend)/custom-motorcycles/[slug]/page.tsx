import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React, { cache } from 'react'
import PageClient from './page.client'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const motorcycles = await payload.find({
    collection: 'custom-motorcycles',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return motorcycles.docs.map(({ slug }) => {
    return { slug }
  })
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/custom-motorcycles/' + slug
  const motorcycle = await queryMotorcycleBySlug({ slug })

  if (!motorcycle) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pt-24 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1>{motorcycle.title}</h1>
        </div>
      </div>

      <div className="container">
        {motorcycle.gallery && motorcycle.gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {motorcycle.gallery.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                  {item.image && (
                    <Media
                      resource={item.image}
                      fill
                      imgClassName="object-cover"
                    />
                  )}
                </div>
                {item.caption && (
                  <p className="text-sm text-muted-foreground text-center italic">
                    {item.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">No images in gallery.</div>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const motorcycle = await queryMotorcycleBySlug({ slug })

  return {
    title: motorcycle?.title || 'Custom Motorcycle',
    description: `Gallery for ${motorcycle?.title}`,
  }
}

const queryMotorcycleBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'custom-motorcycles',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
