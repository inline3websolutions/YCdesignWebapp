import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'

import SalesClient from './SalesClient'
import { saleToSaleBike } from '@/types/yc'

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

// Cache with tags that will be invalidated by Payload hooks
const getCachedSales = unstable_cache(getSales, ['sales-list'], {
  tags: ['sales', 'sales-sitemap'],
})

export const metadata: Metadata = {
  title: 'For Sale | YC Design',
  description:
    'Browse our collection of restored and custom motorcycles available for purchase. Each bike is a one-of-a-kind build from YC Design.',
}

export default async function SalesPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  // Use direct fetch in draft mode (for live preview), cached otherwise
  const sales = isDraftMode ? await getSales() : await getCachedSales()

  // Convert Payload data to SaleBike format
  const bikes = sales.map(saleToSaleBike)

  return <SalesClient bikes={bikes} />
}
