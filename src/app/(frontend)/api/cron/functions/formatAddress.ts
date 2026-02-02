import { RETSListing } from '../types/types'

export const formatAddress = (listing: RETSListing) => {
  return `${listing.StreetNumber ? `${listing.StreetNumber} ` : ''}${listing.StreetName}${listing.StreetSuffix ? ` ${listing.StreetSuffix}` : ''}, ${listing.City}, ${listing.StateOrProvince} ${listing.PostalCode}`
}
