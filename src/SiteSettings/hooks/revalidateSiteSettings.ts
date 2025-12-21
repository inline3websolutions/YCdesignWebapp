import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

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

export const revalidateSiteSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating site-settings`)

    safeRevalidateTag('global_site-settings', payload.logger)
  }

  return doc
}
