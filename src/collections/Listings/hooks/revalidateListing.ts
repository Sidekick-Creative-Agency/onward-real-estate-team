import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Listing } from '../../../payload-types'

export const revalidateListing: CollectionAfterChangeHook<Listing> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/listings/${doc.slug}`

    payload.logger.info(`Revalidating listing at path: ${path}`)

    revalidatePath(path)
    revalidateTag('listings-sitemap', 'max')
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/listings/${previousDoc.slug}`

    payload.logger.info(`Revalidating old listing at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag('listings-sitemap', 'max')
  }

  return doc
}
