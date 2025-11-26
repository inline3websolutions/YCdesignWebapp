import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

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

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      safeRevalidatePath(path, payload.logger)
      safeRevalidateTag('pages-sitemap', payload.logger)
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      safeRevalidateTag('pages-sitemap', payload.logger)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    safeRevalidatePath(path, payload.logger)
    safeRevalidateTag('pages-sitemap', payload.logger)
  }

  return doc
}
