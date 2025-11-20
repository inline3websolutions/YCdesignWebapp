import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { CustomMotorcycle } from '../../../payload-types'

export const revalidateCustomMoto: CollectionAfterChangeHook<CustomMotorcycle> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/custom-motorcycles/${doc.slug}`

      payload.logger.info(`Revalidating custom motorcycle at path: ${path}`)

      revalidatePath(path)
      revalidateTag('custom-moto-sitemap')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/custom-motorcycles/${previousDoc.slug}`

      payload.logger.info(`Revalidating old custom motorcycle at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('custom-moto-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<CustomMotorcycle> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/custom-motorcycles/${doc?.slug}`

    revalidatePath(path)
    revalidateTag('custom-moto-sitemap')
  }

  return doc
}
