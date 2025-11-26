import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/**
 * Safely revalidate a tag, catching any errors from Next.js internal issues
 * (e.g., clientReferenceManifest errors during on-demand revalidation)
 */
function safeRevalidateTag(tag: string, logger: { info: (msg: string) => void }) {
  try {
    revalidateTag(tag)
  } catch (error) {
    logger.info(`Warning: Could not revalidate tag ${tag}: ${error}`)
  }
}

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  safeRevalidateTag('redirects', payload.logger)

  return doc
}
