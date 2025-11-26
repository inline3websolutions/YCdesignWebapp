import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'

import PortfolioClient from './PortfolioClient'
import { restoredMotoToProject, customMotoToProject } from '@/types/yc'
import type { Project } from '@/types/yc'

// Force dynamic rendering to avoid clientReferenceManifest issues during revalidation
export const dynamic = 'force-dynamic'

async function getRestoredMotos() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'restored-moto',
    depth: 2,
    limit: 50,
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
    limit: 50,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs
}

const getCachedRestoredMotos = unstable_cache(getRestoredMotos, ['restored-motos-all'], {
  tags: ['restored-moto'],
})

const getCachedCustomMotos = unstable_cache(getCustomMotos, ['custom-motos-all'], {
  tags: ['custom-motorcycles'],
})

export default async function PortfolioPage() {
  const [restoredMotos, customMotos] = await Promise.all([
    getCachedRestoredMotos(),
    getCachedCustomMotos(),
  ])

  // Convert Payload data to Project format
  const restorationProjects: Project[] = restoredMotos.map(restoredMotoToProject)
  const modificationProjects: Project[] = customMotos.map(customMotoToProject)

  // Combine all projects
  const allProjects: Project[] = [...restorationProjects, ...modificationProjects]

  return <PortfolioClient projects={allProjects} />
}

export const metadata: Metadata = {
  title: 'Portfolio | YC Design',
  description:
    'Explore our collection of restored and modified motorcycles. From faithful restorations to radical custom fabrications.',
}
