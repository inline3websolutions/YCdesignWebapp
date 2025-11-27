import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import SaleDetailClient from './SaleDetailClient'
import { saleToSaleBike } from '@/types/yc'

interface Props {
  params: Promise<{ id: string }>
}

async function getSaleBySlug(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'sales',
    depth: 2,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs[0] || null
}

async function getAllSales() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'sales',
    depth: 1,
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs
}

// Cache individual sale fetch
const getCachedSaleBySlug = (slug: string) =>
  unstable_cache(() => getSaleBySlug(slug), [`sale-${slug}`], {
    tags: ['sales', `sale-${slug}`],
  })()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const sale = await getCachedSaleBySlug(id)

  if (!sale) {
    return { title: 'Bike Not Found | YC Design' }
  }

  const bike = saleToSaleBike(sale)

  return {
    title: `${bike.title} | For Sale | YC Design`,
    description: `${bike.year} ${bike.title} - ${bike.engine}. ${bike.description.substring(0, 150)}...`,
  }
}

export async function generateStaticParams() {
  const sales = await getAllSales()

  return sales.map((sale) => ({
    id: sale.slug,
  }))
}

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params
  const { isEnabled: isDraftMode } = await draftMode()

  // Use direct fetch in draft mode, cached otherwise
  const sale = isDraftMode ? await getSaleBySlug(id) : await getCachedSaleBySlug(id)

  if (!sale) {
    notFound()
  }

  const bike = saleToSaleBike(sale)

  return <SaleDetailClient bike={bike} />
}
