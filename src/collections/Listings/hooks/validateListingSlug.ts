import type { CollectionAfterChangeHook, CollectionBeforeChangeHook } from 'payload'
import type { Listing } from '../../../payload-types'

export const validateListingSlug: CollectionBeforeChangeHook<Listing> = async ({
  data,
  req: { payload },
  operation,
  originalDoc,
}) => {
  if (!data.slug) {
    return data
  }
  try {
    console.log('Validating slug:', data.slug)
    console.log('ID of original document:', originalDoc?.id)
    // Get the base slug (remove any trailing -number)
    const baseSlug = data.slug

    // Find all listings that match this slug pattern
    const existingListings = await payload.find({
      collection: 'listings',
      where: {
        slug: {
          equals: baseSlug,
        },
      },
      limit: 1000,
    })

    if (!existingListings || existingListings.totalDocs === 0) {
      console.log('No existing listings found with slug:', baseSlug)
      return data
    }

    // Filter to get only listings that match the exact pattern (base or base-number)
    const matchingListings = existingListings.docs.filter((listing) => {
      // Exclude the current document if we're updating
      if (operation === 'update' && originalDoc && listing.id === originalDoc.id) {
        return false
      }
      return listing.slug === baseSlug
    })

    if (data.slugLock) {
      // If there are existing listings with this slug, append a number
      if (matchingListings.length > 0) {
        const newSlug = `${baseSlug}-${matchingListings.length}`
        payload.logger.info(
          `${matchingListings.length} listing(s) already exist with slug: ${baseSlug}, updating slug to ${newSlug}`,
        )
        data.slug = newSlug
      } else {
        // No conflicts, use the base slug
        data.slug = baseSlug
      }
    }

    return data
  } catch (error) {
    payload.logger.error('Error validating slug:', error)
    return data
  }
}
