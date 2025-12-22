import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Spare } from '../../../payload-types'

/**
 * Safely revalidate a path, catching any errors from Next.js internal issues
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

export const revalidateSpare: CollectionAfterChangeHook<Spare> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/sales/${doc.slug}`

      payload.logger.info(`Revalidating spare at path: ${path}`)

      safeRevalidatePath(path, payload.logger)
      safeRevalidatePath('/sales', payload.logger)
      safeRevalidateTag('sales', payload.logger)
      safeRevalidateTag('sales-sitemap', payload.logger)
      safeRevalidateTag(`sale-${doc.slug}`, payload.logger)
    }

    // If the spare was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/sales/${previousDoc.slug}`

      payload.logger.info(`Revalidating old spare at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      safeRevalidatePath('/sales', payload.logger)
      safeRevalidateTag('sales', payload.logger)
      safeRevalidateTag('sales-sitemap', payload.logger)
      safeRevalidateTag(`sale-${previousDoc.slug}`, payload.logger)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Spare> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/sales/${doc?.slug}`

    safeRevalidatePath(path, payload.logger)
    safeRevalidatePath('/sales', payload.logger)
    safeRevalidateTag('sales', payload.logger)
    safeRevalidateTag('sales-sitemap', payload.logger)
    if (doc?.slug) {
      safeRevalidateTag(`sale-${doc.slug}`, payload.logger)
    }
  }

  return doc
}
