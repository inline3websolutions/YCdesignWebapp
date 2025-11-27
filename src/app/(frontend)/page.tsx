import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

import HomeClient from './HomeClient'
import { restoredMotoToProject, customMotoToProject, testimonials } from '@/types/yc'
import type { Project } from '@/types/yc'

// Static page - will be revalidated on-demand when content changes via Payload hooks
export const dynamic = 'force-static'

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

// Cache with tags that will be invalidated by Payload hooks
const getCachedRestoredMotos = unstable_cache(getRestoredMotos, ['home-restored-motos'], {
  tags: ['restored-moto', 'pages-home'],
})

const getCachedCustomMotos = unstable_cache(getCustomMotos, ['home-custom-motos'], {
  tags: ['custom-motorcycles', 'pages-home'],
})

export default async function HomePage() {
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

  return <HomeClient projects={allProjects} testimonials={testimonials} />
}

export const metadata: Metadata = {
  title: 'YC Design | Preserving Legends. Building Icons.',
  description:
    'Custom motorcycle restoration and modification workshop in Mumbai. We specialize in bringing vintage mechanical souls back to life with modern precision.',
}
