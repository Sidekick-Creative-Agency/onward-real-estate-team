import { Listing } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
export const findExistingListing = async (listingKeyNumeric: number | undefined) => {
  if (!listingKeyNumeric) return undefined
  const payload = await getPayload({ config: configPromise })

  const existingListing = await payload.find({
    collection: 'listings',
    where: {
      'MLS.ListingKeyNumeric': {
        equals: listingKeyNumeric,
      },
    },
    limit: 1,
  })
  if (existingListing.totalDocs === 0) {
    return undefined
  }
  return existingListing.docs[0]
}
