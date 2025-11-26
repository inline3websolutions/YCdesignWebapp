import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Sale } from '../../../payload-types'

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

export const revalidateSale: CollectionAfterChangeHook<Sale> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/sales/${doc.slug}`

      payload.logger.info(`Revalidating sale at path: ${path}`)

      safeRevalidatePath(path, payload.logger)
      revalidateTag('sales-sitemap')
    }

    // If the sale was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/sales/${previousDoc.slug}`

      payload.logger.info(`Revalidating old sale at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      revalidateTag('sales-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Sale> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/sales/${doc?.slug}`

    safeRevalidatePath(path, payload.logger)
    revalidateTag('sales-sitemap')
  }

  return doc
}
