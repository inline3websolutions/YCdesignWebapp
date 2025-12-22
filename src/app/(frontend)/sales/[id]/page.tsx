import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import SaleDetailClient from './SaleDetailClient'
import { saleToSaleBike, spareToSpareItem } from '@/types/yc'
import type { SaleItem } from '@/types/yc'

interface Props {
  params: Promise<{ id: string }>
}

async function getItemBySlug(slug: string): Promise<SaleItem | null> {
  const payload = await getPayload({ config: configPromise })

  // Try finding in Sales first
  const saleResult = await payload.find({
    collection: 'sales',
    depth: 2,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (saleResult.docs.length > 0) {
    return saleToSaleBike(saleResult.docs[0])
  }

  // If not found, try Spares
  const spareResult = await payload.find({
    collection: 'spares',
    depth: 2,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  if (spareResult.docs.length > 0) {
    return spareToSpareItem(spareResult.docs[0])
  }

  return null
}

async function getAllSlugs() {
  const payload = await getPayload({ config: configPromise })

  const [sales, spares] = await Promise.all([
    payload.find({
      collection: 'sales',
      depth: 0,
      limit: 100,
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'spares',
      depth: 0,
      limit: 100,
      where: { _status: { equals: 'published' } },
    }),
  ])

  return [...sales.docs, ...spares.docs]
}

// Cache individual item fetch
const getCachedItemBySlug = (slug: string) =>
  unstable_cache(() => getItemBySlug(slug), [`item-${slug}`], {
    tags: ['sales', 'spares', `sale-${slug}`],
  })()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = await getCachedItemBySlug(id)

  if (!item) {
    return { title: 'Item Not Found | YC Design' }
  }

  const desc = item.descriptionSummary.substring(0, 150)

  if (item.type === 'bike') {
    return {
      title: `${item.title} | For Sale | YC Design`,
      description: `${item.year} ${item.title} - ${item.engine}. ${desc}...`,
    }
  }

  return {
    title: `${item.title} | Store | YC Design`,
    description: `${item.title} - ${item.partCategory}. ${desc}...`,
  }
}

export async function generateStaticParams() {
  const items = await getAllSlugs()

  return items.map((item) => ({
    id: item.slug as string,
  }))
}

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params
  const { isEnabled: isDraftMode } = await draftMode()

  // Use direct fetch in draft mode, cached otherwise
  const item = isDraftMode ? await getItemBySlug(id) : await getCachedItemBySlug(id)

  if (!item) {
    notFound()
  }

  return <SaleDetailClient item={item} />
}
