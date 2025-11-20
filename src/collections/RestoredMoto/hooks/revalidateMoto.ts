import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { RestoredMoto } from '../../../payload-types'

export const revalidateMoto: CollectionAfterChangeHook<RestoredMoto> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/restored-moto/${doc.slug}`

      payload.logger.info(`Revalidating moto at path: ${path}`)

      revalidatePath(path)
      revalidateTag('moto-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/restored-moto/${previousDoc.slug}`

      payload.logger.info(`Revalidating old moto at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('moto-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<RestoredMoto> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/restored-moto/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('moto-sitemap')
  }

  return doc
}
