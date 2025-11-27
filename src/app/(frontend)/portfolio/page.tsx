import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import type { Metadata } from 'next'

import PortfolioClient from './PortfolioClient'
import { restoredMotoToProject, customMotoToProject } from '@/types/yc'
import type { Project } from '@/types/yc'

// Static page - will be revalidated on-demand when content changes via Payload hooks
export const dynamic = 'force-static'

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

// Cache with tags that will be invalidated by Payload hooks
const getCachedRestoredMotos = unstable_cache(
  getRestoredMotos,
  ['portfolio-restored-motos'],
  { tags: ['restored-moto', 'pages-portfolio'] }
)

const getCachedCustomMotos = unstable_cache(
  getCustomMotos,
  ['portfolio-custom-motos'],
  { tags: ['custom-motorcycles', 'pages-portfolio'] }
)

export default async function PortfolioPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  // Use direct fetch in draft mode (for live preview), cached otherwise
  const [restoredMotos, customMotos] = isDraftMode
    ? await Promise.all([getRestoredMotos(), getCustomMotos()])
    : await Promise.all([getCachedRestoredMotos(), getCachedCustomMotos()])

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
