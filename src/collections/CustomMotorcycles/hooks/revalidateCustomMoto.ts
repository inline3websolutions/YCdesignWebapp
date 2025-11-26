import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { CustomMotorcycle } from '../../../payload-types'

/**
 * Safely revalidate a path, catching any errors from Next.js internal issues
 * (e.g., clientReferenceManifest errors during on-demand revalidation)
 */
function safeRevalidatePath(path: string, logger: { info: (msg: string) => void }) {
  try {
    revalidatePath(path)
  } catch (error) {
    logger.info(`Warning: Could not revalidate path ${path}: ${error}`)
  }
}

export const revalidateCustomMoto: CollectionAfterChangeHook<CustomMotorcycle> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/custom-motorcycles/${doc.slug}`

      payload.logger.info(`Revalidating custom motorcycle at path: ${path}`)

      safeRevalidatePath(path, payload.logger)
      revalidateTag('custom-moto-sitemap')
      // Also revalidate the home page cache tag since it displays custom motorcycles
      revalidateTag('custom-motorcycles')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/custom-motorcycles/${previousDoc.slug}`

      payload.logger.info(`Revalidating old custom motorcycle at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      revalidateTag('custom-moto-sitemap')
      revalidateTag('custom-motorcycles')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<CustomMotorcycle> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/custom-motorcycles/${doc?.slug}`

    safeRevalidatePath(path, payload.logger)
    revalidateTag('custom-moto-sitemap')
    revalidateTag('custom-motorcycles')
  }

  return doc
}
