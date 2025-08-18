import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = doc.url === '/home' ? '/' : `${doc.url}`

    payload.logger.info(`Revalidating page at path: ${path}`)

    revalidatePath(path)
    revalidateTag('pages-sitemap')
  }

  // If the page was previously published, we need to revalidate the old path
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.url === '/home' ? '/' : `${previousDoc.url}`

    payload.logger.info(`Revalidating old page at path: ${oldPath}`)

    revalidatePath(oldPath)
    revalidateTag('pages-sitemap')
  }

  return doc
}
