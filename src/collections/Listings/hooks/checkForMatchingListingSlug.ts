import type { CollectionBeforeChangeHook } from 'payload'
import type { Listing } from '../../../payload-types'

export const checkForMatchingListingSlug: CollectionBeforeChangeHook<Listing> = async ({
  data,
  req: { payload },
  operation,
  originalDoc,
}) => {
  if (!data.slug || !data.slugLock) {
    return data
  }

  try {
    const baseSlug = data.slug.trim()
    payload.logger.info(`Checking for matching slug: ${baseSlug}`)

    const findWithTimeout = async () => {
      let timeoutHandle: NodeJS.Timeout | undefined
      try {
        return await Promise.race([
          payload.find({
            collection: 'listings',
            // Only fetch slugs that start with the base slug
            where: {
              slug: {
                like: `${baseSlug}%`,
              },
            },
            limit: 1000,
            depth: 0,
          }),
          new Promise<null>((resolve) => {
            timeoutHandle = setTimeout(() => resolve(null), 10000)
          }),
        ])
      } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle)
      }
    }

    const existingListings = await findWithTimeout()
    if (existingListings === null) {
      payload.logger.warn(`Timeout while checking slug: ${baseSlug}`)
      return data
    }

    if (!existingListings || existingListings.totalDocs === 0) {
      return data
    }

    const matchingListings = existingListings.docs.filter((listing) => {
      if (operation === 'update' && originalDoc && listing.id === originalDoc.id) {
        return false
      }
      return listing.slug === baseSlug || listing.slug?.startsWith(`${baseSlug}-`)
    })

    if (matchingListings.length > 0) {
      // Enumerate all existing suffixes and pick the next number
      const used = new Set<number>()
      for (const listing of matchingListings) {
        if (listing.slug === baseSlug) {
          used.add(0)
          continue
        }
        const match = listing.slug?.match(new RegExp(`^${baseSlug}-(\\d+)$`))
        if (match?.[1]) used.add(Number(match[1]))
      }

      let next = 1
      while (used.has(next)) next += 1
      data.slug = `${baseSlug}-${next}`
    } else {
      data.slug = baseSlug
    }

    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    payload.logger.error(`Error validating slug: ${message}`)
    return data
  }
}
