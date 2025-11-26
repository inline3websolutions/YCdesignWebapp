import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { RestoredMoto } from '../../../payload-types'

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

/**
 * Safely revalidate a tag, catching any errors from Next.js internal issues
 */
function safeRevalidateTag(tag: string, logger: { info: (msg: string) => void }) {
  try {
    revalidateTag(tag)
  } catch (error) {
    logger.info(`Warning: Could not revalidate tag ${tag}: ${error}`)
  }
}

export const revalidateMoto: CollectionAfterChangeHook<RestoredMoto> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/restored-moto/${doc.slug}`

      payload.logger.info(`Revalidating moto at path: ${path}`)

      safeRevalidatePath(path, payload.logger)
      safeRevalidateTag('moto-sitemap', payload.logger)
      // Also revalidate the home page cache tag since it displays restored motos
      safeRevalidateTag('restored-moto', payload.logger)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/restored-moto/${previousDoc.slug}`

      payload.logger.info(`Revalidating old moto at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      safeRevalidateTag('moto-sitemap', payload.logger)
      safeRevalidateTag('restored-moto', payload.logger)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<RestoredMoto> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/restored-moto/${doc?.slug}`

    safeRevalidatePath(path, payload.logger)
    safeRevalidateTag('moto-sitemap', payload.logger)
    safeRevalidateTag('restored-moto', payload.logger)
  }

  return doc
}
