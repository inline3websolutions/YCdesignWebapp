import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { saleBikes } from '@/types/yc'
import SaleDetailClient from './SaleDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const bike = saleBikes.find((b) => b.id === id || b.slug === id)

  if (!bike) {
    return { title: 'Bike Not Found | YC Design' }
  }

  return {
    title: `${bike.title} | For Sale | YC Design`,
    description: `${bike.year} ${bike.title} - ${bike.engine}. ${bike.description.substring(0, 150)}...`,
  }
}

export async function generateStaticParams() {
  return saleBikes.map((bike) => ({
    id: bike.slug || bike.id,
  }))
}

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params
  const bike = saleBikes.find((b) => b.id === id || b.slug === id)

  if (!bike) {
    notFound()
  }

  return <SaleDetailClient bike={bike} />
}
