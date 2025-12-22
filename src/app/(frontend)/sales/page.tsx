import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'

import SalesClient from './SalesClient'
import { saleToSaleBike, spareToSpareItem } from '@/types/yc'
import type { SaleItem } from '@/types/yc'

// Static page - will be revalidated on-demand when content changes via Payload hooks
export const dynamic = 'force-static'

async function getSales() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'sales',
    depth: 2,
    limit: 50,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  })

  return result.docs
}

async function getSpares() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'spares',
    depth: 2,
    limit: 50,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  })

  return result.docs
}

// Cache with tags that will be invalidated by Payload hooks
const getCachedSales = unstable_cache(getSales, ['sales-list'], {
  tags: ['sales', 'sales-sitemap'],
})

const getCachedSpares = unstable_cache(getSpares, ['spares-list'], {
  tags: ['spares', 'sales-sitemap'],
})

export const metadata: Metadata = {
  title: 'Store | YC Design',
  description:
    'Browse our collection of restored motorcycles and premium spare parts. Each item is verified for quality.',
}

export default async function SalesPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  // Use direct fetch in draft mode (for live preview), cached otherwise
  const [sales, spares] = isDraftMode
    ? await Promise.all([getSales(), getSpares()])
    : await Promise.all([getCachedSales(), getCachedSpares()])

  // Convert Payload data to SaleItem format
  const bikes = sales.map(saleToSaleBike)
  const spareItems = spares.map(spareToSpareItem)

  const allItems: SaleItem[] = [...bikes, ...spareItems]

  return <SalesClient items={allItems} />
}
