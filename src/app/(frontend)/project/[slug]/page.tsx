import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { restoredMotoToProject, customMotoToProject, getManufacturerName } from '@/types/yc'
import ProjectDetailClient from './ProjectDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Try to find in restored-moto first
  const restoredResult = await payload.find({
    collection: 'restored-moto',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (restoredResult.docs.length > 0) {
    const doc = restoredResult.docs[0]
    const manufacturerName = getManufacturerName(doc.manufacturer)
    return {
      title: `${doc.name} | YC Design`,
      description: `${manufacturerName} ${doc.name} (${doc.year}) - Restoration by YC Design`,
    }
  }

  // Try custom-motorcycles
  const customResult = await payload.find({
    collection: 'custom-motorcycles',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (customResult.docs.length > 0) {
    const doc = customResult.docs[0]
    const manufacturerName = getManufacturerName(doc.manufacturer)
    return {
      title: `${doc.name} | YC Design`,
      description: `${manufacturerName} ${doc.name} (${doc.year}) - Custom Build by YC Design`,
    }
  }

  return {
    title: 'Project Not Found | YC Design',
  }
}

async function getProject(slug: string) {
  const payload = await getPayload({ config: configPromise })

  // Try restored-moto
  const restoredResult = await payload.find({
    collection: 'restored-moto',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  if (restoredResult.docs.length > 0) {
    return restoredMotoToProject(restoredResult.docs[0])
  }

  // Try custom-motorcycles
  const customResult = await payload.find({
    collection: 'custom-motorcycles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  if (customResult.docs.length > 0) {
    return customMotoToProject(customResult.docs[0])
  }

  return null
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
