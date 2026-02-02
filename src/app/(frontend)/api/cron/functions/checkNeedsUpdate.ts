import { Listing } from '@/payload-types'
import { RETSListing } from '../types/types'

export const checkNeedsUpdate = (listing: Listing, retsListing: RETSListing) => {
  if (listing.MLS?.ModificationTimestamp === retsListing.ModificationTimestamp) {
    return false
  }
  return true
}
