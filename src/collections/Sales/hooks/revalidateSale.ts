import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Sale } from '../../../payload-types'

export const revalidateSale: CollectionAfterChangeHook<Sale> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/sales/${doc.slug}`

      payload.logger.info(`Revalidating sale at path: ${path}`)

      revalidatePath(path)
      revalidateTag('sales-sitemap')
    }

    // If the sale was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/sales/${previousDoc.slug}`

      payload.logger.info(`Revalidating old sale at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('sales-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Sale> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/sales/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('sales-sitemap')
  }

  return doc
}
