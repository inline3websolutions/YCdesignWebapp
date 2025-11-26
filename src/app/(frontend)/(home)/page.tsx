import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

import HomeClient from './HomeClient'
import { restoredMotoToProject, customMotoToProject, testimonials } from '@/types/yc'
import type { Project } from '@/types/yc'

// Force dynamic rendering to avoid clientReferenceManifest issues during revalidation
export const dynamic = 'force-dynamic'

async function getRestoredMotos() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'restored-moto',
    depth: 2,
    limit: 10,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs
}

async function getCustomMotos() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'custom-motorcycles',
    depth: 2,
    limit: 10,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs
}

const getCachedRestoredMotos = unstable_cache(getRestoredMotos, ['restored-motos'], {
  tags: ['restored-moto'],
})

const getCachedCustomMotos = unstable_cache(getCustomMotos, ['custom-motos'], {
  tags: ['custom-motorcycles'],
})

export default async function HomePage() {
  const [restoredMotos, customMotos] = await Promise.all([
    getCachedRestoredMotos(),
    getCachedCustomMotos(),
  ])

  // Convert Payload data to Project format
  const restorationProjects: Project[] = restoredMotos.map(restoredMotoToProject)
  const modificationProjects: Project[] = customMotos.map(customMotoToProject)

  // Combine all projects
  const allProjects: Project[] = [...restorationProjects, ...modificationProjects]

  return <HomeClient projects={allProjects} testimonials={testimonials} />
}

export const metadata: Metadata = {
  title: 'YC Design | Preserving Legends. Building Icons.',
  description:
    'Custom motorcycle restoration and modification workshop in Mumbai. We specialize in bringing vintage mechanical souls back to life with modern precision.',
}
